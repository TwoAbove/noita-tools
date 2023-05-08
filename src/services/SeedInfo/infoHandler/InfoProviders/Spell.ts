/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import spellData from "../../data/spells.json";
import spellObjData from "../../data/obj/spells.json";
import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class SpellInfoProvider extends InfoProvider {
  spells = spellObjData;
  spellsArr = spellData;

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
