import {type Entry, type Schema} from './database';

const entries: Omit<Omit<Entry, 'id'>, 'date'>[] = [
  {german: 'Leiter', english: 'letter'},
  {german: 'Fortgeschrittene', english: 'runaways'},
  {german: 'Kittchen', english: 'kitchen'},
  {german: 'Gartenpartei', english: 'gardenparty'},
  {german: 'Herr Kohl', english: 'Mister Vegetable'},
  {german: 'Guten Einkauf', english: 'good bye'},
];

export const seedExampleData = async (db: Schema) => {
  await db.delete({disableAutoOpen: false});

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    for (let j = 0; j < Math.random() * 2 + 1; j++) {
      await db.entries.add({
        date,
        ...entries[Math.floor(Math.random() * entries.length)],
      });
    }
  }
};
