import {type FC, type ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

type PageProps = {
  className?: string;
  children: ReactNode;
};

export const Page: FC<PageProps> = ({className, children}) => (
  <div className={twMerge('flex h-full flex-col overflow-hidden', className)}>
    {children}
  </div>
);
