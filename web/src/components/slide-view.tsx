import {XMarkIcon} from '@heroicons/react/24/solid';
import {AnimatePresence, motion} from 'framer-motion';
import {type FC, type ReactNode} from 'react';

type SlideViewProps = {
  show: boolean;
  close: () => void;
  children: ReactNode;
};

export const SlideView: FC<SlideViewProps> = ({show, close, children}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{top: '100vh'}}
        animate={{top: 0}}
        exit={{top: '100vh'}}
        transition={{duration: 0.1}}
        className='text-slate-500 fixed z-50 flex size-full flex-col overflow-hidden bg-black text-gray'
      >
        <button className='ml-auto p-4' onClick={() => close()}>
          <XMarkIcon className='w-6' />
        </button>

        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
