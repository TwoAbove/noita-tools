/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { ChestRandomProvider } from "./ChestRandom";

import templeData from "../../data/temple-locations.json";
import { IRandom } from "../../random";

const itemMap = {
  "data/entities/misc/custom_cards/bomb.xml": null,
  "data/entities/items/pickup/goldnugget.xml": null,
  "data/entities/items/pickup/goldnugget_50.xml": null,
  "data/entities/items/pickup/goldnugget_200.xml": null,
  "data/entities/items/pickup/goldnugget_1000.xml": null,
  "data/entities/items/pickup/potion.xml": null,
  "data/entities/items/pickup/powder_stash.xml": null,
  "data/entities/items/pickup/potion_secret.xml": null,
  "data/entities/items/pickup/potion_random_material.xml": null,
  "data/entities/items/pickup/spell_refresh.xml": null,
  "data/entities/items/pickup/safe_haven.xml": null,
  "data/entities/items/pickup/moon.xml": null,
  "data/entities/items/pickup/thunderstone.xml": null,
  "data/entities/items/pickup/evil_eye.xml": null,
  "data/entities/items/pickup/brimstone.xml": null,
  "data/entities/items/pickup/physics_greed_die.xml": null,
  "data/entities/items/pickup/physics_die.xml": null,
  "data/entities/items/pickup/runestones/runestone_laser.xml": null,
  "data/entities/items/pickup/runestones/runestone_fireball.xml": null,
  "data/entities/items/pickup/runestones/runestone_lava.xml": null,
  "data/entities/items/pickup/runestones/runestone_slow.xml": null,
  "data/entities/items/pickup/runestones/runestone_null.xml": null,
  "data/entities/items/pickup/runestones/runestone_disc.xml": null,
  "data/entities/items/pickup/runestones/runestone_metal.xml": null,
  "data/entities/items/pickup/physics_gold_orb_greed.xml": null,
  "data/entities/items/pickup/physics_gold_orb.xml": null,
  "data/entities/items/wand_level_01.xml": null,
  "data/entities/items/wand_unshuffle_01.xml": null,
  "data/entities/items/wand_level_02.xml": null,
  "data/entities/items/wand_unshuffle_02.xml": null,
  "data/entities/items/wand_level_03.xml": null,
  "data/entities/items/wand_unshuffle_03.xml": null,
  "data/entities/items/wand_level_04.xml": null,
  "data/entities/items/wand_unshuffle_04.xml": null,
  "data/entities/items/pickup/heart.xml": null,
  "data/entities/animals/illusions/dark_alchemist.xml": null,
  "data/entities/items/pickup/heart_better.xml": null,
  "data/entities/items/pickup/heart_fullhp.xml": null,
};

export class PacifistChestInfoProvider extends InfoProvider {
  temples = templeData;

  chestProvider: ChestRandomProvider;

  constructor(randoms: IRandom, chestProvider: ChestRandomProvider) {
    super(randoms);
    this.chestProvider = chestProvider;
  }

  offsets = [
    { x: -46, y: -39 },
    { x: 28, y: -22 },
  ];

  provide(level: number, worldOffset = 0, fallback = 0, greed = false) {
    const offset = this.offsets[fallback];
    const temple = this.temples[level];
    const x = temple.x + offset.x + worldOffset * 35840;
    const y = temple.y + offset.y;

    return this.chestProvider.provide(x, y, greed);
  }

  test(rule: IRule): boolean {
    for (let j = 0; j <= this.temples.length; j++) {
      if (!rule.val[j]?.length) {
        continue;
      }
      const desiredContents = new Map();
      for (const r of rule.val[j] as any[]) {
        if (!desiredContents.has(r)) {
          desiredContents.set(r, 0);
        }
        desiredContents.set(r, desiredContents.get(r) + 1);
      }

      const res = this.provide(j);
      const contents = new Map<string, any[]>();
      for (const r of res) {
        if (!contents.has(r.entity)) {
          contents.set(r.entity, []);
        }
        const c = contents.get(r.entity)!;
        c.push(r);
        contents.set(r.entity, c);
      }

      // TODO: Handle contents for potions, wands, etc.
      for (const key of desiredContents.keys()) {
        const dl = desiredContents.get(key);
        const cl = contents.get(key)?.length || 0;
        if (dl > cl) {
          return false;
        }
      }
    }
    return true;
  }
}

export default PacifistChestInfoProvider;
