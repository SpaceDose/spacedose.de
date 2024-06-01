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
        'h-10 min-w-0 rounded-lg border px-2 text-slate-500',
        className,
      )}
      placeholder={label}
      {...rest}
    />
  );
};
