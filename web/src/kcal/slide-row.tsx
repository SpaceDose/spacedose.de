import {motion} from 'framer-motion';
import {type FC, useState, type ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

type Color = 'green' | 'orange' | 'purple';

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
      color === 'orange' &&
        (actionActive
          ? 'bg-orange-dark text-orange-light'
          : 'bg-orange-light text-orange-dark'),
      color === 'green' &&
        (actionActive
          ? 'bg-green-light text-green-dark'
          : 'bg-green-dark text-green-light'),
      color === 'purple' &&
        (actionActive
          ? 'bg-purple-dark text-purple-light'
          : 'bg-purple-light text-purple-dark'),
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

        <div className='flex w-screen shrink-0 flex-col p-2.5'>{children}</div>

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
