import {
  type TouchEventHandler,
  useCallback,
  useEffect,
  useState,
  type FC,
} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FAB} from '../components/fab';
import {SlideView} from '../components/slide-view';
import {Page} from '../page';
import {type Meal, useDb} from '../provider/database';
import {
  getFrom,
  getKCalForDay,
  getUntil,
  isSameDay,
  readableDate,
} from '../utils/kcal';
import {DailyChart} from './components/daily-chart';
import {MealCard} from './components/meal-card';
import {MealForm} from './components/meal-form';

export type Day = {
  date: Date;
  meals: Meal[];
};

export const Kcal: FC = () => {
  const {mealId} = useParams();
  const db = useDb();
  const navigate = useNavigate();

  const [maxDays, setMaxDays] = useState<number>(14);
  const [days, setDays] = useState<Day[]>([]);

  const loadDay = useCallback(
    async (date: Date) => {
      const meals = await db.meals
        .where('date')
        .between(getFrom(date), getUntil(date))
        .toArray();

      setDays((days) => [
        ...days.filter((d) => !isSameDay(d.date, date)),
        {date, meals},
      ]);
    },
    [db],
  );

  useEffect(() => {
    if (days.length < maxDays) {
      if (days.length === 0) {
        loadDay(new Date(Date.now()));
      } else {
        const lastDate = new Date(
          days.sort((a, b) => a.date.getTime() - b.date.getTime())[0].date,
        );
        lastDate.setDate(lastDate.getDate() - 1);

        loadDay(lastDate);
      }
    }
  }, [days, loadDay, maxDays]);

  const handleScroll: TouchEventHandler<HTMLDivElement> = (e) => {
    if (
      e.currentTarget.offsetHeight + e.currentTarget.scrollTop ===
      e.currentTarget.scrollHeight
    ) {
      setMaxDays(maxDays + 7);
    }
  };

  return (
    <Page className='flex h-full flex-col items-center justify-between gap-4'>
      <DailyChart days={days} />

      <div
        className='flex w-full flex-col overflow-y-auto'
        onTouchMove={handleScroll}
        onScroll={handleScroll}
      >
        {days
          ?.sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((day, index) => (
            <div
              key={`${day.date.toISOString()} ${index}`}
              className='border-t first:border-none'
            >
              <div className='flex justify-between px-4 py-2 text-gray'>
                <p className='text-sm'>{readableDate(day.date)}</p>
                <p className='text-sm font-semibold text-orange-light'>
                  {getKCalForDay(day)} kcal
                </p>
              </div>

              {day.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  update={() => loadDay(meal.date)}
                />
              ))}

              {day.meals.length === 0 && (
                <div className='p-3 text-gray'>No meals found...</div>
              )}
            </div>
          ))}
      </div>

      <FAB
        onClick={async () => {
          const id = await db.meals.add({
            title: '',
            date: new Date(Date.now()),
            entries: [],
          });
          loadDay(new Date(Date.now()));
          navigate(`./${id}`);
        }}
      />

      <SlideView show={!!mealId} close={() => navigate(-1)}>
        <MealForm update={(date) => loadDay(date)} />
      </SlideView>
    </Page>
  );
};
