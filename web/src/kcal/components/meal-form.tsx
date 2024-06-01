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
      className='flex flex-col gap-4'
      onSubmit={handleSubmit((entry) => {
        db.meals.update(meal, {...meal, entries: [...meal.entries, entry]});
        update();
        reset();
      })}
    >
      <Input field={fields.title()} label='Title' />

      <div className='flex gap-2'>
        <Input field={fields.kcal()} label='kcal per 100g' className='flex-1' />
        <Input field={fields.gram()} label='portion in g' className='flex-1' />
      </div>

      <button className='rounded-lg bg-slate-500 px-2.5 py-1.5 font-bold text-white'>
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
    <div className='flex grow flex-col gap-4 overflow-hidden'>
      <form
        autoFocus={meal?.title.length === 0}
        onBlur={submit}
        className='flex flex-col gap-2'
      >
        <Input field={fields.title()} label='Title' />
        <DateInput label='Date' on={fields.date} />
      </form>

      <hr />

      <div className='flex grow flex-col gap-2 overflow-y-auto'>
        {meal.entries.map((entry, index) => (
          <SlideRow
            key={`${entry.title}-${index}`}
            left={{
              action: () => removeEntry(entry),
              color: 'red',
              Icon: TrashIcon,
            }}
            right={{
              action: () => removeEntry(entry),
              color: 'red',
              Icon: TrashIcon,
            }}
          >
            <div className='flex w-full justify-between px-2 font-light'>
              <div>{entry.title ?? '-'}</div>
              <div>{getKCalFromEntry(entry)} kcal</div>
            </div>
          </SlideRow>
        ))}
      </div>

      <hr />

      <NewEntryForm meal={meal} update={() => update(meal.date)} />
    </div>
  );
};
