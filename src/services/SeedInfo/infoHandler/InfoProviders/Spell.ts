/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class SpellInfoProvider extends InfoProvider {
  spellsPromise = import("../../data/obj/spells.json")
    .catch(e => {
      console.error(e);
      return {};
    })
    .then((spellData: any) => {
      this.spells = spellData.default;
      this.spellsArr = Object.values(spellData.default);
    });

  spells;
  spellsArr;

  async ready() {
    await this.spellsPromise;
    return;
  }

  provide(spellName: string) {
    let found = this.spells[spellName];
    if (found) return found;
    return {
      id: spellName,
      sprite: "",
      description: "",
      name: "",
    };
  }

  test(rule: IRule): boolean {
    return true;
  }
}
