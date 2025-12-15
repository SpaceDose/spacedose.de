import type { FormBuilder } from "@atmina/formbuilder";
import type { FC, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	on: FormBuilder<Date>;
}

export const DateInput: FC<DateInputProps> = ({ label, on, className }) => {
	const { field } = on.$useController();
	const { onChange, value, ...rest } = field;

	return (
		<input
			className={twMerge(
				"h-10 w-full rounded-lg border border-transparent bg-gray px-4 text-black",
				className,
			)}
			placeholder={label}
			type="date"
			onChange={(event) => {
				const dateArray = event.target.value.split("-");
				const date = new Date();
				date.setFullYear(parseInt(dateArray[0], 10));
				date.setMonth(parseInt(dateArray[1], 10) - 1);
				date.setDate(parseInt(dateArray[2], 10));
				onChange(date);
			}}
			value={`${value?.getFullYear()}-${(value?.getMonth() + 1).toString().padStart(2, "0")}-${value?.getDate().toString().padStart(2, "0")}`}
			{...rest}
		/>
	);
};
