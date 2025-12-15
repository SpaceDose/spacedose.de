import type { Entry, Schema } from "./database";

const meals: { title: string }[] = [
	{ title: "Mittagessen" },
	{ title: "Fressattacke" },
	{ title: "" },
	{ title: "Kochen" },
];

const entries: Omit<Entry, "id">[] = [
	{ title: "Pumpernickel", gram: 180, kcal: 177 },
	{ title: "Käse", gram: 40, kcal: 355 },
	{ title: "Butter", gram: 5, kcal: 591 },
	{ title: "Bami Goreng", gram: 450, kcal: 125 },
	{ title: "Saft", gram: 1000, kcal: 45 },
	{ title: "Ei", gram: 40, kcal: 155 },
	{ title: "Tomaten", gram: 500, kcal: 20 },
];

export const seedExampleData = async (db: Schema) => {
	await db.meals.clear();
	await db.entries.clear();

	for (let i = 0; i < 10; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);

		for (let j = 0; j < Math.random() * 2 + 1; j++) {
			const entryIds: number[] = [];

			for (let k = 0; k < Math.random() * 4 + 1; k++) {
				const entry = entries[Math.floor(Math.random() * entries.length)];

				entryIds.push(
					await db.entries.add({
						title: entry.title,
						gram: entry.gram,
						kcal: entry.kcal,
					}),
				);
			}

			await db.meals.add({
				...meals[Math.floor(Math.random() * meals.length)],
				date,
				entryIds,
			});
		}
	}
};
