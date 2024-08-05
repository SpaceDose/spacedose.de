import {useLiveQuery} from 'dexie-react-hooks';
import {type FC} from 'react';
import {useDb, type Meal} from '../../../provider/database';
import {getKCalForEntries, readableDate} from '../../../utils/kcal';
import {MealDisplay} from './meal-display';

type DayCardProps = {
  date: string;
  meals: Meal[];
};

export const DayDisplay: FC<DayCardProps> = ({date, meals}) => {
  const db = useDb();
  const entries = useLiveQuery(() =>
    db.entries
      .where('id')
      .anyOf(meals.flatMap((meal) => meal.entryIds))
      .toArray(),
  );

  if (!entries) return;

  return (
    <div key={date} className='border-t first:border-none'>
      <div className='flex justify-between px-4 py-2 text-sm text-gray'>
        <p>{readableDate(new Date(date))}</p>
        <p className='font-bold text-purple-light'>
          {getKCalForEntries(entries)} kcal
        </p>
      </div>

      {meals?.map((meal) => <MealDisplay key={meal.id} meal={meal} />)}

      {!meals ||
        (meals?.length === 0 && (
          <div className='p-3 text-gray'>No meals found...</div>
        ))}
    </div>
  );
};
