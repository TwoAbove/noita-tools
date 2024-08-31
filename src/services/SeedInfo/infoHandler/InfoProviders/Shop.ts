/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import templeData from "../../data/temple-locations.json";
import { includesAll, includesSome, between } from "../../../helpers";
import { IRule } from "../IRule";
import { IRandom } from "../../random";
import { InfoProvider } from "./Base";
import type { WandInfoProvider } from "./Wand";
import type { SpellInfoProvider } from "./Spell";

export enum IShopType {
  "wand" = 1,
  "item" = 2,
}

export type IItemShop = {
  type: IShopType.item;
  items: ReturnType<ShopInfoProvider["generate_shop_item"]>[];
};
export type IWandShop = {
  type: IShopType.wand;
  items: ReturnType<ShopInfoProvider["generate_shop_wand"]>[];
};
export type IShopItems = IItemShop | IWandShop;

export class ShopInfoProvider extends InfoProvider {
  constructor(randoms: IRandom, wandInfoProvider: WandInfoProvider, spellInfoProvider: SpellInfoProvider) {
    super(randoms);
    this.wandInfoProvider = wandInfoProvider;
    this.spells = spellInfoProvider;
  }

  async ready(): Promise<void> {
    await this.wandInfoProvider.ready();
    await this.spells.ready();
    return;
  }

  wandInfoProvider: WandInfoProvider;
  temples = templeData;
  spells: SpellInfoProvider;

  biomes = [
    null, // 0
    0,
    0,
    0,
    1,
    1, // 5
    1,
    2,
    2,
    2,
    2, // 10
    2,
    2,
    3,
    3,
    3, // 15
    3,
    4,
    4,
    4,
    4, // 20
    5,
    5,
    5,
    5,
    6, // 25
    6,
    6,
    6,
    6,
    6, // 30
    6,
    6,
    6,
  ];

  gunParams = {
    shuffle: {
      1: {
        cost: 30,
        level: 1,
      },
      2: {
        cost: 40,
        level: 2,
      },
      3: {
        cost: 60,
        level: 3,
      },
      4: {
        cost: 80,
        level: 4,
      },
      5: {
        cost: 100,
        level: 5,
      },
      6: {
        cost: 120,
        level: 6,
      },
      10: {
        cost: 200,
        level: 11,
      },
    },
    unshuffle: {
      1: {
        cost: 25,
        level: 1,
      },
      2: {
        cost: 40,
        level: 2,
      },
      3: {
        cost: 60,
        level: 3,
      },
      4: {
        cost: 80,
        level: 4,
      },
      5: {
        cost: 100,
        level: 5,
      },
      6: {
        cost: 120,
        level: 6,
      },
      10: {
        cost: 180,
        level: 11,
      },
    },
  };

  generate_shop_item(x: number, y: number, cheap_item: boolean, biomeid_?: number, is_stealable?: boolean) {
    // Todo: scripts/items/generate_shop_item.lua
    this.randoms.SetRandomSeed(x, y);

    let biomeid = this.getLevel(y);
    if (biomeid_) {
      biomeid = biomeid_;
    }

    // --Note(Petri): Testing how much squaring the biomeid for prices affects things
    const level = biomeid;
    biomeid = biomeid * biomeid;

    const item = this.randoms.GetRandomAction(x, y, level, 0);

    const spell = this.spells.provide(item.toUpperCase());
    let price = Math.max(Math.floor((spell.price * 0.3 + 70 * biomeid) / 10) * 10, 10);

    if (cheap_item) {
      price = 0.5 * price;
    }

    if (biomeid >= 10) {
      price = price * 5.0;
    }

    return {
      spell,
      price,
      is_stealable,
    };
  }

  getLevel(y: number) {
    const biomepixel = Math.floor(y / 512);
    let biomeid = this.biomes[biomepixel] || 0;

    if (biomepixel > 35) {
      biomeid = 7;
    }
    return biomeid;
  }

  generate_shop_wand(x: number, y: number, cheap_item: boolean, unshufflePerk: boolean, biomeid_?: number) {
    // Todo: scripts/items/generate_shop_item.lua
    this.randoms.SetRandomSeed(x, y);

    let biomeid = this.getLevel(y);

    if (biomeid_) {
      biomeid = biomeid_;
    }

    if (biomeid < 1) {
      biomeid = 1;
    }
    if (biomeid > 6) {
      biomeid = 6;
    }

    const rand = this.randoms.Random(0, 100);
    const isShuffle = rand <= 50;

    const config = this.gunParams[isShuffle ? "shuffle" : "unshuffle"][biomeid];

    // -- Note( Petri ): Testing how much squaring the biomeid for prices affects things
    biomeid = 0.5 * biomeid + 0.5 * biomeid * biomeid;
    let wandcost = 50 + biomeid * 210 + this.randoms.Random(-15, 15) * 10;

    if (cheap_item) {
      wandcost = 0.5 * wandcost;
    }

    // This is called in Noita code from xml, so we need to round the x and y
    // const wand = this.wandInfoProvider.provide(this.randoms.RoundHalfOfEven(x), this.randoms.RoundHalfOfEven(y), config.cost, config.level, isShuffle, unshufflePerk);
    const wand = this.wandInfoProvider.provide(
      this.randoms.RoundHalfOfEven(x),
      this.randoms.RoundHalfOfEven(y),
      config.cost,
      config.level,
      !isShuffle,
      unshufflePerk,
    );
    wand.gun.cost = wandcost;
    return wand;
  }

