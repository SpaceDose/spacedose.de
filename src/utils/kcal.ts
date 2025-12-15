import type { Entry } from "../provider/database";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const readableDate = (date: Date) => {
	const d = new Date(date);
	const now = new Date(Date.now());

	now.setHours(12);
	d.setHours(12);

	const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
	const diffDays = Math.round((now.getTime() - d.getTime()) / oneDay);

	const dateAsString = date.toLocaleDateString("de-DE", {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
	});

	switch (diffDays) {
		case -1:
			return "Tomorrow";
		case 0:
			return "Today";
		case 1:
			return "Yesterday";
		case 2:
		case 3:
		case 4:
		case 5:
			return `${weekdays[date.getDay()]} - ${dateAsString}`;
		default:
			return dateAsString;
	}
};

export const getKCalFromEntry = (entry: Entry) =>
	Math.round((entry.kcal * entry.gram) / 100);

export const getKCalForEntries = (entries: Entry[]) =>
	entries.reduce((acc, curr) => acc + getKCalFromEntry(curr), 0);
