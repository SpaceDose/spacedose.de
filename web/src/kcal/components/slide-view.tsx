import {AnimatePresence, motion, useDragControls} from 'framer-motion';
import {type FC, type ReactNode} from 'react';

type SlideViewProps = {
  show: boolean;
  close: () => void;
  children: ReactNode;
};

export const SlideView: FC<SlideViewProps> = ({show, close, children}) => {
  const controls = useDragControls();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          drag='y'
          dragControls={controls}
          dragListener={false}
          dragConstraints={{top: 0}}
          dragElastic={{top: 0}}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) close();
          }}
          initial={{top: '100vh'}}
          animate={{top: 0}}
          exit={{top: '100vh'}}
          transition={{duration: 0.1}}
          className='fixed z-50 flex h-screen w-screen flex-col overflow-hidden bg-white px-4 pb-4 text-slate-500'
        >
          <div
            className='flex w-full cursor-pointer justify-center py-4'
            onPointerDown={(event) => controls.start(event)}
            style={{touchAction: 'none'}}
          >
            <div className='h-1 w-1/3 rounded-full bg-slate-200' />
          </div>

          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
