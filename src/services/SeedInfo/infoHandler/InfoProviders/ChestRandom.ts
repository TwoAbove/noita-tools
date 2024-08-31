/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import D from "decimal.js";

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

import { IRandom } from "../../random";
import type { SpellInfoProvider } from "./Spell";

// TODO: There are many places where we will deal with items
// We should ideally standardize this.
type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
export interface IItem {
  entity: string;
  x: number;
  y: number;
  pos_x: number;
  pos_y: number;
  extra?: any;
}

export class ChestRandomInfoProvider extends InfoProvider {
  unlockedSpells: boolean[];

  constructor(randoms: IRandom, unlockedSpells: boolean[], spellInfoProvider: SpellInfoProvider) {
    super(randoms);
    this.unlockedSpells = unlockedSpells;
    this.spells = spellInfoProvider;
  }

  spells: SpellInfoProvider;

  make_random_card(x: number, y: number) {
    let id = "";
    let valid = false;

    while (!valid) {
      let i = this.randoms.Random(0, this.spells.spellsArr.length - 1);
      let item = this.spells.spellsArr[i];
      id = item.id;

      if (item.spawn_requires_flag) {
        let flag_status = this.HasFlag(i);
        if (flag_status) {
          valid = true;
        }
        if (item.spawn_probability === "0") {
          valid = false;
        }
      } else {
        valid = true;
      }
    }

    return id;
  }

  // Unlocked spells
  HasFlag(pos: number): boolean {
    return this.unlockedSpells[pos];
  }

