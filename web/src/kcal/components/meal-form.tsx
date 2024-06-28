import {useFormBuilder} from '@atmina/formbuilder';
import {TrashIcon, PencilIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useLiveQuery} from 'dexie-react-hooks';
import {useEffect, useState, type FC} from 'react';
import {useParams} from 'react-router-dom';
import {twMerge} from 'tailwind-merge';
import {DateInput} from '../../components/date-input';
import {Input} from '../../components/input';
import {SlideRow} from '../../components/slide-row';
import {type Entry, useDb, type Meal} from '../../provider/database';
import {getKCalFromEntry} from '../../utils/kcal';

const NewEntryForm: FC<{
  meal: Meal;
  entryIndex?: number;
  update: () => void;
}> = ({meal, entryIndex, update}) => {
  const db = useDb();
  const {fields, handleSubmit, reset} = useFormBuilder<Entry>();

  useEffect(() => {
    entryIndex !== undefined
      ? reset(meal.entries[entryIndex])
      : reset({title: '', gram: 0, kcal: 0});
  }, [entryIndex, meal, reset]);

  return (
    <form
      className='flex flex-col gap-2 px-4'
      onSubmit={handleSubmit((entry) => {
        if (entryIndex) {
          const newEntries = [...meal.entries];
          newEntries[entryIndex] = entry;
          db.meals.update(meal, {...meal, entries: newEntries});
        } else {
          db.meals.update(meal, {...meal, entries: [...meal.entries, entry]});
        }
        update();
      })}
    >
      <div className='flex items-center justify-between text-sm font-thin'>
        <p>{entryIndex !== undefined ? 'Edit entry' : 'Add a new entry'}</p>

        <button
          type='button'
          className={twMerge(
            'p-1',
            entryIndex !== undefined ? 'visible' : 'invisible',
          )}
          onClick={() => {
            update();
          }}
        >
          <XMarkIcon className='w-6' />
        </button>
      </div>

      <Input field={fields.title()} label='Title' />

      <div className='flex gap-2'>
        <Input field={fields.gram()} label='portion in g' type='number' />
        <Input field={fields.kcal()} label='kcal per 100g' type='number' />
      </div>

      <button className='text-white mt-1 rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light'>
        {entryIndex !== undefined ? 'Save' : 'Add'}
      </button>
    </form>
  );
};

export const MealForm: FC<{update: (date: Date) => void}> = ({update}) => {
  const {mealId} = useParams();
  const db = useDb();
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>();

  const {fields, handleSubmit, setValue} = useFormBuilder<Meal>();

  const meal = useLiveQuery(() =>
    mealId ? db.meals.get(parseInt(mealId)) : undefined,
  );

  useEffect(() => {
    if (meal) {
      setValue('title', meal.title);
      setValue('date', meal.date);
    }
  }, [meal, setValue]);

  if (!meal) return;

  const submit = handleSubmit(async ({title, date}) => {
    const oldDate = meal.date;
    await db.meals.update(meal.id, {...meal, title, date});

    update(oldDate);
    update(date);
  });

  const removeEntry = (entry: Entry) => {
    db.meals.update(meal, {
      ...meal,
      entries: [...meal.entries.filter((e) => e !== entry)],
    });

    update(meal.date);
  };

  return (
    <div className='flex grow flex-col gap-4 overflow-hidden pb-4'>
      <form
        autoFocus={meal?.title.length === 0}
        onBlur={submit}
        className='flex flex-col gap-2 px-4'
      >
        <p className='text-sm font-thin'>Meal</p>
        <Input field={fields.title()} label='Title' />
        <DateInput label='Date' on={fields.date} />
      </form>

      <div className='flex grow flex-col overflow-hidden border-y pt-4'>
        <p className='px-4 text-sm font-thin'>Entries</p>
        <div className='flex flex-col overflow-y-auto'>
          {meal.entries.map((entry, index) => (
            <SlideRow
              key={`${entry.title}-${index}`}
              left={{
                action: () => removeEntry(entry),
                color: 'green',
                Icon: TrashIcon,
              }}
              right={{
                action: () => setSelectedEntryIndex(index),

                color: 'orange',
                Icon: PencilIcon,
              }}
            >
              <div className='flex size-full items-center justify-between px-2'>
                <p>
                  {entry.title && entry.title.length > 0 ? entry.title : '-'}
                </p>

                <div className='flex flex-col items-end'>
                  <p>{getKCalFromEntry(entry)} kcal</p>

                  <div className='self-end text-xs font-thin text-purple-light'>
                    {entry.gram}g / {entry.kcal}kcal
                  </div>
                </div>
              </div>
            </SlideRow>
          ))}
        </div>
      </div>

      <NewEntryForm
        meal={meal}
        entryIndex={selectedEntryIndex}
        update={() => {
          update(meal.date);
          setSelectedEntryIndex(undefined);
        }}
      />
    </div>
  );
};