  spawn_all_shop_items(x: number, y: number, pickedPerks: Map<number, string[][]>): IShopItems {
    this.randoms.SetRandomSeed(x, y);

    const numberOfExtraItems = [...pickedPerks.values()].flat(2).filter(p => p === "EXTRA_SHOP_ITEM").length;
    const unshufflePerk = !![...pickedPerks.values()].flat(2).filter(p => p === "NO_MORE_SHUFFLE").length;
    const count = 5 + numberOfExtraItems; // GlobalsGetValue( "TEMPLE_SHOP_ITEM_COUNT", "5" );

    const width = 132;
    const item_width = width / count;
    const sale_item_i = this.randoms.Random(0, count - 1);
    const type: IShopType = this.randoms.Random(0, 100) <= 50 ? IShopType.item : IShopType.wand;
    const items: any[] = [];
    for (let i = 0; i < count; i++) {
      if (type === IShopType.item) {
        // To simulate the position of items
        items[i] = this.generate_shop_item(x + i * item_width, y - 30, false, undefined, true);
        items[i + count] = this.generate_shop_item(x + i * item_width, y, i === sale_item_i, undefined, true);
      } else {
        items.push(this.generate_shop_wand(x + i * item_width, y, i === sale_item_i, unshufflePerk));
      }
    }
    return {
      type,
      items,
    };
  }

  provide(pickedPerks: Map<number, string[][]> = new Map(), worldOffset: number = 0, tx = 0, ty = 0) {
    const res: ReturnType<ShopInfoProvider["spawn_all_shop_items"]>[] = [];
    for (let i = 0; i < this.temples.length; i++) {
      res.push(this.provideLevel(i, pickedPerks, worldOffset, tx, ty));
    }
    return res;
  }

  provideLevel(
    level: number,
    pickedPerks: Map<number, string[][]> = new Map(),
    worldOffset: number = 0,
    tx = 0,
    ty = 0,
  ) {
    const temple = this.temples[level];
    // Magic numbers taken from src/services/SeedInfo/infoHandler.check.ts
    let offsetX = 0 - 299,
      offsetY = 0 - 15;
    return this.spawn_all_shop_items(temple.x + offsetX + worldOffset * 35840, temple.y + offsetY, pickedPerks);
  }

  getShopLevel(shopNumber: number) {
    const temple = this.temples[shopNumber];
    return this.getLevel(temple.y - 15);
  }

  wandProps = [
    "shuffle_deck_when_empty",
    "actions_per_round",
    "fire_rate_wait",
    "reload_time",
    "mana_max",
    "mana_charge_speed",
    "deck_capacity",
    "spread_degrees",
  ];

  test(rule: IRule): boolean {
    const check = rule.strict ? includesAll : includesSome;
    for (let j = 0; j <= this.temples.length; j++) {
      const shop = rule.val[j];
      if (!shop) {
        continue;
      }
      try {
        if (shop.type) {
          const info = this.provideLevel(j);
          if (shop.type !== info.type) {
            return false;
          }
          if (!shop.items.length) {
            return true;
          }
          if (info.type === IShopType.wand) {
            for (const wand of info.items) {
              for (const prop of this.wandProps) {
                if (!shop.wand[prop]) {
                  continue;
                }
                const [min, max] = shop.wand[prop];
                if (!between(wand.gun[prop], min, max)) {
                  return false;
                }
              }
              if (shop.wand.cards) {
                if (shop.wand.cards.permanentCard) {
                }
                if (
                  !check(
                    wand.cards.cards.map(i => String(i)),
                    shop.wand.cards.cards.map(i => String(i)),
                  )
                ) {
                  return false;
                }
              }
              return true;
            }
            return false;
          } else if (info.type === IShopType.item && shop.items.length) {
            // https://stackoverflow.com/a/3586788
            if (
              !check(
                info.items.map(i => String(i.spell.id)),
                shop.items.map(i => String(i)),
              )
            ) {
              return false;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  }
}

export default ShopInfoProvider;
