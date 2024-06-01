import {type FC} from 'react';
import {Link} from 'react-router-dom';
import {Page} from './page';

export const Home: FC = () => (
  <Page title='Home' className='flex items-center justify-center'>
    <Link to='/kcal' className='rounded-lg bg-orange-600 p-2 text-white'>
      ⊂(◉‿◉)つ
    </Link>
  </Page>
);
