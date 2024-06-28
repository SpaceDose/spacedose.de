import {type InputHTMLAttributes, type FC, useRef} from 'react';
import {type UseFormRegisterReturn} from 'react-hook-form';
import {twMerge} from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: UseFormRegisterReturn;
}

export const Input: FC<InputProps> = (props) => {
  const {label, field, className, ...rest} = props;
  const ref = useRef<HTMLInputElement>(null);

  return (
    <input
      {...field}
      ref={ref}
      className={twMerge(
        'h-10 w-full min-w-0 rounded-lg border border-transparent bg-gray px-2 text-black placeholder:text-black',
        className,
      )}
      onFocus={() => ref.current?.select()}
      placeholder={label}
      {...rest}
    />
  );
};
