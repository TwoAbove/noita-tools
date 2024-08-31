/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { MapInfoProvider } from "./Map";

// Hourglass chamber
export class SnowcastleSecretChamberInfoProvider extends InfoProvider {
  mapInfoProvider: MapInfoProvider;
  constructor(randoms, mapInfoProvider: MapInfoProvider) {
    super(randoms);
    this.mapInfoProvider = mapInfoProvider;
  }

  provide(seed: number) {
    const points = this.mapInfoProvider.provide(27, 24, seed);

    const spells = points.interestPoints
      .points!.filter(p => p.item === "Spell")!
      .map(spellPoint => spellPoint.extra.spell);

    console.log(spells);

    return spells;
  }

  test(rule: IRule): boolean {
    return true;
  }
}

export default SnowcastleSecretChamberInfoProvider;
