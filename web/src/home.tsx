import {type FC} from 'react';
import {Link} from 'react-router-dom';
import {Page} from './page';

export const Home: FC = () => (
  <Page className='items-center justify-center gap-2 text-orange-light'>
    <Link to='/kcal' className='rounded-lg bg-orange-light p-3 text-black'>
      ⊂(◉‿◉)つ
    </Link>
    <p className='text-sm font-thin'>0.0.6</p>
  </Page>
);
