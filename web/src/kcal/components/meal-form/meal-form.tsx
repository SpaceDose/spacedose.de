import {useFormBuilder} from '@atmina/formbuilder';
import {TrashIcon, PencilIcon} from '@heroicons/react/24/outline';
import {useLiveQuery} from 'dexie-react-hooks';
import {useEffect, useState, type FC} from 'react';
import {useParams} from 'react-router-dom';
import {DateInput} from '../../../components/date-input';
import {Input} from '../../../components/input';
import {SlideRow} from '../../../components/slide-row';
import {type Entry, type Meal, useDb} from '../../../provider/database';
import {getKCalFromEntry} from '../../../utils/kcal';
import {EntryForm} from './entry-form';

export const MealForm: FC = () => {
  const {mealId} = useParams();
  const db = useDb();
  const {fields, handleSubmit, reset} = useFormBuilder<Meal>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry>();

  const meal = useLiveQuery(async () => {
    if (mealId) {
      const m = await db.meals.get(parseInt(mealId));

      if (m) {
        const e = await db.entries.where('id').anyOf(m.entryIds).toArray();
        setEntries(e);
        return m;
      }
    }
  });

  useEffect(() => {
    reset(meal);
  }, [meal, reset]);

  const submit = handleSubmit(async ({title, date}) => {
    if (meal) {
      db.meals.update(meal.id, {
        ...meal,
        title,
        date,
      });
    }
  });

  const removeEntry = async (entry: Entry) => {
    if (meal) {
      await db.meals.update(meal, {
        ...meal,
        entryIds: [...meal.entryIds.filter((e) => e !== entry.id)],
      });

      await db.entries.delete(entry.id);
    }
  };

  if (!meal) return null;

  return (
    <div className='flex grow flex-col gap-4 overflow-hidden pb-4'>
      <form onBlur={submit} className='flex flex-col gap-2 px-4'>
        <p className='text-sm font-thin'>Meal</p>
        <Input field={fields.title()} label='Title' />
        <DateInput label='Date' on={fields.date} />
      </form>

      <div className='flex grow flex-col overflow-hidden border-y pt-4'>
        <p className='px-4 text-sm font-thin'>Entries</p>

        <div className='flex flex-col overflow-y-auto'>
          {entries?.map((entry, index) => (
            <SlideRow
              key={`${entry.title}-${index}`}
              left={{
                action: () => removeEntry(entry),
                color: 'purple',
                Icon: TrashIcon,
              }}
              right={{
                action: () => setSelectedEntry(entry),
                color: 'orange',
                Icon: PencilIcon,
              }}
            >
              <div className='flex size-full items-center justify-between px-2'>
                <div>
                  {entry.title && entry.title.length > 0 ? entry.title : '-'}
                </div>

                <div className='flex flex-col text-right'>
                  <p>{getKCalFromEntry(entry)} kcal</p>
                  <p className='text-xs font-thin text-purple-light'>{`${entry.gram}g / ${entry.kcal}kcal`}</p>
                </div>
              </div>
            </SlideRow>
          ))}
        </div>
      </div>

      <EntryForm meal={meal} entry={selectedEntry} />
    </div>
  );
};
