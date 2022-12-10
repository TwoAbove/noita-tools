import { IRandom } from '../../random';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';
import { GameGetDateAndTimeLocal } from './helpers';

const potions =
  [
    {
      material: "magic_liquid_hp_regeneration_unstable",
      cost: 300,
    },
    {
      material: "blood_worm",
      cost: 300,
    },
    {
      material: "gold",
      cost: 300,
    },
    {
      material: "snow",
      cost: 300,
    },
    {
      material: "glowshroom",
      cost: 300,
    },
    {
      material: "bush_seed",
      cost: 300,
    },
    {
      material: "cement",
      cost: 300,
    },
    {
      material: "salt",
      cost: 300,
    },
    {
      material: "sodium",
      cost: 300,
    },
    {
      material: "mushroom_seed",
      cost: 300,
    },
    {
      material: "plant_seed",
      cost: 300,
    },
    {
      material: "urine",
      cost: 300,
    },
    {
      material: "purifying_powder",
      cost: 300,
    },
  ];

export class PotionSecretInfoProvider extends InfoProvider {
  provide(x: number, y: number): string {
    this.randoms.SetRandomSeed(x - 4.5, y - 4);
    const potion_material = this.randoms.randomFromArray(potions).material;
    return potion_material;
  }

  test(rule: IRule) {
    return true;
  }
}
