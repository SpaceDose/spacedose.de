import { useLiveQuery } from "dexie-react-hooks";
import type { FC } from "react";
import { type Meal, useDb } from "../../../provider/database";
import { getKCalForEntries, readableDate } from "../../../utils/kcal";
import { MealDisplay } from "./meal-display";

type DayCardProps = {
	date: string;
	meals: Meal[];
};

export const DayDisplay: FC<DayCardProps> = ({ date, meals }) => {
	const db = useDb();
	const entries = useLiveQuery(
		() =>
			db.entries
				.where("id")
				.anyOf(meals.flatMap((meal) => meal.entryIds))
				.toArray(),
		[meals],
	);

	if (!entries) return;

	return (
		<div key={date} className="border-t first:border-none">
			<div className="flex justify-between px-4 py-2 text-gray text-sm">
				<p>{readableDate(new Date(date))}</p>
				<p className="font-bold text-purple-light">
					{entries && `${getKCalForEntries(entries)} kcal`}
				</p>
			</div>

			{meals?.map((meal) => (
				<MealDisplay key={meal.id} meal={meal} hideTitle={meals.length < 2} />
			))}

			{!meals ||
				(meals?.length === 0 && (
					<div className="p-3 text-gray">No meals found...</div>
				))}
		</div>
	);
};
