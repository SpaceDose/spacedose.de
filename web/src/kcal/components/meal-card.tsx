import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import {type FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDb, type Meal} from '../../provider/database';
import {getKCalFromEntry} from '../../utils/kcal';
import {SlideRow} from '../slide-row';

export const MealCard: FC<{meal: Meal; update: () => void}> = ({
  meal,
  update,
}) => {
  const db = useDb();
  const navigate = useNavigate();

  return (
    <SlideRow
      left={{
        action: () => {
          db.meals.delete(meal.id);
          update();
        },
        Icon: TrashIcon,
        color: 'green',
      }}
      right={{
        action: () => {
          navigate(`./${meal.id}`);
        },
        Icon: PencilIcon,
        color: 'orange',
      }}
    >
      <div className='flex justify-between font-semibold text-orange-light'>
        <div>{meal.title}</div>
        <div>
          {meal?.entries.reduce((acc, curr) => acc + getKCalFromEntry(curr), 0)}{' '}
          kcal
        </div>
      </div>

      <div>
        {meal?.entries.map((entry, index) => (
          <div
            key={`${entry.title}-${index}`}
            className='flex w-full justify-between text-xs font-thin text-orange-light'
          >
            <div>{entry.title ?? '-'}</div>
            <div>{getKCalFromEntry(entry)} kcal</div>
          </div>
        ))}
      </div>
    </SlideRow>
  );
};
