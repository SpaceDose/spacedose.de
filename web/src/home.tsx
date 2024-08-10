import {type FC} from 'react';
import {Link} from 'react-router-dom';
import Logo from '../public/favicon.svg';
import {Page} from './page';

export const Home: FC = () => (
  <Page className='items-center gap-24 py-32 text-orange-light'>
    <img src={Logo} className='max-w-1/2 w-56 drop-shadow' />

    <div className='flex flex-col'>
      <Link to='/kcal' className='rounded-lg bg-orange-light p-3 text-black'>
        Abspecken
      </Link>
    </div>

    <p className='absolute bottom-0 right-0 px-2 text-sm font-thin text-orange-light'>
      Build from {new Date(VERSION).toLocaleString()}
    </p>
  </Page>
);
