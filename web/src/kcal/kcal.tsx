import {useLiveQuery} from 'dexie-react-hooks';
import {type TouchEventHandler, useEffect, useState, type FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FAB} from '../components/fab';
import {SlideView} from '../components/slide-view';
import {Page} from '../page';
import {type Meal, useDb} from '../provider/database';
import {seedExampleData} from '../provider/seeder';
import {DailyChart} from './components/daily-chart';
import {DayDisplay} from './components/day-display/day-display';
import {MealForm} from './components/meal-form/meal-form';

export type Day = {
  date: Date;
  meals: Meal[];
};

export const Kcal: FC = () => {
  const {mealId} = useParams();
  const db = useDb();
  const navigate = useNavigate();

  const [maxDays, setMaxDays] = useState<number>(14);

  const [days, setDays] = useState<[string, Meal[] | undefined][]>([]);
  const meals = useLiveQuery(() => db.meals.toArray());

  useEffect(() => {
    setDays(
      Object.entries(
        Object.groupBy(meals ?? [], (meal) => meal.date.toDateString()),
      ).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()),
    );
  }, [meals]);

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
      <DailyChart days={days.slice(1, 8)} />

      <div
        className='flex w-full grow flex-col overflow-y-auto pb-32'
        onTouchMove={handleScroll}
        onScroll={handleScroll}
      >
        {days.map(([date, meals]) => (
          <DayDisplay key={date} date={date} meals={meals ?? []} />
        ))}
      </div>

      <FAB
        onClick={async () => {
          const newMealId = await db.meals.add({
            date: new Date(),
            entryIds: [],
          });

          navigate(`./${newMealId}`);
        }}
      />

      {import.meta.env.DEV && (
        <FAB
          left
          onClick={async () => {
            seedExampleData(db);
          }}
        />
      )}

      <SlideView show={!!mealId} close={() => navigate(-1)}>
        <MealForm />
      </SlideView>
    </Page>
  );
};
