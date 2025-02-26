/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import templeData from "../../../data/temple-locations.json";
import { includesAll, includesSome, Objectify } from "../../../../helpers";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";
import { Global } from "../Global";
import cloneDeep from "lodash/cloneDeep.js";

export enum IPerkChangeStateType {
  shift,
  set,
  genRow,
  select,
  reroll,
}
export interface IShiftAction {
  type: IPerkChangeStateType.shift;
  data: number; // WorldOffset
}
export interface ISetAction {
  type: IPerkChangeStateType.set;
  data: number; // WorldOffset
}
export interface IGenRowAction {
  type: IPerkChangeStateType.genRow;
  data: number; // Row number
}
export interface ISelectAction {
  type: IPerkChangeStateType.select;
  data: {
    row: number;
    pos: number;
  };
}
export interface IRerollAction {
  type: IPerkChangeStateType.reroll;
  data: number; // Row
}

export type IPerkChangeAction = IShiftAction | ISetAction | IGenRowAction | ISelectAction | IRerollAction;

type IPerkType = Objectify<typeof import("../../../data/obj/perks.json")>;

// The perk deck is generated in perk_get_spawn_order from the world seed, so we can cache the initial
// generation of the perk deck and reuse it for all perk info providers
let lastMemoizedPerkDeckSeed: number | null = null;
let cachedPerkDeck: unknown = [];
const memoizedPerkDeck = <T>(seed: number, fn: () => T): T => {
  if (seed !== lastMemoizedPerkDeckSeed) {
    lastMemoizedPerkDeckSeed = seed;
    cachedPerkDeck = fn();
  }
  return structuredClone(cachedPerkDeck) as T;
};

export type IPerk = IPerkType[string];
export class PerkInfoProvider extends InfoProvider {
  perksDataPromise = import("../../../data/obj/perks.json")
    .catch(e => {
      console.error(e);
      return {};
    })
    .then((perksData: any) => {
      this.perks = perksData.default;
      this.perksArr = Object.values(this.perks) as any[];
    });

  perks!: IPerkType;
  perksArr!: any[];
  temples = templeData;

  async ready(): Promise<void> {
    await this.perksDataPromise;
  }

  _G = new Global();

  getPerk(id: string) {
    return this.perks[id];
  }

