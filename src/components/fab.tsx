// import PlusIcon from '';
import { PlusIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { twMerge } from "tailwind-merge";

type FABProps = {
	onClick?: () => void;
	left?: boolean;
};

export const FAB: FC<FABProps> = ({ onClick, left }) => (
	<button
		type="button"
		className={twMerge(
			"fixed bottom-0 z-50 m-4 flex size-14 items-center justify-center rounded-full bg-green p-4 text-green-dark shadow",
			left ? "left-0" : "right-0",
		)}
		onClick={onClick}
	>
		<PlusIcon className="w-full" />
	</button>
);
