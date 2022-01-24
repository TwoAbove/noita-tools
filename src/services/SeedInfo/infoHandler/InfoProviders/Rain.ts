/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import rainData from '../../data/rain.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';


export class RainInfoProvider extends InfoProvider {
  rainTypes = rainData;

  provide(): { isRaining: boolean, material: string, probability: number } {
    let snows = false; // TODO..........
    let rainfall_chance = 1 / 15;
    let rnd = { x: 7893434, y: 3458934 };
    let isRaining =
      !snows && this.randoms.random_next(rnd, 0.0, 1.0) <= rainfall_chance; //-- rain is based on world seed
    if (!isRaining) return { isRaining, material: '', probability: 1 - rainfall_chance };
    let pickedRain = this.randoms.pick_random_from_table_backwards(
      this.rainTypes,
      rnd
    );
    return {
      isRaining,
      material: pickedRain.rain_material,
      probability: rainfall_chance * pickedRain.chance
    };
  }

  test(rule: IRule): boolean {
    let info = this.provide();

    for (const [key, val] of Object.entries(rule.val)) {
      if (val !== info[key]) {
        return false;
      }
    }

    return true;
  }
}
