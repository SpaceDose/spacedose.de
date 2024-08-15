import {useFormBuilder} from '@atmina/formbuilder';
import {useLiveQuery} from 'dexie-react-hooks';
import {useEffect, type FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Input} from '../../components/input';
import {useDb, type Vocabulary} from '../../provider/database';

export const VocabularyForm: FC = () => {
  const {vocabularyId} = useParams();
  const db = useDb();
  const navigate = useNavigate();
  const {fields, handleSubmit, reset} = useFormBuilder<Vocabulary>();

  const vocabulary = useLiveQuery(() =>
    db.vocabularies.get(parseInt(vocabularyId ?? '')),
  );

  useEffect(() => {
    if (vocabulary) reset(vocabulary);
  }, [vocabulary, reset]);

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          if (vocabulary) {
            db.vocabularies.update(vocabulary.id, {...data});
          }
          navigate(-1);
        })}
        className='flex flex-col gap-2 p-4'
      >
        <Input field={fields.english()} label='English' />
        <Input field={fields.german()} label='German' />

        <button className='text-white mt-1 rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light'>
          {vocabulary ? 'Save' : 'Add'}
        </button>
      </form>

      <button
        onClick={() => {
          if (vocabulary) {
            db.vocabularies.delete(vocabulary.id);
          }
          navigate(-1);
        }}
        className='text-white m-4 mt-auto rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light'
      >
        Delete
      </button>
    </>
  );
};
