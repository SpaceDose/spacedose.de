import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import {useLiveQuery} from 'dexie-react-hooks';
import {type FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {SlideRow} from '../../../components/slide-row';
import {useDb, type Meal} from '../../provider/database';
import {getKCalForEntries, getKCalFromEntry} from '../../../utils/kcal';

export const MealDisplay: FC<{meal: Meal; hideTitle?: boolean}> = ({
  meal,
  hideTitle,
}) => {
  const db = useDb();
  const navigate = useNavigate();

  const entries = useLiveQuery(
    () => db.entries.where('id').anyOf(meal.entryIds).toArray(),
    [meal],
  );

  return (
    <SlideRow
      left={{
        action: () => db.meals.delete(meal.id),
        Icon: TrashIcon,
        color: 'green',
      }}
      right={{
        action: () => navigate(`./${meal.id}`),
        Icon: PencilIcon,
        color: 'orange',
      }}
    >
      {(!hideTitle || (meal.title && meal.title.length > 0)) && (
        <div className='flex justify-between px-2 text-sm text-orange-light'>
          <div>
            {meal.title && meal.title.length > 0 ? meal.title : 'Other'}
          </div>
          <div>{entries && `${getKCalForEntries(entries)} kcal`}</div>
        </div>
      )}

      <div className='px-2'>
        {entries?.map((entry, index) => (
          <div
            key={`${entry.title}-${index}`}
            className='flex w-full justify-between gap-8 text-xs font-thin text-orange-light'
          >
            <p className='truncate'>
              {entry.title && entry.title.length > 0 ? entry.title : '-'}
            </p>

            <p className='shrink-0'>{getKCalFromEntry(entry)} kcal</p>
          </div>
        ))}
      </div>
    </SlideRow>
  );
};
