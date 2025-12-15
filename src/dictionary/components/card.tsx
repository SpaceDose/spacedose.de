import { PencilIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Vocabulary } from "../../provider/database";

type CardProps = {
	vocabulary: Vocabulary;
};

export const Card: FC<CardProps> = ({ vocabulary }) => {
	const navigate = useNavigate();
	const [visibleSide, setVisibleSide] = useState<"front" | "back">("front");

	return (
		<div className="h-32 w-full shrink-0 px-4 py-2 text-lg">
			<motion.div
				animate={{ rotateY: visibleSide === "front" ? 0 : 180 }}
				onClick={() =>
					setVisibleSide(visibleSide === "front" ? "back" : "front")
				}
				transition={{ duration: 0.1 }}
				className="transform-3d relative size-full"
			>
				<div className="backface-hidden absolute flex size-full items-center justify-center rounded-xl border border-purple-light bg-purple/10 px-4 text-purple-light shadow">
					{vocabulary.english}
				</div>

				<div className="backface-hidden absolute flex size-full rotate-y-180 items-center justify-center rounded-xl border border-green-light bg-green/10 px-4 text-green-light shadow">
					{vocabulary.german}
				</div>
			</motion.div>
			<button
				type="button"
				className="absolute top-0 right-0 mx-7 my-5 size-6 rounded-full bg-black p-1.5 text-gray"
				onClick={() => navigate(`./${vocabulary.id}`)}
			>
				<PencilIcon />
			</button>
		</div>
	);
};
