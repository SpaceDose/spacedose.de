import {motion} from 'framer-motion';
import {type FC, useState, type ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

type Color = 'red' | 'orange';

type SideButton = {
  action: () => void;
  Icon: Icon;
  color: Color;
};

type SlideRowProps = {
  left: SideButton;
  right: SideButton;
  children: ReactNode;
};

const Side: FC<{
  Icon: Icon;
  actionActive: boolean;
  color: Color;
  side: 'left' | 'right';
}> = ({Icon, actionActive, color, side}) => (
  <div
    className={twMerge(
      'flex w-screen shrink-0 p-4',
      side === 'left' ? 'justify-end' : 'justify-start',
      color === 'red' &&
        (actionActive ? 'bg-red-500 text-red-900' : 'bg-red-900 text-red-500'),
      color === 'orange' &&
        (actionActive
          ? 'bg-orange-500 text-orange-900'
          : 'bg-orange-900 text-orange-500'),
    )}
  >
    <Icon className='w-5' />
  </div>
);

export const SlideRow: FC<SlideRowProps> = ({left, right, children}) => {
  const [actionActive, setActionActive] = useState<boolean>(false);

  return (
    <div className='w-full overflow-hidden'>
      <motion.div
        drag='x'
        dragSnapToOrigin
        onDrag={(_, info) => {
          if (actionActive && info.offset.x < 100 && info.offset.x > -100) {
            setActionActive(false);
          }
          if (!actionActive && (info.offset.x > 100 || info.offset.x < -100)) {
            setActionActive(true);
          }
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 100) {
            left.action();
          }
          if (info.offset.x < -100) {
            right.action();
          }
        }}
        className='flex justify-center'
      >
        <Side
          Icon={left.Icon}
          color={left.color}
          actionActive={actionActive}
          side='left'
        />

        <div className='flex w-screen shrink-0 flex-col gap-2 p-2.5'>
          {children}
        </div>

        <Side
          Icon={right.Icon}
          color={right.color}
          actionActive={actionActive}
          side='right'
        />
      </motion.div>
    </div>
  );
};
