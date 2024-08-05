import {useEffect, useState, type FC} from 'react';
import {type Entry, type Meal, useDb} from '../../provider/database';
import {getKCalForEntries, readableDate} from '../../utils/kcal';
import {MealCard} from './meal-card';

type DayCardProps = {
  date: string;
  meals: Meal[];
};

export const DayCard: FC<DayCardProps> = ({date, meals}) => {
  const db = useDb();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    db.entries
      .where('id')
      .anyOf(meals.flatMap((meal) => meal.entryIds))
      .toArray()
      .then((res) => setEntries(res));
  }, [db.entries, meals]);

  return (
    <div key={date} className='border-t first:border-none'>
      <div className='flex justify-between px-4 py-2 text-sm text-gray'>
        <p>{readableDate(new Date(date))}</p>
        <p className='font-bold text-purple-light'>
          {getKCalForEntries(entries)} kcal
        </p>
      </div>

      {meals?.map((meal) => <MealCard key={meal.id} meal={meal} />)}

      {!meals ||
        (meals?.length === 0 && (
          <div className='p-3 text-gray'>No meals found...</div>
        ))}
    </div>
  );
};
