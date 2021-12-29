/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import loadRandom, { IRandom } from './random';

import biomeModifiersData from './data/obj/biome_modifiers.json';
import biomeNamesData from './data/obj/biome_names.json';
import biomesData from './data/biome_names.json';
import fungalMaterialsData from './data/fungal-materials.json';
import materialsData from './data/materials.json';
import perksData from './data/obj/perks.json';
import rainData from './data/rain.json';
import spellData from './data/obj/spells.json';
import startingMaterialsData from './data/starting-flask-materials.json';
import templeData from './data/temple-locations.json';
import { includesAll, includesSome, Merge, Objectify } from '../helpers';

// Ideally we use a JSON schema validator, but it doesn't handle sparse arrays well.
// Is there something to get deep sparse inclusion between js objects???
export interface IRule {
  type: string;
  params?: any;
  path?: string;
  // val shuold be a supported type by the structured clone algorithm:
  // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
  val: any;
}

export abstract class InfoProvider {
  randoms: IRandom;

  constructor(randoms: IRandom) {
    this.randoms = randoms;
  }
  abstract provide(...args: any[]): any;

  abstract test(rule: IRule): boolean;
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

export class ShopInfoProvider extends InfoProvider {
  temples = templeData;
  spells = spellData as Objectify<typeof spellData>;
  biomes = [
    null, // 0
    0,
    0,
    0,
    1,
    1, // 5
    1,
    2,
    2,
    2,
    2, // 10
    2,
    2,
    3,
    3,
    3, // 15
    3,
    4,
    4,
    4,
    4, // 20
    5,
    5,
    5,
    5,
    6, // 25
    6,
    6,
    6,
    6,
    6, // 30
    6,
    6,
    6,
  ]

  generate_shop_item(x: number, y: number, cheap_item: boolean, biomeid_?: number, is_stealable?: boolean) {
    // Todo: scripts/items/generate_shop_item.lua

    let biomepixel = Math.floor(y / 512)
    let biomeid = this.biomes[biomepixel] || 0;

    if (biomepixel > 35) {
      biomeid = 7;
    }

    if (!this.biomes[biomepixel] && !biomeid_) {
      console.log("Unable to find biomeid for chunk at depth ", biomepixel);
    }

    if (biomeid_) {
      biomeid = biomeid_;
    }

    if (!is_stealable) {
      is_stealable = false
    }

    let item = "";
    let cardcost = 0;

    // --Note(Petri): Testing how much squaring the biomeid for prices affects things
    let level = biomeid;
    biomeid = biomeid * biomeid;

    // This thing is in the engine
    item = "bomb"; // GetRandomAction(x, y, level, 0)
    cardcost = 0;

    let price;

    const spell = this.spells[item.toUpperCase()];
    price = Math.max(Math.floor(((spell.price * 0.30) + (70 * biomeid)) / 10) * 10, 10);
    cardcost = price;
    if (spell.spawn_requires_flag) {
      let flag = spell.spawn_requires_flag
      // In-engine function
      // if (HasFlagPersistent(flag) == false) {
      // print("Trying to spawn "..tostring(spell.id).. " even though flag "..tostring(flag).. " not set!!")
      // }
    }

    if (cheap_item) {
      cardcost = 0.5 * cardcost
    }

    if (biomeid >= 10) {
      price = price * 5.0
      cardcost = cardcost * 5.0
    }

    // let eid = CreateItemActionEntity(item, x, y)

    // if (cheap_item) {
    //   EntityLoad("data/entities/misc/sale_indicator.xml", x, y)
    // }

    // --let x, y = EntityGetTransform(entity_id)
    // --SetRandomSeed(x, y)

    let stealable_value = false
    if (is_stealable) {
      stealable_value = true
    }
  }

  generate_shop_wand(x: number, y: number, cheap_item: boolean, biomeid_?: number) {
    // Todo: scripts/items/generate_shop_item.lua
    let biomepixel = Math.floor(y / 512)
    let biomeid = this.biomes[biomepixel] || 0;

    if (biomepixel > 35) {
      biomeid = 7;
    }

    if (!this.biomes[biomepixel] && !biomeid_) {
      console.log("Unable to find biomeid for chunk at depth ", biomepixel);
    }

    if (biomeid_) {
      biomeid = biomeid_;
    }

    if (biomeid < 1) { biomeid = 1; }
    if (biomeid > 6) { biomeid = 6; }

    let item = "data/entities/items/"

    const r = this.randoms.Random(0, 100)
    if (r <= 50) {
      item = item + "wand_level_0"
    } else {
      item = item + "wand_unshackle_0"
    }

    item = item + biomeid + ".xml"

    // -- Note( Petri ): Testing how much squaring the biomeid for prices affects things
    biomeid = (0.5 * biomeid) + (0.5 * biomeid * biomeid)
    let wandcost = (50 + biomeid * 210) + (this.randoms.Random(-15, 15) * 10)

    if (cheap_item) {
      wandcost = 0.5 * wandcost
    }
    // In-engine
    // const eid = EntityLoad( item, x, y )

  }