  _getNextReroll(perkDeck: string[]): string {
    let next_perk_index: number = this._G.GetValue("TEMPLE_REROLL_PERK_INDEX", perkDeck.length - 1);
    let perk_id = perkDeck[next_perk_index];
    while (!perk_id) {
      // if we over flow
      perkDeck[next_perk_index] = "LEGGY_FEET";
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

  _getReroll(amountOfPerks: number) {
    const perks = this.getPerkDeck();
    const result: string[] = [];
    for (let i = 0; i < amountOfPerks; i++) {
      const perk_id = this._getNextReroll(perks);
      result.push(perk_id);
    }

    return result;
  }

  _getNextPerk(perkDeck: any[]) {
    let next_perk_index = this._G.GetValue("TEMPLE_NEXT_PERK_INDEX", 0);
    let perk_id = perkDeck[next_perk_index];
    while (!perk_id) {
      // if we over flow
      perkDeck[next_perk_index] = "LEGGY_FEET";
      next_perk_index++;
      if (next_perk_index >= perkDeck.length) {
        next_perk_index = 0;
      }
      perk_id = perkDeck[next_perk_index];
    }

    next_perk_index++;
    if (next_perk_index >= perkDeck.length) {
      next_perk_index = 0;
    }
    this._G.SetValue("TEMPLE_NEXT_PERK_INDEX", next_perk_index);
    this._G.GameAddFlagRun(this.get_perk_flag_name(perk_id));
    return perk_id;
  }

  get_perk_flag_name(perk_id: string) {
    return "PERK_" + perk_id;
  }

  get_perk_picked_flag_name(perk_id: string) {
    return "PERK_PICKED_" + perk_id;
  }

  perk_spawn_many(extra = 0) {
    const perks = this.getPerkDeck();

    const result: any[] = [];
    const perk_count = this._G.GetValue("TEMPLE_PERK_COUNT", 3) + extra;

    for (let i = 0; i < perk_count; i++) {
      const nextPerk = this._getNextPerk(perks);
      result.push(nextPerk);
    }
    return result;
  }

  table_contains = (table: { [s: string]: unknown } | ArrayLike<unknown>, element: unknown) => {
    return Object.values(table).indexOf(element) !== -1;
  };

  shuffle_table = (t: any[]) => {
    //assert( t, "shuffle_table() expected a table, got nil" )
    const iterations = t.length - 1;

    for (let i = iterations; i >= 1; i--) {
      const j = this.randoms.Random(0, i);
      const tmp = t[i];
      t[i] = t[j];
      t[j] = tmp;
    }
  };
  // this generates global perk spawn order for current world seed
  perk_get_spawn_order = (ignore_these_?: any) => {
    const worldSeed = this.randoms.GetWorldSeed();
    const [perk_deck, stackable_count] = memoizedPerkDeck(worldSeed, () => {
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
      const stackable_count = {}; // -1 = NON_STACKABLE otherwise the result is how many times can be stacked

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

          stackable_distances[perk_name] =
            perk_data.stackable_how_often_reappears || MIN_DISTANCE_BETWEEN_DUPLICATE_PERKS;

          how_many_times = this.randoms.Random(1, max_perks);
        }

        for (let j = 1; j <= how_many_times; j++) {
          perk_deck.push(perk_name);
        }
      }

      // 2) Shuffle the Deck
      this.shuffle_table(perk_deck);

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

          if (remove_me) {
            perk_deck.splice(i, 1);
          }
        }
      }

      return [perk_deck, stackable_count];
    });

    // NON DETERMINISTIC THINGS ARE ALLOWED TO HAPPEN
    // 4) Go through the perk list and "" the perks we've picked up
    // remove non-stackable perks already collected from the list
    for (let i = 0; i < perk_deck.length; i++) {
      const perk_name = perk_deck[i];
      const flag_name = this.get_perk_picked_flag_name(perk_name);
      const pickup_count = this._G.GetValue(flag_name + "_PICKUP_COUNT", 0);

      // GameHasFlagRun( flag_name ) - this is if its ever been spawned
      // has been picked up
      if (pickup_count > 0) {
        const stack_count = stackable_count[perk_name] || -1;
        // print( perk_name .. ": " .. tostring( stack_count ) )
        if (stack_count === -1 || pickup_count >= stack_count) {
          perk_deck[i] = "";
        }
      }
    }

    // DEBUG
    if (false) {
      for (let i = 0; i < perk_deck.length; i++) {
        let perk = perk_deck[i];
        console.log(String(i) + ": " + perk);
      }
    }

    return perk_deck;
  };

  getPerkDeck(returnPerkObjects?: boolean) {
    const result = this.perk_get_spawn_order();
    if (returnPerkObjects) {
      for (let i = 0; i < result.length; i++) {
        result[i] = this.perks[result[i]];
      }
    }
    return result;
  }

  flag_pickup(perk) {
    let flag_name = this.get_perk_picked_flag_name(perk);
    this._G.GameAddFlagRun(flag_name);
    this._G.SetValue(flag_name + "_PICKUP_COUNT", this._G.GetValue(flag_name + "_PICKUP_COUNT", 0) + 1);
  }

  handlePerkPickup(perk: string) {
    this.flag_pickup(perk);

    if (perk === "EXTRA_PERK") {
      this._G.SetValue("TEMPLE_PERK_COUNT", this._G.GetValue("TEMPLE_PERK_COUNT") + 1);
    }

    // Mark as picked in the perk deck
    const perkDeck = this.perk_get_spawn_order();
    for (let i = 0; i < perkDeck.length; i++) {
      if (perkDeck[i] === perk) {
        perkDeck[i] = "";
      }
    }

    if ("remove_other_perks" in this.perks[perk]) {
      for (const p of this.perks[perk].remove_other_perks!) {
        const flag_name = this.get_perk_picked_flag_name(p);
        const pickup_count = this._G.GetValue(flag_name + "_PICKUP_COUNT", 0);
        this._G.SetValue(flag_name + "_PICKUP_COUNT", pickup_count + 1);
      }
    }
  }

  generateRow(count = 3) {
    const perks = this.getPerkDeck();
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      const nextPerk = this._getNextPerk(perks);
      result.push(nextPerk);
    }
    return result;
  }

  rerollRow(row: string[], times = 1) {
    let currentRow = [...row];

    for (let i = 0; i < times - 1; i++) {
      this._getReroll(currentRow.length);
    }

    if (times > 0) {
      currentRow = this._getReroll(currentRow.length);
    }

    return currentRow;
  }

  provide(
    _perkPicks?: Map<number, string[][]>,
    maxLevels?: number,
    returnPerkObjects?: boolean,
    worldOffset?: number,
    rerolls?: Map<number, number[]>,
  ): IPerk[][] {
    const perkPicks = cloneDeep(_perkPicks) || new Map();
    worldOffset = worldOffset || 0;
    if (!maxLevels || maxLevels === -1) maxLevels = Infinity;

    this._G = new Global();
    this._G.SetValue("TEMPLE_PERK_COUNT", 3);
    const result: string[][] = [];
    let world = 0;

    while (true) {
      let i = 0;
      for (const loc of this.temples) {
        if (i >= maxLevels) break;
        if (worldOffset !== 0 && world !== 0 && i + 1 === this.temples.length) break;

        const picksForWorld = perkPicks.get(world) || [];
        const picks = picksForWorld[i] || [];

        // Generate base row
        const perkCount = this._G.GetValue("TEMPLE_PERK_COUNT", 3);
        let row = this.generateRow(perkCount);

        // Handle rerolls if needed
        const worldRerolls = rerolls?.get(world) || [];
        if (rerolls?.has(world) && worldRerolls[i] > 0) {
          row = this.rerollRow(row, worldRerolls[i]);
        }

        // Handle any picked perks
        if (picks.length) {
          for (const picked_perk of picks) {
            this.handlePerkPickup(picked_perk);
          }
        }

        // Handle gamble after everything else
        const gambleSelected = picks.includes("GAMBLE");
        if (gambleSelected) {
          for (let j = 0; j < 2; j++) {
            const perkDeck = this.getPerkDeck();
            let p1 = this._getNextPerk(perkDeck);
            if (p1 === "GAMBLE") {
              p1 = this._getNextPerk(perkDeck);
            }
            this.handlePerkPickup(p1);
            row.push(p1);
          }
        }

        if (world === worldOffset) {
          result.push(row);
        }

        picksForWorld[i] = picks;
        perkPicks.set(world, picksForWorld);

        i++;
      }

      if (world === worldOffset) break;
      if (worldOffset < 0) world--;
      else world++;
    }

    return returnPerkObjects ? this.hydrate(result) : (result as any);
  }

  hydrate(perks: string[][]): IPerk[][] {
    const hydrated: IPerk[][] = [];
    for (let i = 0; i < perks.length; i++) {
      hydrated[i] = perks[i]?.map((e: any) => this.perks[e]);
    }
    return hydrated;
  }

  provideStateless(state: IPerkChangeAction[], preview?: boolean) {
    let lotteries = 0;
    const perkState: Map<number, string[][]> = new Map();
    const pickedState: Map<number, string[][]> = new Map();
    const rerollState: Map<number, number[]> = new Map();

    this._G = new Global();
    this._G.SetValue("TEMPLE_PERK_COUNT", 3);

    let worldOffset = 0;

    for (const s of state) {
      const perks = perkState.get(worldOffset) || [];
      const selected = pickedState.get(worldOffset) || [];
      const rerolls = rerollState.get(worldOffset) || [];
      const ws = +worldOffset;
      switch (s.type) {
        case IPerkChangeStateType.shift: {
          worldOffset += s.data;
          break;
        }
        case IPerkChangeStateType.set: {
          worldOffset = s.data;
          break;
        }
        case IPerkChangeStateType.genRow: {
          let res = this.perk_spawn_many();
          perks[s.data] = res;
          break;
        }
        case IPerkChangeStateType.select: {
          const { row, pos } = s.data;
          if (!selected[row]) {
            selected[row] = [];
          }
          if (!perks[row][pos]) {
            throw new Error(`No such position at row ${row}`);
          }
          if (selected[row][pos]) {
            break;
          }

          const perk = perks[row][pos];
          selected[row][pos] = perk;

          this.handlePerkPickup(perk);

          if (perk === "GAMBLE") {
            for (let i = 0; i < 2; i++) {
              const perkDeck = this.getPerkDeck();
              let p1 = this._getNextPerk(perkDeck);
              if (p1 === "GAMBLE") {
                p1 = this._getNextPerk(perkDeck);
              }
              const l = perks[row].length;
              perks[row].push(p1);
              selected[row][l] = p1;
              if (p1 === "EXTRA_PERK") {
                this._G.SetValue("TEMPLE_PERK_COUNT", this._G.GetValue("TEMPLE_PERK_COUNT") + 1);
              }
              this.handlePerkPickup(p1);
            }
          }
          break;
        }
        case IPerkChangeStateType.reroll: {
          const row = s.data;
          if (!selected[row]) {
            selected[row] = [];
          }
          if (!rerolls[row]) {
            rerolls[row] = 0;
          }
          rerolls[row] += 1;
          const perkDeck = this.getPerkDeck();
          for (let i = 0; i < perks[row].length; i++) {
            if (!selected[row][i]) {
              perks[row][i] = this._getNextReroll(perkDeck);
            }
          }
          break;
        }
      }
      perkState.set(ws, perks);
      pickedState.set(ws, selected);
      rerollState.set(ws, rerolls);
    }

    if (preview) {
      // Preview the rest of the rows if simple perk table is used
      const ps = perkState.get(worldOffset) || [];
      while (ps.length !== 7 - Number(!!worldOffset)) {
        let res = this.perk_spawn_many();
        ps.push(res);
      }
      perkState.set(worldOffset, ps);
    }

    return {
      worldOffset,
      lotteries,
      pickedPerks: pickedState.get(worldOffset) || [],
      pickedState,
      perks: perkState.get(worldOffset) || [],
      perkRerolls: rerollState.get(worldOffset) || [],
    };
  }

  test(rule: IRule<IPerkRule>): boolean {
    if (rule.val?.deck[0]?.length) {
      const deck = this.getPerkDeck();
      if (!includesAll(deck, rule.val.deck[0])) {
        return false;
      }
    }

    const info = this.provide() as any;

    for (let i = 0; i < info.length; i++) {
      if (rule.val?.some?.[i]?.length) {
        const r = rule.val.some[i];
        if (!includesSome(info[i], r)) {
          return false;
        }
      }
      if (rule.val?.all?.[i]?.length) {
        const r = rule.val.all[i];
        if (!includesAll(info[i], r)) {
          return false;
        }
      }
    }
    return true;
  }
}

export interface IPerkRule {
  some: string[][];
  all: string[][];
  deck: string[][];
}

export default PerkInfoProvider;
