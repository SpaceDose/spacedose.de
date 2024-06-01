import {type FC} from 'react';
import {Link} from 'react-router-dom';
import {Page} from './page';

export const Home: FC = () => (
  <Page
    title='Home'
    className='flex flex-col items-center justify-center gap-2'
  >
    <Link to='/kcal' className='rounded-lg bg-orange-600 p-2 text-white'>
      ⊂(◉‿◉)つ
    </Link>
    <p className='text-sm font-thin'>0.0.1</p>
  </Page>
);
