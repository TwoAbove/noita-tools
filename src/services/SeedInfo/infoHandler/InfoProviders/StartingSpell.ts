/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class StartingSpellInfoProvider extends InfoProvider {
  spells = ["LIGHT_BULLET", "SPITTER", "RUBBER_BALL", "BOUNCY_ORB"];

  get_random_between_range(target: any[]) {
    let minval = target[0];
    let maxval = target[1];
    return this.randoms.Random(minval, maxval);
  }

  get_random_from(target: string | any[]) {
    let rnd = this.randoms.Random(0, target.length - 1);

    return String(target[rnd]);
  }

  provide() {
    this.randoms.SetRandomSeed(0, -11);

    let gun: any = {};
    gun.name = ["Bolt staff"];
    gun.deck_capacity = [2, 3];
    gun.actions_per_round = 1;
    gun.reload_time = [20, 28];
    gun.shuffle_deck_when_empty = 0;
    gun.fire_rate_wait = [9, 15];
    gun.spread_degrees = 0;
    gun.speed_multiplier = 1;
    gun.mana_charge_speed = [25, 40];
    gun.mana_max = [80, 130];
    // Note(Petri): Removed DYNAMITE
    gun.actions = ["SPITTER", "RUBBER_BALL", "BOUNCY_ORB"];

    let mana_max = this.get_random_between_range(gun.mana_max);
    let deck_capacity = this.get_random_between_range(gun.deck_capacity);

    let ui_name = this.get_random_from(gun.name);

    let gun_config_reload_time = this.get_random_between_range(gun.reload_time);
    let gunaction_config_fire_rate_wait = this.get_random_between_range(gun.fire_rate_wait);
    let mana_charge_speed = this.get_random_between_range(gun.mana_charge_speed);

    let gun_config_actions_per_round = gun.actions_per_round;
    let gun_config_deck_capacity = deck_capacity;
    let gun_config_shuffle_deck_when_empty = gun.shuffle_deck_when_empty;
    let gunaction_config_spread_degrees = gun.spread_degrees;
    let gunaction_config_speed_multiplier = gun.speed_multiplier;

    let mana = mana_max;

    let action_count = Math.min(this.randoms.Random(1, 3), Number(deck_capacity));
    let gun_action = "LIGHT_BULLET";

    if (this.randoms.Random(1, 100) < 50) {
      gun_action = this.get_random_from(gun.actions);
    }
    return gun_action;
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    if (rule.val) {
      return rule.val === info;
    }
    return true;
  }
}
