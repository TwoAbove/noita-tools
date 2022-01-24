/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import perksData from '../../data/obj/perks.json';
import templeData from '../../data/temple-locations.json';
import { includesAll, Objectify } from '../../../helpers';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';
import { Global } from './Global';

export class PerkInfoProvider extends InfoProvider {
  perks = perksData as Objectify<typeof perksData>;
  perksArr = Object.values(this.perks);
  temples = templeData;

  _G = new Global();

  getPerk(id: string) {
    return this.perks[id];
  }

  _getNextReroll(perkDeck: any[]) {
    let next_perk_index = this._G.GetValue("TEMPLE_REROLL_PERK_INDEX", perkDeck.length - 1);
    let perk_id = perkDeck[next_perk_index];
    while (!perk_id) {
      // if we over flow
      perkDeck[next_perk_index] = "LEGGY_FEET"
      next_perk_index--;
      if (next_perk_index < 0) {
        next_perk_index = perkDeck.length - 1;
      }
      perk_id = perkDeck[next_perk_index];
    }

    next_perk_index--;
    if (next_perk_index < 0) {
      next_perk_index = perkDeck.length - 1;
    }
    this._G.SetValue("TEMPLE_REROLL_PERK_INDEX", next_perk_index);
    this._G.GameAddFlagRun(this.get_perk_flag_name(perk_id));
    return perk_id;
  }

  _getReroll(perkDeck: any[], add = 0, amountOfPerks: number) {
    const perk_count = amountOfPerks;
    const result: any[] = [];
    for (let i = 0; i < perk_count + add; i++) {
      const perk_id = this._getNextReroll(perkDeck);
      result.push(perk_id);
    }

    return result;
  }

  _getNextPerk(perks: any[]) {
    let next_perk_index = this._G.GetValue("TEMPLE_NEXT_PERK_INDEX", 0);
    const perk_id = perks[next_perk_index];
    next_perk_index++;
    if (next_perk_index >= perks.length) {
      next_perk_index = 0;
    }
    this._G.SetValue("TEMPLE_NEXT_PERK_INDEX", next_perk_index)
    this._G.GameAddFlagRun(this.get_perk_flag_name(perk_id))
    return perk_id;
  }

  get_perk_flag_name(perk_id: string) {
    return "PERK_" + perk_id
  }

  get_perk_picked_flag_name(perk_id: string) {
    return "PERK_PICKED_" + perk_id
  }

  perk_spawn_many(perks: any[], add = 0) {
    const result: any[] = [];
    const perk_count = this._G.GetValue("TEMPLE_PERK_COUNT", 3) + add;

    for (let i = 0; i < perk_count; i++) {
      const nextPerk = this._getNextPerk(perks);
      result.push(nextPerk)
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
      const pickup_count = this._G.GetValue(flag_name + "_PICKUP_COUNT", 0);

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

  provide(perkPicks?: Map<number, string[][]>, maxLevels?: number, returnPerkObjects?: boolean, worldOffset?: number, rerolls?: Map<number, number[]>) {
    perkPicks = perkPicks || new Map();
    worldOffset = worldOffset || 0;
    if (!maxLevels || maxLevels === -1) maxLevels = Infinity;

    this._G = new Global();
    const perkDeck = this.getPerkDeck();
    type IPerk = typeof this.perks[string];
    const result: IPerk[][] = [];
    let world = 0;
    this._G.SetValue("TEMPLE_PERK_COUNT", 3)
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
        let gambleSelected = false;
        const picksForWorld = perkPicks.get(world) || [];
        if (perkPicks.has(world) && picksForWorld[i]) {
          if (picksForWorld[i].includes('GAMBLE')) {
            gambleSelected = true;
          }
        }

        let res = this.perk_spawn_many(perkDeck, 0);
        const worldRerolls = rerolls?.get(world) || [];
        if (rerolls && rerolls.has(world) && worldRerolls?.[i] > 0) {
          for (let j = 0; j < worldRerolls[i] - 1; j++) {
            this._getReroll(perkDeck, 0, res.length);
          }
          let rerollRes = this._getReroll(perkDeck, 0, res.length);
          if (world === worldOffset) {
            if (gambleSelected) {
              rerollRes.push(this._getNextPerk(perkDeck));
              rerollRes.push(this._getNextPerk(perkDeck));
            }
            result.push(rerollRes);
          }
        } else {
          if (world === worldOffset) {
            if (gambleSelected) {
              res.push(this._getNextPerk(perkDeck));
              res.push(this._getNextPerk(perkDeck));
            }
            result.push(res);
          }
        }
        const picked_perks = perkPicks.get(world)?.[i];
        if (picked_perks) {
          for (const picked_perk of picked_perks) {
            let flag_name = this.get_perk_picked_flag_name(picked_perk);
            this._G.GameAddFlagRun(flag_name);
            this._G.SetValue(flag_name + "_PICKUP_COUNT", this._G.GetValue(flag_name + "_PICKUP_COUNT", 0) + 1);
            if (picked_perk === "EXTRA_PERK") {
              this._G.SetValue("TEMPLE_PERK_COUNT", this._G.GetValue("TEMPLE_PERK_COUNT") + 1)
            }
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
