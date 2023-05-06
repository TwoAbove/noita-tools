import Dexie, { PromiseExtended, Table } from "dexie";
import deepEqual from "fast-deep-equal/es6/react";
import { exportDB, importInto } from "dexie-export-import";
import { useLiveQuery } from "dexie-react-hooks";
import uniqueId from "lodash/uniqueId.js";
import { ILogicRules, RuleType } from "./SeedInfo/infoHandler/IRule";

(Dexie as any).debug = "dexie";

// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

interface ConfigItem {
  id?: number;
  key: string;
  val: any;
}

interface SeedInfoItem {
  id?: number;
  seed: string;
  config: any;
  updatedAt: Date;
}

export enum FavoriteType {
  Perk = "perk",
  Material = "material",
  Spell = "spell",
}

export interface FavoriteItem {
  id?: number;
  type: FavoriteType;
  key: string;
}

export interface SearchesItemConfig {
  name?: string;
  from?: number;
  to?: number;
  findAll?: boolean;
  rules: string;
}
export interface SearchesItem {
  id?: number;
  uuid: string;
  config: SearchesItemConfig;
  madeUsingVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NoitaDB extends Dexie {
  configItems!: Table<ConfigItem, number>;
  seedInfo!: Table<SeedInfoItem, number>;
  favorites!: Table<FavoriteItem, number>;
  searches!: Table<SearchesItem, number>;
  errorOnOpen: PromiseExtended<Error>;

  constructor() {
    super("NoitaDB");

    // Maybe extract this into its own files so that any future upgrades don't
    // increase the size of this file exponentially?

    // https://dexie.org/docs/Tutorial/Design#database-versioning
    this.version(3).stores({
      configItems: "++id, &key",
      seedInfo: "++id, &seed",
    });

    this.version(4)
      .stores({
        configItems: "++id, &key",
        seedInfo: "++id, &seed, updatedAt",
      })
      .upgrade(async t => {
        await ((t as any).seedInfo as NoitaDB["seedInfo"])
          .toCollection()
          .modify(s => {
            if (s.updatedAt) {
              return;
            }
            s.updatedAt = new Date();
          })
          .catch(e => {
            console.error(e);
          });
      });

    this.version(5).stores({
      favorites: "++id, type, &key", // Maybe add [type+key] as index?
    });

    this.version(6)
      .stores({
        configItems: "++id, &key",
      })
      .upgrade(async t => {
        await ((t as any).db.configItems as NoitaDB["configItems"])
          .add({
            key: "unlocked-spells",
            val: Array(393).fill(true),
          })
          .catch(e => {
            console.error(e);
          });
      });

    this.version(7)
      .stores({
        seedInfo: "++id, &seed, updatedAt, config",
      })
      .upgrade(async t => {
        await ((t as any).db.seedInfo as NoitaDB["seedInfo"])
          .toCollection()
          .modify(s => {
            if (typeof s.config === "string" || s.config instanceof String) {
              return s;
            }
            s.config = JSON.stringify(s.config, replacer);
          })
          .catch(e => {
            console.error(e);
          });
      });

    this.version(8)
      .stores({
        searches: "++id, &uuid, config, createdAt, updatedAt",
      })
      .upgrade(async t => {
        const uuid = crypto.randomUUID();
        const search = await ((t as any).db.seedInfo as NoitaDB["searches"]).add({
          uuid,
          config: {
            name: "",
            rules: btoa(
              JSON.stringify({
                id: "root",
                type: RuleType.AND,
                rules: [],
                selectedRule: "search",
              })
            ),
          },
          madeUsingVersion: process.env.REACT_APP_VERSION!,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

    this.errorOnOpen = this.open()
      .then(() => null)
      .catch(e => {
        console.error(e);
        return e;
      });
  }

  async toggleFavorite(type: FavoriteType, key: string) {
    const exists = await this.favorites.get({ type, key });
    if (!exists) {
      await this.favorites.add({ type, key });
      return;
    }
    this.favorites.delete(exists.id!).catch(e => {
      console.error(e);
    });
  }

  async setConfig(key: any, val: any) {
    const exists = await this.configItems.get({ key });
    if (!exists) {
      await this.configItems.add({
        key,
        val,
      });
      return;
    }
    return this.configItems.where("key").equals(key).modify({ val });
  }

  async getSeedInfo(seed: string) {
    return this.transaction("r", this.seedInfo, async t => {
      const config = await db.seedInfo.get({ seed });
      if (!config) {
        return undefined;
      }
      return Object.assign(config, {
        config: JSON.parse(config.config, reviver),
      });
    });
  }

  async setSeedInfo(seed: string, config: any) {
    return this.transaction("rw", this.seedInfo, async t => {
      const exists = await this.seedInfo.get({ seed });
      if (!exists) {
        await this.seedInfo.add({
          seed,
          config: JSON.stringify(config, replacer),
          updatedAt: new Date(),
        });
        return;
      }

      if (deepEqual(config, exists.config)) {
        return;
      }

      return this.seedInfo
        .where("seed")
        .equals(seed)
        .modify({
          config: JSON.stringify(config, replacer),
          updatedAt: new Date(),
        });
    });
  }

  async exportDB() {
    return await exportDB(this);
  }

  async importDB(blob: Blob) {
    await Promise.all(db.tables.map(table => table.clear()));
    return await importInto(this, blob);
  }
}

export const db = new NoitaDB();

export const useWithConfig = (seed: string) => {
  const config = useLiveQuery(() => db.getSeedInfo(seed), [seed], {});
  if (!config) {
    return undefined;
  }
  return (config as SeedInfoItem).config;
};

async function populate() {
  await db.configItems.bulkAdd([
    {
      key: "theme",
      val: "light",
    },
    {
      key: "unlocked-spells",
      val: Array(393).fill(true),
    },
    {
      key: "useCores",
      val: 1,
    },
    {
      key: "last-tab",
      val: "SeedInfo",
    },
    {
      key: "alchemy-show-id",
      val: false,
    },
    {
      key: "show-need-feedback-alert",
      val: 0,
    },
    {
      key: "show-initial-lottery",
      val: true,
    },
  ]);

  const uuid = crypto.randomUUID();

  const initialSearch = await db.searches.add({
    uuid,
    config: {
      name: "",
      rules: btoa(
        JSON.stringify({
          id: "root",
          type: RuleType.AND,
          rules: [],
          selectedRule: "search",
        })
      ),
    },
    madeUsingVersion: process.env.REACT_APP_VERSION!,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.configItems.add({
    key: "search-current-search-uuid",
    val: uuid,
  });
}

db.on("populate", populate);

export async function resetDatabase() {
  await Promise.all(db.tables.map(table => table.clear()));
  await populate();
}

export async function clearSeeds() {
  await db.seedInfo.clear();
}

export async function newSearch(): Promise<string> {
  const uuid = crypto.randomUUID();
  const search = await db.searches.add({
    uuid,
    config: {
      name: "",
      rules: btoa(
        JSON.stringify({
          id: "root",
          type: RuleType.AND,
          rules: [],
          selectedRule: "search",
        })
      ),
    },
    madeUsingVersion: process.env.REACT_APP_VERSION!,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return uuid;
}

export async function deleteSearch(uuid: string): Promise<string> {
  const search = await db.searches.get({ uuid });
  if (search) {
    await db.searches.delete(search.id!);
  }
  const otherSearch = await db.searches.orderBy("createdAt").first();
  return otherSearch?.uuid ?? "";
}

export async function getExportableSearch(uuid: string): Promise<Partial<SearchesItem>> {
  // to avoid typing issues in the export
  const search = (await db.searches.get({ uuid }))! as any;

  delete search.id;
  delete search.uuid;
  delete search.updatedAt;
  delete search.createdAt;

  return search;
}
