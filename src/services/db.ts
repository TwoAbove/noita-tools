import Dexie, { Table } from 'dexie';

async function populate() {
  await db.configItems.bulkAdd([
    {
      key: 'use-spoiler',
      val: true
    },
    {
      key: 'theme',
      val: 'light'
    },
    {
      key: 'useCores',
      val: 1
    },
    {
      key: 'last-tab',
      val: 'SeedInfo'
    },
    {
      key: 'alchemy-show-id',
      val: false
    },
    {
      key: 'show-need-feedback-alert',
      val: false
    },
  ]);
}

interface ConfigItem {
  id?: number;
  key: string;
  val: any
}

export class NoitaDB extends Dexie {
  configItems!: Table<ConfigItem, number>;

  constructor() {
    super('NoitaDB');
    this.version(2).stores({
      configItems: '++id, &key'
    });
  }

  async setConfig(key: string, val: any) {
    const exists = await this.configItems.get({ key });
    if (!exists) {
      await this.configItems.add({
        key, val
      });
    }
    return this.configItems.where("key").equals(key).modify({ val });
  }
}

export const db = new NoitaDB();

db.on('populate', populate);

export function resetDatabase() {
  return db.transaction('rw', db.configItems, async () => {
    await Promise.all(db.tables.map(table => table.clear()));
    await populate();
  });
}

// resetDatabase()
