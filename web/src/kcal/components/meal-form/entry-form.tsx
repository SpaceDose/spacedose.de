import {useFormBuilder} from '@atmina/formbuilder';
import {useEffect, type FC} from 'react';
import {Input} from '../../../components/input';
import {type Entry, type Meal, useDb} from '../../provider/database';

type Nullable<T> = {[K in keyof T]: T[K] | null};

export const EntryForm: FC<{meal: Meal; entry?: Entry}> = ({meal, entry}) => {
  const db = useDb();
  const {fields, handleSubmit, reset} = useFormBuilder<Nullable<Entry>>();

  useEffect(() => {
    if (entry) reset(entry);
  }, [entry, reset]);

  return (
    <form
      key={entry?.id ?? 'new'}
      className='flex flex-col gap-2 px-4'
      onSubmit={handleSubmit(async (data) => {
        if (entry && data.id) {
          await db.entries.update(entry, {...entry, ...(data as Entry)});
        } else {
          const newEntryId = await db.entries.add({
            title: data.title ?? '',
            gram: data.gram ?? 0,
            kcal: data.kcal ?? 0,
          });

          await db.meals.update(meal.id, {
            ...meal,
            entryIds: [...meal.entryIds, newEntryId],
          });
        }

        reset({
          id: null,
          title: null,
          gram: null,
          kcal: null,
        });
      })}
    >
      <p className='text-sm font-thin'>Add a new entry</p>

      <Input field={fields.title()} label='Title' />

      <div className='flex gap-2'>
        <Input
          field={fields.gram()}
          label='portion in g'
          type='number'
          required
        />
        <Input
          field={fields.kcal()}
          label='kcal per 100g'
          type='number'
          required
        />
      </div>

      <button className='text-white mt-1 rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light'>
        {entry ? 'Save' : 'Add'}
      </button>
    </form>
  );
};
