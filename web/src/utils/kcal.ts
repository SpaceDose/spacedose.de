import {type Entry} from '../provider/database';

export const getKCalFromEntry = (entry: Entry) =>
  Math.round((entry.kcal * entry.gram) / 100);

export const isSameDay = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const getFrom = (date: Date) => {
  const d = new Date(date);

  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);

  return d;
};

export const getUntil = (date: Date) => {
  const d = new Date(date);

  d.setHours(23);
  d.setMinutes(59);
  d.setSeconds(59);

  return d;
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const readableDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date(Date.now());

  now.setHours(12);
  d.setHours(12);

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round((now.getTime() - d.getTime()) / oneDay);

  switch (diffDays) {
    case -1:
      return 'Tomorrow';
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    case 2:
    case 3:
    case 4:
    case 5:
      return weekdays[date.getDay()];
    default:
      return date.toLocaleDateString('de-DE', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
  }
};
