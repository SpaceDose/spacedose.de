import {type InputHTMLAttributes, type FC} from 'react';
import {type UseFormRegisterReturn} from 'react-hook-form';
import {twMerge} from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: UseFormRegisterReturn;
}

export const Input: FC<InputProps> = (props) => {
  const {label, field, className, ...rest} = props;

  return (
    <input
      {...field}
      className={twMerge(
        'border-transparent h-10 w-full min-w-0 rounded-lg border bg-gray px-2 text-black',
        className,
      )}
      placeholder={label}
      {...rest}
    />
  );
};