  provide(_x: number, _y: number, greed = false): IItem[] {
    // see https://github.com/TwoAbove/noita-tools/issues/270
    const x = new D(_x).toSD(6).toNumber();
    const y = new D(_y).toSD(6).toNumber();
    const rand_x = x + 509.7;
    const rand_y = y + 683.1;
    this.randoms.SetRandomSeed(rand_x, rand_y);
    const entities: PartialExcept<IItem, "entity">[] = [];
    let count = 1;
    while (count > 0) {
      count--;
      let rnd = this.randoms.Random(1, 100);
      if (rnd <= 7) {
        // Bomb
        entities.push({
          entity: "data/entities/misc/custom_cards/bomb.xml",
        });
      } else if (rnd <= 40) {
        // Gold
        let amount = 5;
        rnd = this.randoms.Random(0, 100);
        if (rnd <= 80) {
          amount = 7;
        } else if (rnd <= 95) {
          amount = 10;
        } else if (rnd <= 100) {
          amount = 20;
        }
        rnd = this.randoms.Random(0, 100);
        if (rnd > 30 && rnd <= 80) {
          entities.push({
            entity: "data/entities/items/pickup/goldnugget_50.xml",
            x: x + this.randoms.Random(-10, 10),
            y: y - 4 + this.randoms.Random(-10, 5),
          });
        } else if (rnd <= 95) {
          entities.push({
            entity: "data/entities/items/pickup/goldnugget_200.xml",
            x: x + this.randoms.Random(-10, 10),
            y: y - 4 + this.randoms.Random(-10, 5),
          });
        } else if (rnd <= 99) {
          entities.push({
            entity: "data/entities/items/pickup/goldnugget_1000.xml",
            x: x + this.randoms.Random(-10, 10),
            y: y - 4 + this.randoms.Random(-10, 5),
          });
        } else {
          let tamount = this.randoms.Random(1, 3);
          for (let i = 1; i <= tamount; i++) {
            entities.push({
              entity: "data/entities/items/pickup/goldnugget_50.xml",
              x: x + this.randoms.Random(-10, 10),
              y: y - 4 + this.randoms.Random(-10, 5),
            });
          }
          if (this.randoms.Random(0, 100) > 50) {
            tamount = this.randoms.Random(1, 3);
            for (let i = 1; i <= tamount; i++) {
              entities.push({
                entity: "data/entities/items/pickup/goldnugget_200.xml",
                x: x + this.randoms.Random(-10, 10),
                y: y - 4 + this.randoms.Random(-10, 5),
              });
            }
          }
          if (this.randoms.Random(0, 100) > 80) {
            tamount = this.randoms.Random(1, 3);
            for (let i = 1; i <= tamount; i++) {
              entities.push({
                entity: "data/entities/items/pickup/goldnugget_1000.xml",
                x: x + this.randoms.Random(-10, 10),
                y: y - 4 + this.randoms.Random(-10, 5),
              });
            }
          }
        }
        for (let i = 1; i <= amount; i++) {
          entities.push({
            entity: "data/entities/items/pickup/goldnugget.xml",
            x: x + this.randoms.Random(-10, 10),
            y: y - 4 + this.randoms.Random(-10, 5),
          });
        }
      } else if (rnd <= 50) {
        // Potion
        rnd = this.randoms.Random(0, 100);
        if (rnd <= 94) {
          entities.push({
            entity: "data/entities/items/pickup/potion.xml",
          });
        } else if (rnd <= 98) {
          entities.push({
            entity: "data/entities/items/pickup/powder_stash.xml",
          });
        } else if (rnd <= 100) {
          rnd = this.randoms.Random(0, 100);
          if (rnd <= 98) {
            entities.push({
              entity: "data/entities/items/pickup/potion_secret.xml",
            });
          } else if (rnd <= 100) {
            entities.push({
              entity: "data/entities/items/pickup/potion_random_material.xml",
            });
          }
        }
      } else if (rnd <= 54) {
        // Spell refresh
        entities.push({
          entity: "data/entities/items/pickup/spell_refresh.xml",
        });
      } else if (rnd <= 60) {
        // Misc items
        const opts = [
          "data/entities/items/pickup/safe_haven.xml",
          "data/entities/items/pickup/moon.xml",
          "data/entities/items/pickup/thunderstone.xml",
          "data/entities/items/pickup/evil_eye.xml",
          "data/entities/items/pickup/brimstone.xml",
          "runestone",
          "die",
          "orb",
        ];
        rnd = this.randoms.Random(0, opts.length - 1);
        let opt = opts[rnd];
        if (opt === "die") {
          // see if one of card_unlocked_duplicate is true
          let flag_status = this.unlockedSpells[363];
          if (flag_status) {
            if (greed) {
              opt = "data/entities/items/pickup/physics_greed_die.xml";
            } else {
              opt = "data/entities/items/pickup/physics_die.xml";
            }
          } else {
            opt = "data/entities/items/pickup/potion.xml";
          }
        } else if (opt === "runestone") {
          const r_opts = ["laser", "fireball", "lava", "slow", "null", "disc", "metal"];
          rnd = this.randoms.Random(0, r_opts.length - 1);
          let r_opt = r_opts[rnd];
          opt = "data/entities/items/pickup/runestones/runestone_" + r_opt + ".xml";
        } else if (opt === "orb") {
          if (greed) {
            opt = "data/entities/items/pickup/physics_gold_orb_greed.xml";
          } else {
            opt = "data/entities/items/pickup/physics_gold_orb.xml";
          }
        }
        const entity = { entity: opt, x, y: y - 10 };
        entities.push(entity);
      } else if (rnd <= 65) {
        // Random card
        let amount = 1;
        rnd = this.randoms.Random(0, 100);
        if (rnd <= 50) {
          amount = 1;
        } else if (rnd <= 70) {
          amount = amount + 1;
        } else if (rnd <= 80) {
          amount = amount + 2;
        } else if (rnd <= 90) {
          amount = amount + 3;
        } else {
          amount = amount + 4;
        }
        // For some reason, this extra Random is needed to generate the correct cards
        // let dud = this.randoms.Random(-5, 5);
        for (let i = 1; i <= amount; i++) {
          let card = this.make_random_card(x + (i - amount / 2) * 8, y - 4 + this.randoms.Random(-5, 5));
          entities.push({
            entity: "Spell",
            extra: card,
          });
        }
      } else if (rnd <= 84) {
        // Wand
        rnd = this.randoms.Random(0, 100);

        if (rnd <= 25) {
          entities.push({
            entity: "data/entities/items/wand_level_01.xml",
            extra: {
              cost: 30,
              level: 1,
              force_unshuffle: false,
            },
          });
        } else if (rnd <= 50) {
          entities.push({
            entity: "data/entities/items/wand_unshuffle_01.xml",
            extra: {
              cost: 25,
              level: 1,
              force_unshuffle: true,
            },
          });
        } else if (rnd <= 75) {
          entities.push({
            entity: "data/entities/items/wand_level_02.xml",
            extra: {
              cost: 40,
              level: 2,
              force_unshuffle: false,
            },
          });
        } else if (rnd <= 90) {
          entities.push({
            entity: "data/entities/items/wand_unshuffle_02.xml",
            extra: {
              cost: 40,
              level: 2,
              force_unshuffle: true,
            },
          });
        } else if (rnd <= 96) {
          entities.push({
            entity: "data/entities/items/wand_level_03.xml",
            extra: {
              cost: 60,
              level: 3,
              force_unshuffle: false,
            },
          });
        } else if (rnd <= 98) {
          entities.push({
            entity: "data/entities/items/wand_unshuffle_03.xml",
            extra: {
              cost: 60,
              level: 3,
              force_unshuffle: true,
            },
          });
        } else if (rnd <= 99) {
          entities.push({
            entity: "data/entities/items/wand_level_04.xml",
            extra: {
              cost: 80,
              level: 4,
              force_unshuffle: false,
            },
          });
        } else if (rnd <= 100) {
          entities.push({
            entity: "data/entities/items/wand_unshuffle_04.xml",
            extra: {
              cost: 80,
              level: 4,
              force_unshuffle: true,
            },
          });
        }
      } else if (rnd <= 95) {
        // Heart(s)
        rnd = this.randoms.Random(0, 100);

        if (rnd <= 88) {
          entities.push({
            entity: "data/entities/items/pickup/heart.xml",
          });
        } else if (rnd <= 89) {
          entities.push({
            entity: "data/entities/animals/illusions/dark_alchemist.xml",
          });
        } else if (rnd <= 99) {
          entities.push({
            entity: "data/entities/items/pickup/heart_better.xml",
          });
        } else {
          entities.push({
            entity: "data/entities/items/pickup/heart_fullhp.xml",
          });
        }
      } else if (rnd <= 98) {
        // Converts the chest into gold
        // EntityConvertToMaterial( entity_id, "gold");
        entities.push({
          // entity: 'gold_powder',
          entity: "data/entities/items/pickup/goldnugget_200.xml",
        });
      } else if (rnd <= 99) {
        count += 2;
      } else if (rnd <= 100) {
        count += 3;
      }
    }

    return entities.map<IItem>((e): IItem => {
      const res: Partial<IItem> = { entity: e.entity };
      if (e.x && e.y) {
        res.x = x;
        res.y = y;
        res.pos_x = x;
        res.pos_y = y;
      } else {
        res.x = rand_x;
        res.y = rand_y;
        res.pos_x = x + this.randoms.Random(-10, 10);
        res.pos_y = y + this.randoms.Random(-5, 5);
      }
      if (
        res.entity?.includes("data/entities/items/wand_") ||
        res.entity?.includes("data/entities/items/pickup/potion") ||
        res.entity?.includes("data/entities/items/pickup/powder")
      ) {
        res.y = this.randoms.RoundHalfOfEven(res.y);
        res.x = this.randoms.RoundHalfOfEven(res.x);
      }
      switch (res.entity) {
        case "data/entities/items/pickup/potion.xml":
        case "data/entities/items/pickup/potion_secret.xml":
        case "data/entities/items/pickup/potion_random_material.xml":
          res.y += 2;
          res.pos_y! += 2;
          break;
      }
      if (e.extra) {
        res.extra = e.extra;
      }
      return res as IItem;
    });
  }

  test(rule: IRule): boolean {
    return true;
  }
}

export default ChestRandomInfoProvider;
