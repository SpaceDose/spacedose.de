// import PlusIcon from '';
import {PlusIcon} from '@heroicons/react/24/solid';
import {type FC} from 'react';

type FABProps = {
  onClick?: () => void;
};

export const FAB: FC<FABProps> = ({onClick}) => (
  <button
    className='fixed bottom-0 right-0 z-50 m-4 flex size-14 items-center justify-center rounded-full bg-green p-4 text-green-dark shadow'
    onClick={onClick}
  >
    <PlusIcon className='w-full' />
  </button>
);
