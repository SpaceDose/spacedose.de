import {ArrowTrendingDownIcon} from '@heroicons/react/16/solid';
import {type FC, type ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

type PageProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

export const Page: FC<PageProps> = ({title, className, children}) => (
  <div className='flex h-screen flex-col overflow-hidden bg-black bg-blend-luminosity'>
    <div className='flex h-14 items-center gap-3 bg-white/10 p-3 text-xl font-medium text-white'>
      <ArrowTrendingDownIcon className='h-full rounded-full bg-white p-1 text-orange-600' />
      {title}
    </div>

    <div className={twMerge('grow text-white', className)}>{children}</div>
  </div>
);
