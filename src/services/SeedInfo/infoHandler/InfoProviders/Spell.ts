/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import spellData from '../../data/obj/spells.json';
import { Objectify } from '../../../helpers';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';

export class SpellInfoProvider extends InfoProvider {
  spells = spellData as Objectify<typeof spellData>;

  provide(spellName: string) {
    let found = this.spells[spellName];
    if (found) return found;
    console.warn("Could not find spell: " + spellName);
    return {
      id: spellName,
      sprite: ''
    };
  }

  test(rule: IRule): boolean {
    return true;
  }
}
