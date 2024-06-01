import {useCallback, useEffect, useState, type FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Page} from '../page';
import {type Meal, useDb} from '../provider/database';
import {
  getFrom,
  getKCalFromEntry,
  getUntil,
  isSameDay,
  readableDate,
} from '../utils/kcal';
import {FAB} from './components/fab';
import {MealCard} from './components/meal-card';
import {MealForm} from './components/meal-form';
import {SlideView} from './components/slide-view';

type Day = {
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

  return (
    <Page
      title='KCal'
      className='flex min-h-screen flex-col items-center justify-between gap-4'
    >
      <div
        className='flex w-full flex-col overflow-y-auto'
        onScroll={(e) => {
          if (
            e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
            e.currentTarget.clientHeight
          ) {
            setMaxDays(maxDays + 7);
          }
        }}
      >
        {days
          ?.sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((day, index) => (
            <div
              key={`${day.date.toISOString()} ${index}`}
              className='border-t first:border-none'
            >
              <div className='flex justify-between p-2 text-white/50'>
                <p className='text-sm'>{readableDate(day.date)}</p>
                <p className='text-sm'>
                  {day.meals.reduce(
                    (acc, curr) =>
                      acc +
                      curr.entries.reduce(
                        (accEntry, currEntry) =>
                          accEntry + getKCalFromEntry(currEntry),
                        0,
                      ),
                    0,
                  )}{' '}
                  kcal
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
                <div className='p-3 text-white/25'>No meals found...</div>
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
          navigate(`./${id}`);
        }}
      />

      <SlideView show={!!mealId} close={() => navigate('/kcal')}>
        <MealForm update={(date) => loadDay(date)} />
      </SlideView>
    </Page>
  );
};
