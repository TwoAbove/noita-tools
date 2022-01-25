/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import spellData from '../../data/obj/spells.json';
import templeData from '../../data/temple-locations.json';
import { Objectify } from '../../../helpers';
import { IRule } from '../IRule';
import { IRandom } from '../../random';
import { InfoProvider } from './Base';
import { WandInfoProvider } from './Wand';

export type IItemShop = {
  type: 'item';
  items: ReturnType<ShopInfoProvider["generate_shop_item"]>[]
};
export type IWandShop = {
  type: 'wand';
  items: ReturnType<ShopInfoProvider["generate_shop_wand"]>[]
};
export type IShopItems = IItemShop | IWandShop;

export class ShopInfoProvider extends InfoProvider {
  constructor(randoms: IRandom, wandInfoProvider: WandInfoProvider) {
    super(randoms);
    this.wandInfoProvider = wandInfoProvider;
  }
  wandInfoProvider: WandInfoProvider;
  temples = templeData;
  spells = spellData as Objectify<typeof spellData>;

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
  ]

  gunParams = {
    shuffle: {
      1: {
        cost: 30,
        level: 1
      },
      2: {
        cost: 40,
        level: 2
      },
      3: {
        cost: 60,
        level: 3
      },
      4: {
        cost: 80,
        level: 4
      },
      5: {
        cost: 100,
        level: 5
      },
      6: {
        cost: 120,
        level: 6
      },
      10: {
        cost: 200,
        level: 11
      }
    },
    unshuffle: {
      1: {
        cost: 25,
        level: 1
      },
      2: {
        cost: 40,
        level: 2
      },
      3: {
        cost: 60,
        level: 3
      },
      4: {
        cost: 80,
        level: 4
      },
      5: {
        cost: 100,
        level: 5
      },
      6: {
        cost: 120,
        level: 6
      },
      10: {
        cost: 180,
        level: 11
      }
    },
  }


  generate_shop_item(x: number, y: number, cheap_item: boolean, biomeid_?: number, is_stealable?: boolean) {
    // Todo: scripts/items/generate_shop_item.lua
    this.randoms.SetRandomSeed(x, y);

    const biomepixel = Math.floor(y / 512)
    let biomeid = this.biomes[biomepixel] || 0;

    if (biomepixel > 35) {
      biomeid = 7;
    }

    if (biomeid_) {
      biomeid = biomeid_;
    }

    // --Note(Petri): Testing how much squaring the biomeid for prices affects things
    const level = biomeid;
    biomeid = biomeid * biomeid;

    const item = this.randoms.GetRandomAction(x, y, level, 0);

    const spell = this.spells[item.toUpperCase()];
    let price = Math.max(Math.floor(((spell.price * 0.30) + (70 * biomeid)) / 10) * 10, 10);

    if (cheap_item) {
      price = 0.5 * price
    }

    if (biomeid >= 10) {
      price = price * 5.0
    }

    return {
      spell,
      price,
      is_stealable
    }
  }

  generate_shop_wand(x: number, y: number, cheap_item: boolean, unshufflePerk: boolean, biomeid_?: number) {
    // Todo: scripts/items/generate_shop_item.lua
    this.randoms.SetRandomSeed(x, y);

    const biomepixel = Math.floor(y / 512)
    let biomeid = this.biomes[biomepixel] || 0;

    if (biomepixel > 35) {
      biomeid = 7;
    }

    if (biomeid_) {
      biomeid = biomeid_;
    }

    if (biomeid < 1) { biomeid = 1; }
    if (biomeid > 6) { biomeid = 6; }

    const rand = this.randoms.Random(0, 100);
    const isUnshuffle = rand > 50;

    const config = this.gunParams[isUnshuffle ? "unshuffle" : "shuffle"][biomeid];

    // -- Note( Petri ): Testing how much squaring the biomeid for prices affects things
    biomeid = (0.5 * biomeid) + (0.5 * biomeid * biomeid);
    let wandcost = (50 + biomeid * 210) + (this.randoms.Random(-15, 15) * 10);

    if (cheap_item) {
      wandcost = 0.5 * wandcost;
    }

    // This is called in Noita code from xml, so we need to round the x and y
    const wand = this.wandInfoProvider.provide(this.randoms.RoundHalfOfEven(x), this.randoms.RoundHalfOfEven(y), config.cost, config.level, isUnshuffle, unshufflePerk);
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
    const type: 'item' | 'wand' = this.randoms.Random(0, 100) <= 50 ? 'item' : 'wand';
    const items: any[] = [];
    for (let i = 0; i < count; i++) {
      if (type === 'item') {
        // To simulate the position of items
        items[i] = this.generate_shop_item(x + i * item_width, y - 30, false, undefined, true);
        items[i + count] = this.generate_shop_item(x + i * item_width, y, i === sale_item_i, undefined, true)
      } else {
        items.push(this.generate_shop_wand(x + i * item_width, y, i === sale_item_i, unshufflePerk));
      }
    }
    return {
      type,
      items
    }
  }

  provide(pickedPerks: Map<number, string[][]> = new Map(), worldOffset: number = 0, tx = 0, ty = 0) {
    const res: ReturnType<ShopInfoProvider["spawn_all_shop_items"]>[] = [];
    for (let i = 0; i < this.temples.length; i++) {
      const temple = this.temples[i];
      // Magic numbers taken from src/services/SeedInfo/infoHandler.check.ts
      let offsetX = 0 - 299, offsetY = 0 - 15;
      if (worldOffset !== 0) {
        offsetX += 35840 * worldOffset;
        if (!this.temples[i]) break;
      }
      res.push(this.spawn_all_shop_items(temple.x + offsetX, temple.y + offsetY, pickedPerks))
    }
    return res;
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    for (let i = 0; i <= info.length; i++) {
      if (rule.val[i]?.type) {
        if (rule.val[i].type !== info[i].type) {
          return false;
        }
      }
    }
    return true;
  }
}
