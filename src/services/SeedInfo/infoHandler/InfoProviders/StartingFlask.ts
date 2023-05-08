/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import startingMaterialsData from "../../data/starting-flask-materials.json";
import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class StartingFlaskInfoProvider extends InfoProvider {
  materials = startingMaterialsData;
  provide() {
    let x = -4.5;
    let y = -4;
    this.randoms.SetRandomSeed(x, y);

    let material = "unknown";

    let res = this.randoms.Random(1, 100);

    if (res <= 65) {
      res = this.randoms.Random(1, 100);
      // I want this to look better, hence the false
      if (false) {
      } else if (res <= 10) {
        material = "mud";
      } else if (res <= 20) {
        material = "water_swamp";
      } else if (res <= 30) {
        material = "water_salt";
      } else if (res <= 40) {
        material = "swamp";
      } else if (res <= 50) {
        material = "snow";
      } else {
        material = "water";
      }
    } else if (res <= 70) {
      material = "blood";
    } else if (res <= 99) {
      res = this.randoms.Random(0, 100);
      material = this.randoms.randomFromArray([
        "acid",
        "magic_liquid_polymorph",
        "magic_liquid_random_polymorph",
        "magic_liquid_berserk",
        "magic_liquid_charm",
        "magic_liquid_movement_faster",
      ]);
    } else {
      // one in 100,000 shot
      res = this.randoms.Random(0, 100000);
      if (res === 666) material = "urine";
      else if (res === 79) material = "gold";
      else material = this.randoms.randomFromArray(["slime", "gunpowder_unstable"]);
    }
    return material;
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    if (rule.val) {
      return rule.val === info;
    }
    return true;
  }
}
