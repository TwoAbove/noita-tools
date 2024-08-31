/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class StartingBombSpellInfoProvider extends InfoProvider {
  spells = ["BOMB", "DYNAMITE", "MINE", "ROCKET", "GRENADE"];

  provide() {
    this.randoms.SetRandomSeed(-1, 0);

    let res = this.randoms.Random(80, 110);
    res = this.randoms.Random(1, 1);
    res = this.randoms.Random(1, 10);
    res = this.randoms.Random(3, 8);
    res = this.randoms.Random(5, 20);

    res = this.randoms.Random(1, 100);

    let actions = this.spells;

    if (res < 50) {
      return this.randoms.randomFromArray(actions);
    } else {
      return "BOMB";
    }
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    if (rule.val) {
      return rule.val === info;
    }
    return true;
  }
}

export default StartingBombSpellInfoProvider;
