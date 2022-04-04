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

interface SeedInfoItem {
  id?: number;
  seed: string;
  config: any
}

export class NoitaDB extends Dexie {
  configItems!: Table<ConfigItem, number>;
  seedInfo!: Table<SeedInfoItem, number>;

  constructor() {
    super('NoitaDB');
    this.version(3).stores({
      configItems: '++id, &key',
      seedInfo: '++id, &seed',
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

  async setSeedInfo(seed: string, config: any) {
    const exists = await this.seedInfo.get({ seed });
    if (!exists) {
      await this.seedInfo.add({
        seed, config
      });
    }
    return this.seedInfo.where("seed").equals(seed).modify({ config });
  }
}

export const db = new NoitaDB();

db.on('populate', populate);

export async function resetDatabase() {
  await Promise.all(db.tables.map(table => table.clear()));
  await populate();
}
