import {useFormBuilder} from '@atmina/formbuilder';
import {TrashIcon} from '@heroicons/react/24/outline';
import {useLiveQuery} from 'dexie-react-hooks';
import {useEffect, type FC} from 'react';
import {useParams} from 'react-router-dom';
import {type Entry, useDb, type Meal} from '../../provider/database';
import {getKCalFromEntry} from '../../utils/kcal';
import {DateInput} from '../date-input';
import {SlideRow} from '../slide-row';
import {Input} from './input';

const NewEntryForm: FC<{meal: Meal; update: () => void}> = ({meal, update}) => {
  const db = useDb();
  const {fields, handleSubmit, reset} = useFormBuilder<Entry>();

  return (
    <form
      className='flex flex-col gap-2 px-4'
      onSubmit={handleSubmit((entry) => {
        db.meals.update(meal, {...meal, entries: [...meal.entries, entry]});
        update();
        reset();
      })}
    >
      <p className='text-sm font-thin'>Add a new entry</p>

      <Input field={fields.title()} label='Title' />

      <div className='flex gap-2'>
        <Input field={fields.kcal()} label='kcal per 100g' type='number' />
        <Input field={fields.gram()} label='portion in g' type='number' />
      </div>

      <button className='text-white mt-1 rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light'>
        Add
      </button>
    </form>
  );
};

export const MealForm: FC<{update: (date: Date) => void}> = ({update}) => {
  const {mealId} = useParams();
  const db = useDb();

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
                color: 'purple',
                Icon: TrashIcon,
              }}
              right={{
                action: () => removeEntry(entry),
                color: 'purple',
                Icon: TrashIcon,
              }}
            >
              <div className='flex size-full items-center justify-between px-2'>
                <div>
                  {entry.title && entry.title.length > 0 ? entry.title : '-'}
                </div>
                <div>{getKCalFromEntry(entry)} kcal</div>
              </div>
            </SlideRow>
          ))}
        </div>
      </div>

      <NewEntryForm meal={meal} update={() => update(meal.date)} />
    </div>
  );
};
