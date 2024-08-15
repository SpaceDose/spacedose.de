'use client';

import {Dexie, type EntityTable} from 'dexie';
import {type ReactNode, createContext, type FC, useContext} from 'react';

export type Entry = {
  id: number;
  title?: string;
  kcal: number;
  gram: number;
};

export type Meal = {
  id: number;
  title?: string;
  date: Date;
  entryIds: number[];
};

export type Vocabulary = {
  id: number;
  english: string;
  german: string;
  date: Date;
};

export interface Schema extends Dexie {
  meals: EntityTable<Meal, 'id'>;
  entries: EntityTable<Entry, 'id'>;
  vocabularies: EntityTable<Vocabulary, 'id'>;
}

const DatabaseContext = createContext<Schema | undefined>(undefined);

export const useDb: () => Schema = () => {
  const db = useContext(DatabaseContext);

  if (!db) {
    throw new Error(
      'Database is only accessible inside a database provider...',
    );
  }

  return db;
};

export const DatabaseProvider: FC<{children: ReactNode}> = ({children}) => {
  const db = new Dexie('db') as Schema;
  db.version(2).stores({
    meals: '++id, date',
    entries: '++id',
    vocabularies: '++id',
  });

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
};