  spawn_all_shopitems(x: number, y: number, pickedPerks: string[][]) {
    this.randoms.SetRandomSeed(x, y);

    const numberOfExtraItems = pickedPerks.flat().filter(p => p === "EXTRA_SHOP_ITEM").length;
    const count = 5 + numberOfExtraItems; // GlobalsGetValue( "TEMPLE_SHOP_ITEM_COUNT", "5" );

    const width = 132
    const item_width = width / count
    const sale_item_i = this.randoms.Random(1, count);
    const type = this.randoms.Random(0, 100) <= 50 ? 'item' : 'wand';
    const items: any[] = [];
    for (let i = 1; i <= count; i++) {
      if (type === 'item') {
        items.push([
          undefined, //this.generate_shop_item(x + (i - 1) * item_width, y, i === sale_item_i, undefined, true),
          undefined //this.generate_shop_item(x + (i - 1) * item_width, y - 30, false, undefined, true)
        ]);
      } else {
        items.push();
        // items.push(this.generate_shop_wand(x + (i - 1) * item_width, y, i === sale_item_i));
      }
    }
    return {
      type,
      items
    }
  }

  provide(pickedPerks: string[][] = [], worldOffset: number = 0, tx = 0, ty = 0) {
    const res: Array<{
      type: string;
      items: any[];
    }> = [];
    for (let i = 0; i < this.temples.length; i++) {
      const temple = this.temples[i];
      // Magic numbers taken from src/services/SeedInfo/infoHandler.check.ts
      let offsetX = 0 - 299, offsetY = 0 - 15;
      if (worldOffset !== 0) {
        offsetX += 35840 * worldOffset;
        if (!this.temples[i]) break;
      }
      res.push(this.spawn_all_shopitems(temple.x + offsetX, temple.y + offsetY, pickedPerks))
    }
    return res;
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    for (let i = 0; i <= info.length; i++) {
      if (rule.val[i]?.type) {
        if (rule.val[i].type !== info[i].type) {
          return false;
        }
      }
    }
    return true;
  }
}

export class AlchemyInfoProvider extends InfoProvider {
  provide() {
    const res = this.randoms.PickForSeed();
    const [LC, AP] = res.split(';');
    return {
      LC: LC.split(':')[1].split(','),
      AP: AP.split(':')[1].split(',')
    };
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    const allLC = includesAll(Array.from(rule.val.LC), info.LC);
    const allAP = includesAll(Array.from(rule.val.AP), info.AP);
    return allLC && allAP;
  }
}

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

export class StartingFlaskInfoProvider extends InfoProvider {
  materials = startingMaterialsData;
  provide() {
    this.randoms.SetRandomSeed(-4.5, -4);

    let material = 'unknown';

    let res = this.randoms.Random(1, 100);

    if (res <= 65) {
      res = this.randoms.Random(1, 100);
      // I want this to look better, hence the false
      if (false) {
      } else if (res <= 10) {
        material = 'mud';
      } else if (res <= 20) {
        material = 'water_swamp';
      } else if (res <= 30) {
        material = 'water_salt';
      } else if (res <= 40) {
        material = 'swamp';
      } else if (res <= 50) {
        material = 'snow';
      } else {
        material = 'water';
      }
    } else if (res <= 70) {
      material = 'blood';
    } else if (res <= 99) {
      res = this.randoms.Random(0, 100);
      material = this.randoms.randomFromArray([
        'acid',
        'magic_liquid_polymorph',
        'magic_liquid_random_polymorph',
        'magic_liquid_berserk',
        'magic_liquid_charm',
        'magic_liquid_movement_faster'
      ]);
    } else {
      // one in 100,000 shot
      res = this.randoms.Random(0, 100000);
      if (res === 666) material = 'urine';
      else if (res === 79) material = 'gold';
      else
        material = this.randoms.randomFromArray([
          'slime',
          'gunpowder_unstable'
        ]);
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

export class StartingSpellInfoProvider extends InfoProvider {
  spells = ['LIGHT_BULLET', 'SPITTER', 'RUBBER_BALL', 'BOUNCY_ORB'];

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
    gun.name = ['Bolt staff'];
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
    gun.actions = ['SPITTER', 'RUBBER_BALL', 'BOUNCY_ORB'];

    let mana_max = this.get_random_between_range(gun.mana_max);
    let deck_capacity = this.get_random_between_range(gun.deck_capacity);

    let ui_name = this.get_random_from(gun.name);

    let gun_config_reload_time = this.get_random_between_range(gun.reload_time);
    let gunaction_config_fire_rate_wait = this.get_random_between_range(
      gun.fire_rate_wait
    );
    let mana_charge_speed = this.get_random_between_range(
      gun.mana_charge_speed
    );

    let gun_config_actions_per_round = gun.actions_per_round;
    let gun_config_deck_capacity = deck_capacity;
    let gun_config_shuffle_deck_when_empty = gun.shuffle_deck_when_empty;
    let gunaction_config_spread_degrees = gun.spread_degrees;
    let gunaction_config_speed_multiplier = gun.speed_multiplier;

    let mana = mana_max;

    let action_count = Math.min(
      this.randoms.Random(1, 3),
      Number(deck_capacity)
    );
    let gun_action = 'LIGHT_BULLET';

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
    }
    else {
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

export class Global {

  _G = {};
  GetValue(varname: string, defaultvalue?: string | undefined) {
    return this._G[varname] || defaultvalue;
  }
  SetValue(varname: string, varvalue: string | number) {
    this._G[varname] = varvalue
  }
  GameAddFlagRun(flag: string) {
    this._G["FLAG_" + flag] = true
  }
  GameHasFlagRun(flag: string) {
    return this._G["FLAG_" + flag] != null
  }
}

export class PerkInfoProvider extends InfoProvider {
  perks = perksData as Objectify<typeof perksData>;
  perksArr = Object.values(this.perks);
  temples = templeData;

  _G = new Global();

  _getReroll(perkDeck: any[], amountOfPerks: number) {
    const perks = perkDeck;
    const perk_count = amountOfPerks;
    const result: any[] = [];
    for (let i = 0; i < perk_count; i++) {
      let next_perk_index = Number(this._G.GetValue("TEMPLE_REROLL_PERK_INDEX", String(perks.length - 1)));
      let perk_id = perks[next_perk_index];

      while (!perk_id) {
        // if we over flow
        perks[next_perk_index] = "LEGGY_FEET"
        next_perk_index--;
        if (next_perk_index < 0) {
          next_perk_index = perks.length - 1;
        }
        perk_id = perks[next_perk_index];
      }

      next_perk_index--;
      if (next_perk_index < 0) {
        next_perk_index = perks.length - 1;
      }

      this._G.SetValue("TEMPLE_REROLL_PERK_INDEX", String(next_perk_index))

      this._G.GameAddFlagRun(this.get_perk_flag_name(perk_id))
      result.push(perk_id);
    }

    return result;
  }

  get_perk_flag_name(perk_id: string) {
    return "PERK_" + perk_id
  }

  get_perk_picked_flag_name(perk_id: string) {
    return "PERK_PICKED_" + perk_id
  }

  perk_spawn_many(perks: string | any[], add = 0, x: number, y: number) {
    const result: any[] = [];
    const perk_count = Number(this._G.GetValue("TEMPLE_PERK_COUNT", "3")) + add;

    for (let i = 0; i < perk_count; i++) {
      let next_perk_index = Number(this._G.GetValue("TEMPLE_NEXT_PERK_INDEX", "0"));
      const perk_id = perks[next_perk_index];

      //while( perk_id === undefined || perk_id === "" ) {
      //  // if we over flow
      //  perks[next_perk_index] = "LEGGY_FEET"
      //  next_perk_index = next_perk_index + 1
      //  if (next_perk_index > perks.length) then
      //    next_perk_index = 0;
      //  }
      //  perk_id = perks[next_perk_index];
      //}

      next_perk_index++;
      if (next_perk_index >= perks.length) {
        next_perk_index = 0;
      }
      this._G.SetValue("TEMPLE_NEXT_PERK_INDEX", String(next_perk_index))

      this._G.GameAddFlagRun(this.get_perk_flag_name(perk_id))
      result.push(perk_id)
    }
    return result;
  }


  table_contains = (table: { [s: string]: unknown; } | ArrayLike<unknown>, element: unknown) => {
    return Object.values(table).indexOf(element) !== -1
  };

  shuffle_table = (t: any[]) => {
    //assert( t, "shuffle_table() expected a table, got nil" )
    const iterations = t.length - 1;

    for (let i = iterations; i >= 1; i--) {
      //for i = iterations, 2, -1 do
      const j = this.randoms.Random(0, i);
      //console.log("j", j);
      const tmp = t[i];
      t[i] = t[j];
      t[j] = tmp;
      //[t[i], t[j]] = [t[j], t[i]];
    }
  }
  // this generates global perk spawn order for current world seed
  perk_get_spawn_order = (ignore_these_?: any) => {
    // this function should return the same list in the same order no matter when or where during a run it is called.
    // the expection is that some of the elements in the list can be set to "" to indicate that they're used

    // 1) Create a Deck from all the perks, add multiple of stackable
    // 2) Shuffle the Deck
    // 3) Remove duplicate perks that are too close to each other

    // NON DETERMISTIC THINGS ARE ALLOWED TO HAPPEN
    // 4) Go through the perk list and "" the perks we've picked up
    const hasFilter = ignore_these_ ? true : false;
    const ignore_these = ignore_these_ || {};

    const MIN_DISTANCE_BETWEEN_DUPLICATE_PERKS = 4;
    const DEFAULT_MAX_STACKABLE_PERK_COUNT = 128;

    this.randoms.SetRandomSeed(1, 2);

    // 1) Create a Deck from all the perks, add multiple of stackable
    // create the perk pool
    // let perk_pool = {}
    const perk_deck: any[] = [];
    const stackable_distances = {};
    const stackable_count = {};			// -1 = NON_STACKABLE otherwise the result is how many times can be stacked

    // function create_perk_pool
    for (const perk_data of this.perksArr) {
      if (hasFilter) {
        if (this.table_contains(ignore_these, perk_data.id)) {
          continue;
        }
      }
      if (perk_data.not_in_default_perk_pool) {
        continue;
      }

      const perk_name = perk_data.id;
      let how_many_times = 1;
      stackable_distances[perk_name] = -1;
      stackable_count[perk_name] = -1;

      if (perk_data.stackable) {
        let max_perks = this.randoms.Random(1, 2);
        // TODO( Petri ): We need a new variable that indicates how many times they can appear in the pool
        if (perk_data.max_in_perk_pool) {
          max_perks = this.randoms.Random(1, perk_data.max_in_perk_pool);
        }

        if (perk_data.stackable_maximum) {
          stackable_count[perk_name] = perk_data.stackable_maximum;
        } else {
          stackable_count[perk_name] = DEFAULT_MAX_STACKABLE_PERK_COUNT;
        }

        if (perk_data.stackable_is_rare) {
          max_perks = 1;
        }

        stackable_distances[perk_name] = perk_data.stackable_how_often_reappears || MIN_DISTANCE_BETWEEN_DUPLICATE_PERKS;

        how_many_times = this.randoms.Random(1, max_perks);
      }

      for (let j = 1; j <= how_many_times; j++) {
        perk_deck.push(perk_name);
      }
    }

    //console.log("STEP 1", perk_deck);

    // 2) Shuffle the Deck
    this.shuffle_table(perk_deck);

    //console.log("STEP 2", perk_deck);

    // 3) Remove duplicate perks that are too close to each other
    // we need to do this in reverse, since otherwise table.remove might cause the iterator to bug out
    for (let i = perk_deck.length - 1; i >= 0; i--) {
      const perk = perk_deck[i];
      if (stackable_distances[perk] !== -1) {

        const min_distance = stackable_distances[perk];
        let remove_me = false;

        //  ensure stackable perks are not spawned too close to each other
        for (let ri = i - min_distance; ri < i; ri++) {
          if (ri >= 0 && perk_deck[ri] === perk) {
            remove_me = true;
            break;
          }
        }

        if (remove_me) { perk_deck.splice(i, 1); }
      }
    }

    //console.log("STEP 3", perk_deck);

    // NON DETERMINISTIC THINGS ARE ALLOWED TO HAPPEN
    // 4) Go through the perk list and "" the perks we've picked up
    // remove non-stackable perks already collected from the list
    for (let i = 0; i < perk_deck.length; i++) {
      const perk_name = perk_deck[i];
      const flag_name = this.get_perk_picked_flag_name(perk_name);
      const pickup_count = Number(this._G.GetValue(flag_name + "_PICKUP_COUNT", "0"));

      // GameHasFlagRun( flag_name ) - this is if its ever been spawned
      // has been picked up
      if ((pickup_count > 0)) {
        const stack_count = stackable_count[perk_name] || -1;
        // print( perk_name .. ": " .. tostring( stack_count ) )
        if ((stack_count === -1) || (pickup_count >= stack_count)) {
          perk_deck[i] = "";
        }
      }
    }

    //console.log("STEP 4", perk_deck);

    // DEBUG
    if (false) {
      for (let i = 0; i < perk_deck.length; i++) {
        let perk = perk_deck[i];
        console.log(String(i) + ": " + perk)
      }
    }

    return perk_deck;
  }

  getPerkDeck(returnPerkObjects?: boolean) {
    const result = this.perk_get_spawn_order();
    if (returnPerkObjects) {
      for (let i = 0; i < result.length; i++) {
        result[i] = this.perks[result[i].id];
      }
    }
    return result;
  }

  provide(perkPicks?: any, maxLevels?: number, returnPerkObjects?: boolean, worldOffset?: number, rerolls?: number[][]) {
    perkPicks = perkPicks || [];
    worldOffset = worldOffset || 0;
    if (!maxLevels || maxLevels === -1) maxLevels = Infinity;

    this._G = new Global();
    const perkDeck = this.getPerkDeck();
    type IPerk = typeof this.perks[string];
    const result: IPerk[][] = [];
    let world = 0;
    this._G.SetValue("TEMPLE_PERK_COUNT", "3")
    const temple_locations = this.temples;
    while (true) {
      let i = 0;
      for (let loc of temple_locations) {
        if (i >= maxLevels) break;
        let offsetX = 0, offsetY = 0;
        if (worldOffset !== 0 && world !== 0) {
          offsetX += 35840 * worldOffset;
          if (i + 1 === temple_locations.length) break;
        }
        let add = 0;
        if (perkPicks[world] && perkPicks[world][i]) {
          if (perkPicks[world][i] === 'GAMBLE') {
            add = 2;
          }
        }

        let res = this.perk_spawn_many(perkDeck, add, loc.x + offsetX, loc.y + offsetY);

        if (rerolls && rerolls[world] && rerolls[world][i] > 0) {
          for (let j = 0; j < rerolls[world][i] - 1; j++) {
            this._getReroll(perkDeck, res.length);
          }
          let rerollRes = this._getReroll(perkDeck, res.length);
          if (world === worldOffset) {
            result.push(rerollRes);
          }
        } else {
          if (world === worldOffset) {
            result.push(res);
          }
        }
        let picked_perk = perkPicks[world]?.[i]
        if (picked_perk) {
          let flag_name = this.get_perk_picked_flag_name(picked_perk);
          this._G.GameAddFlagRun(flag_name);
          this._G.SetValue(flag_name + "_PICKUP_COUNT", Number(this._G.GetValue(flag_name + "_PICKUP_COUNT", "0")) + 1);
          if (picked_perk === "EXTRA_PERK") {
            this._G.SetValue("TEMPLE_PERK_COUNT", parseFloat(this._G.GetValue("TEMPLE_PERK_COUNT")) + 1)
          }
        }
        i++;
      }
      if (world === worldOffset) break;
      if (worldOffset < 0) world--;
      else world++;
    }
    //console.log(_G)
    if (returnPerkObjects) {
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i].map((e: any) => this.perks[e]) as IPerk[];
      }
    }
    return result;
  }

  test(rule: IRule): boolean {
    const info = this.provide();
    for (let i = 0; i < info.length; i++) {
      if (rule.val[i].length) {
        if (!includesAll(info[i] as any as string[], rule.val[i])) {
          return false;
        }
      }
    }
    return true;
  }
}

export class FungalInfoProvider extends InfoProvider {
  data = fungalMaterialsData;
  _G = new Global();

  fungal_shift(entity: null, x: null, y: null, debug_no_limits: boolean): { flaskTo: boolean, flaskFrom: boolean, from: string[], to: string } {
    //let parent = EntityGetParent(entity);
    //if (parent != 0) {
    //	entity = parent
    //}

    let iter = Number(this._G.GetValue("fungal_shift_iteration", "0"));
    this._G.SetValue("fungal_shift_iteration", String(iter + 1));
    if (iter > 20 && !debug_no_limits) {
      return { flaskTo: false, flaskFrom: false, from: [], to: '' };
    }

    this.randoms.SetRandomSeed(89346, 42345 + iter);

    let converted_any = false;

    let rnd = this.randoms.random_create(9123, 58925 + iter); // TODO: store for next change
    let from = this.randoms.pick_random_from_table_weighted(rnd, this.data.materials_from);
    let to = this.randoms.pick_random_from_table_weighted(rnd, this.data.materials_to);

    let flaskFrom = false;
    let flaskTo = false;
    // if a potion is equipped, randomly use main material from potion as one of the materials
    if (this.randoms.random_nexti(rnd, 1, 100) <= 75) {
      if (this.randoms.random_nexti(rnd, 1, 100) <= 50) {
        flaskFrom = true;
      } else {
        flaskTo = true;
      }
    }

    let from_materials: string[] = [];
    // apply effects
    let to_material = to.material;
    for (let i = 0; i < from.materials.length; i++) {
      let it = from.materials[i];
      let from_material = it;

      // convert
      if (from_material !== to_material) {
        //console.log(CellFactory_GetUIName(from_material) + " -> " + CellFactory_GetUIName(to_material));

        from_materials.push(from_material);
        //return [from_material, to_material];
      }
    }
    return { flaskTo, flaskFrom, from: from_materials, to: to_material };
  }

  provide(maxShifts?: number) {
    let debug_no_limits = false;
    this._G.SetValue("fungal_shift_iteration", "0")
    const shifts: Array<ReturnType<FungalInfoProvider['fungal_shift']>> = [];
    if (!maxShifts || maxShifts === -1) maxShifts = 20;
    for (let i = 0; i < maxShifts; i++) {
      shifts.push(this.fungal_shift(null, null, null, false));
    }

    return shifts;
  }

  //   let info: {
  //     flaskTo: boolean;
  //     flaskFrom: boolean;
  //     from: string[];
  //     to: string;
  // }[]

  test(rule: IRule): boolean {
    let info = this.provide();
    for (let i = 0; i <= info.length; i++) {
      if (!rule.val[i]) {
        continue;
      }

      if (rule.val[i].flaskTo && rule.val[i].flaskTo !== info[i].flaskTo) {
        return false;
      }

      if (rule.val[i].flaskFrom && rule.val[i].flaskFrom !== info[i].flaskFrom) {
        return false;
      }

      if (rule.val[i].from && !includesSome(rule.val[i].from, info[i].from)) {
        return false;
      }

      if (rule.val[i].to && !rule.val[i].to.includes(info[i].to)) {
        return false;
      }
    }
    return true;
  }
}


export class BiomeModifierInfoProvider extends InfoProvider {
  biomes = [
    ["coalmine", "mountain_hall"],
    ["coalmine_alt"],
    ["excavationsite"],
    ["fungicave"],
    ["snowcave"],
    ["snowcastle"],
    ["rainforest", "rainforest_open"],
    ["vault"],
    ["crypt"],
  ];
  modifiers = biomeModifiersData as Objectify<typeof biomeModifiersData>;
  biomeNames = biomeNamesData;

  CHANCE_OF_MODIFIER_PER_BIOME = 0.1;
  CHANCE_OF_MODIFIER_COALMINE = 0.2;
  CHANCE_OF_MODIFIER_EXCAVATIONSITE = 0.15;
  CHANCE_OF_MOIST_FUNGICAVE = 0.5;
  CHANCE_OF_MOIST_LAKE = 0.75;

  HasFlagPersistent(flag: any) { // assume everything is unlocked
    return true;
  }

  get_modifier(modifier_id: string) {
    return this.modifiers[modifier_id];
  }

  biome_modifier_applies_to_biome(modifier: { requires_flag: any; does_not_apply_to_biome: string | any[]; apply_only_to_biome: string | any[]; }, biome_name: string) {
    if (!modifier) {
      return false;
    }

    let ok = true;

    if (modifier.requires_flag) {
      if (!this.HasFlagPersistent(modifier.requires_flag)) {
        return false;
      }
    }

    if (modifier.does_not_apply_to_biome) {
      for (let i = 0; i < modifier.does_not_apply_to_biome.length; i++) {
        let skip_biome = modifier.does_not_apply_to_biome[i];
        if (skip_biome === biome_name) {
          ok = false;
          break;
        }
      }
    }

    if (modifier.apply_only_to_biome) {
      ok = false
      for (let i = 0; i < modifier.apply_only_to_biome.length; i++) {
        let required_biome = modifier.apply_only_to_biome[i];
        if (required_biome === biome_name) {
          ok = true;
          break;
        }
      }
    }

    return ok;
  }

  has_modifiers(biome_name: string, ctx) {
    if (biome_name === "coalmine" && ctx.deaths < 8 && ctx.should_be_fully_deterministic === false) {
      return false
    }

    let chance_of_modifier = this.CHANCE_OF_MODIFIER_PER_BIOME
    if (biome_name === "coalmine") {
      chance_of_modifier = this.CHANCE_OF_MODIFIER_COALMINE
    } else if (biome_name === "excavationsite") {
      chance_of_modifier = this.CHANCE_OF_MODIFIER_EXCAVATIONSITE
    }

    return this.randoms.random_next(ctx.rnd, 0.0, 1.0) <= chance_of_modifier;
  }

  provide() {
    let biome_modifiers = this.modifiers;

    let result: { [biome: string]: ReturnType<BiomeModifierInfoProvider['get_modifier']> } = {};

    let biomes = this.biomes;

    let biome_modifier_fog_of_war_clear_at_player = biome_modifiers["FOG_OF_WAR_CLEAR_AT_PLAYER"];
    let biome_modifier_cosmetic_freeze = biome_modifiers["FREEZING_COSMETIC"];

    const set_modifier_if_has_none = (biome_name: string, modifier_id: string) => {
      if (!result[biome_name]) {
        result[biome_name] = this.get_modifier(modifier_id);
      }
    };

    let rnd = this.randoms.random_create(347893, 90734);
    let ctx: any = {};
    ctx.rnd = rnd;
    ctx.deaths = 1000; //Number(StatsGlobalGetValue( "death_count" ));
    ctx.should_be_fully_deterministic = false; //GameIsModeFullyDeterministic();

    for (let i = 0; i < biomes.length; i++) {
      let biome_names = biomes[i];
      let modifier;
      if (this.has_modifiers(biome_names[0], ctx)) {
        modifier = this.randoms.pick_random_from_table_weighted(rnd, Object.values(biome_modifiers));
      }

      for (let j = 0; j < biome_names.length; j++) {
        let biome_name = biome_names[j];
        if (this.biome_modifier_applies_to_biome(modifier, biome_name)) {
          result[biome_name] = modifier;
        }
      }
    }

    // DEBUG - apply modifier to all biomes
    /*
    for (let i = 0; i < biomes.length; i++) {
      let biome_names = biomes[i];
      for (let j = 0; j < biome_names.length; j++) {
        //let biome_name = biome_names[j];
        //result[biome_name] = get_modifier( "GAS_FLOODED" );
      }
    }
    */

    if (this.randoms.random_next(rnd, 0.0, 1.0) < this.CHANCE_OF_MOIST_FUNGICAVE) {
      set_modifier_if_has_none("fungicave", "MOIST");
    }

    // force custom fog of war in these biomes
    result["wandcave"] = biome_modifier_fog_of_war_clear_at_player;
    result["wizardcave"] = biome_modifier_fog_of_war_clear_at_player;
    result["alchemist_secret"] = biome_modifier_fog_of_war_clear_at_player;
    //apply_modifier_if_has_none( "snowcave", "FREEZING" );

    // side biomes
    set_modifier_if_has_none("mountain_top", "FREEZING"); // NOTE: Freezing tends to occasionally bug out physics bodies, only put it in overworld biomes
    set_modifier_if_has_none("mountain_floating_island", "FREEZING");
    set_modifier_if_has_none("winter", "FREEZING");
    result["winter_caves"] = biome_modifier_cosmetic_freeze;
    //apply_modifier_if_has_none( "bridge", "FREEZING" )
    //apply_modifier_if_has_none( "vault_frozen", "FREEZING" )

    set_modifier_if_has_none("lavalake", "HOT");
    set_modifier_if_has_none("desert", "HOT");
    set_modifier_if_has_none("pyramid_entrance", "HOT");
    set_modifier_if_has_none("pyramid_left", "HOT");
    set_modifier_if_has_none("pyramid_top", "HOT");
    set_modifier_if_has_none("pyramid_right", "HOT");

    set_modifier_if_has_none("watercave", "MOIST");

    if (this.randoms.random_next(rnd, 0.0, 1.0) < this.CHANCE_OF_MOIST_LAKE) {
      set_modifier_if_has_none("lake_statue", "MOIST");
    }

    return result;
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    for (const biome in rule.val) {
      if (!info[biome]) {
        return false;
      }
      if (!rule.val[biome].includes(info[biome].id)) {
        return false;
      }
    }
    return true;
  }
}

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

export class MaterialInfoProvider extends InfoProvider {
  materials = materialsData // await this.loadAsync("data/materials.json");
  allMaterials = Array.prototype.concat.apply(this, this.materials.map(e => e.normal.concat(e.statics)));

  provide(materialName: string) {
    if (materialName.charAt(0) === '(') {  // specials, like (flask) for fungal shift
      return {
        translated_name: materialName
      }
    }
    let found = this.allMaterials.find(e => e.name === materialName);
    if (found) return found;
    console.warn("Could not find material: " + materialName);
    return {
      translated_name: materialName
    };
  }

  translate(materialName: any) {
    return this.provide(materialName).translated_name;
  }

  test(rule: IRule): boolean {
    return true;
  }
}

export class BiomeInfoProvider extends InfoProvider {
  biomes = biomesData;
  provide(biomeId: string) {
    let found = this.biomes.find(e => e.id === biomeId);
    if (found) return found;
    console.warn("Could not find biome: " + biomeId);
    return {
      translated_name: biomeId
    };
  }

  isPrimary(biomeId: string) {
    let found = this.biomes.find(e => e.id === biomeId);
    return found && found.translated_name !== "";
  }

  translate(biomeName: any) {
    return this.provide(biomeName).translated_name;
  }

  test(rule: IRule): boolean {
    return true;
  }
}

interface IProviders {
  shop: ShopInfoProvider;
  alchemy: AlchemyInfoProvider;
  rain: RainInfoProvider;
  startingFlask: StartingFlaskInfoProvider;
  startingSpell: StartingSpellInfoProvider;
  startingBombSpell: StartingBombSpellInfoProvider;
  perk: PerkInfoProvider;
  fungalShift: FungalInfoProvider;
  biomeModifier: BiomeModifierInfoProvider;
  biome: BiomeInfoProvider;
  material: MaterialInfoProvider;
  [key: string]: InfoProvider;
}

export class GameInfoProvider extends EventTarget {
  randoms!: IRandom;
  ready = false;

  providers!: IProviders;

  config: IProviderConfig;

  constructor(initialConfig: Partial<IProviderConfig>) {
    super()
    this.config = Object.assign({}, {
      seed: 1,
      perkRerolls: [],
      pickedPerks: [],
      perkWorldOffset: 0,
      fungalHoldingFlasks: [],
    }, initialConfig);
    loadRandom().then((randoms) => {
      this.randoms = randoms;
      this.providers = this.buildInfoProviders();
      this.ready = true;
    });
  }

  // This should be a reducer;
  updateConfig(config: Partial<IProviderConfig>) {
    Object.assign(this.config, config);
    this.dispatchEvent(new CustomEvent('update', { detail: {} }));
  }

  buildInfoProviders(): IProviders {
    return {
      alchemy: new AlchemyInfoProvider(this.randoms),
      rain: new RainInfoProvider(this.randoms),
      startingFlask: new StartingFlaskInfoProvider(this.randoms),
      startingSpell: new StartingSpellInfoProvider(this.randoms),
      startingBombSpell: new StartingBombSpellInfoProvider(this.randoms),
      shop: new ShopInfoProvider(this.randoms),
      perk: new PerkInfoProvider(this.randoms),
      fungalShift: new FungalInfoProvider(this.randoms),
      biomeModifier: new BiomeModifierInfoProvider(this.randoms),
      spells: new SpellInfoProvider(this.randoms),
      biome: new BiomeInfoProvider(this.randoms),
      material: new MaterialInfoProvider(this.randoms),
    }
  }

  provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    this.randoms!.SetWorldSeed(Number(this.config.seed));
    return {
      alchemy: this.providers.alchemy.provide(),
      rainType: this.providers.rain.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      startingBombSpell: this.providers.startingBombSpell.provide(),
      shop: this.providers.shop.provide(this.config.pickedPerks, this.config.perkWorldOffset),
      perks: this.providers.perk.provide(this.config.pickedPerks, undefined, true, this.config.perkWorldOffset, this.config.perkRerolls),
      perkDeck: this.providers.perk.getPerkDeck(true),
      fungalShifts: this.providers.fungalShift.provide(undefined),
      biomeModifiers: this.providers.biomeModifier.provide()
    };
  }
}

interface IProviderConfig {
  seed: number;
  perkRerolls: number[][];
  pickedPerks: any[];
  perkWorldOffset: number;
}

export default GameInfoProvider;
