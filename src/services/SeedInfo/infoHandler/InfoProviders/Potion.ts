import { IRandom } from '../../random';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';
import { GameGetDateAndTimeLocal } from './helpers';

const materials_standard = [
  {
    material: 'lava',
    cost: 300
  },
  {
    material: 'water',
    cost: 200
  },
  {
    material: 'blood',
    cost: 200
  },
  {
    material: 'alcohol',
    cost: 200
  },
  {
    material: 'oil',
    cost: 200
  },
  {
    material: 'slime',
    cost: 200
  },
  {
    material: 'acid',
    cost: 400
  },
  {
    material: 'radioactive_liquid',
    cost: 300
  },
  {
    material: 'gunpowder_unstable',
    cost: 400
  },
  {
    material: 'liquid_fire',
    cost: 400
  },
  {
    material: 'blood_cold',
    cost: 300
  }
];

const materials_magic = [
  {
    material: 'magic_liquid_unstable_teleportation',
    cost: 500
  },
  {
    material: 'magic_liquid_polymorph',
    cost: 500
  },
  {
    material: 'magic_liquid_random_polymorph',
    cost: 500
  },
  {
    material: 'magic_liquid_berserk',
    cost: 500
  },
  {
    material: 'magic_liquid_charm',
    cost: 800
  },
  {
    material: 'magic_liquid_invisibility',
    cost: 800
  },
  {
    material: 'material_confusion',
    cost: 800
  },
  {
    material: 'magic_liquid_movement_faster',
    cost: 800
  },
  {
    material: 'magic_liquid_faster_levitation',
    cost: 800
  },
  {
    material: 'magic_liquid_worm_attractor',
    cost: 800
  },
  {
    material: 'magic_liquid_protection_all',
    cost: 800
  },
  {
    material: 'magic_liquid_mana_regeneration',
    cost: 500
  }
];

export class PotionInfoProvider extends InfoProvider {
  provide(x: number, y: number): string {
    // width / 2 and height - 2? or height / 2 + 2?
    this.randoms.SetRandomSeed(x - 4.5, y - 6);

    let potion_material = 'water';

    if (this.randoms.Random(0, 100) <= 75) {
      if (this.randoms.Random(0, 100000) <= 50) {
        potion_material = 'magic_liquid_hp_regeneration';
      } else if (this.randoms.Random(200, 100000) <= 250) {
        potion_material = 'purifying_powder';
      } else {
        const p = this.randoms.randomFromArray(materials_magic);
        potion_material = p.material;
      }
    } else {
      const p = this.randoms.randomFromArray(materials_standard);
      potion_material = p.material;
    }

    const [year, month, day, h, m, s, jussi] = GameGetDateAndTimeLocal()

    if ((((month === 5) && (day === 1)) || ((month === 4) && (day === 30))) && (this.randoms.Random(0, 100) <= 20)) {
      potion_material = "sima"
    }

    if (jussi && this.randoms.Random(0, 100) <= 9) {
      potion_material = "juhannussima"
    }

    if (month === 2 && day === 14 && this.randoms.Random(0, 100) <= 8) {
      potion_material = "magic_liquid_charm"
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
