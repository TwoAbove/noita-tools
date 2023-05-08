import { IRandom } from "../../random";
import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { GameGetDateAndTimeLocal } from "./helpers";

const materials_standard = [
  {
    material: "sand",
    cost: 300,
  },
  {
    material: "soil",
    cost: 200,
  },
  {
    material: "snow",
    cost: 200,
  },
  {
    material: "salt",
    cost: 200,
  },
  {
    material: "coal",
    cost: 200,
  },
  {
    material: "gunpowder",
    cost: 200,
  },
  {
    material: "fungisoil",
    cost: 200,
  },
];

const materials_magic = [
  {
    material: "copper",
    cost: 500,
  },
  {
    material: "silver",
    cost: 500,
  },
  {
    material: "gold",
    cost: 500,
  },
  {
    material: "brass",
    cost: 500,
  },
  {
    material: "bone",
    cost: 800,
  },
  {
    material: "purifying_powder",
    cost: 800,
  },
  {
    material: "fungi",
    cost: 800,
  },
];

export class PowderStashInfoProvider extends InfoProvider {
  provide(x: number, y: number): string {
    this.randoms.SetRandomSeed(x - 4.5, y - 5.5);

    let potion_material = "sand";

    if (this.randoms.Random(0, 100) <= 75) {
      const p = this.randoms.randomFromArray(materials_magic);
      potion_material = p.material;
    } else {
      const p = this.randoms.randomFromArray(materials_standard);
      potion_material = p.material;
    }

    return potion_material;
  }

  test(rule: IRule) {
    return true;
  }
  //  {
  //   let info = this.provide(...rule.params)
  //   if (rule.path) {
  //     info = get(info, rule.path);
  //   }
  //   info = Array.isArray(info) ? new Set(info) : info;
  //   console.log('info', info);
  //   console.log('rule.val', rule.val);
  //   return isEqual(rule.val, info);
  // }
}
