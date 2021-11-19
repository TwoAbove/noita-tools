/* eslint-disable @typescript-eslint/no-unused-vars */
import loadRandom, { IRandom } from './random';

import rainData from './data/rain.json';
import startingMaterialsData from './data/starting-flask-materials.json';
import perksData from './data/perks_new.json';
import templeData from './data/temple-locations.json';
import fungalMaterialsData from './data/fungal-materials.json';
import biomeModifiersData from './data/biome_modifiers.json';
import biomeNamesData from './data/biome_names.json';
import materialsData from './data/materials.json';
import biomesData from './data/biome_names.json';

const nthify = (num) => {
  let n = num % 10;
  if (num < 10 || (num > 20 && num < 30)) {
    if (n === 1) return num + "st";
    if (n === 2) return num + "nd";
    if (n === 3) return num + "rd";
  }
  return num + "th";
}

export abstract class InfoProvider {
  randoms: IRandom;

  constructor(randoms: IRandom) {
    this.randoms = randoms;
  }
  abstract provide(...args: any[]): any;
}

export class AlchemyInfoProvider extends InfoProvider {
  provide(seed: number) {
    const res = this.randoms.PickForSeed(seed);
    const [LC, AP] = res.split(';');
    return {
      LC: LC.split(':')[1].split(','),
      AP: AP.split(':')[1].split(',')
    };
  }
}

export class RainInfoProvider extends InfoProvider {
  rainTypes = rainData;

  provide(): [isRaining: boolean, material: string, probability: number] {
    let snows = false; // TODO..........
    let rainfall_chance = 1 / 15;
    let rnd = { x: 7893434, y: 3458934 };
    let rains =
      !snows && this.randoms.random_next(rnd, 0.0, 1.0) <= rainfall_chance; //-- rain is based on world seed
    if (!rains) return [rains, '', 1 - rainfall_chance];
    let pickedRain = this.randoms.pick_random_from_table_backwards(
      this.rainTypes,
      rnd
    );
    return [
      rains,
      pickedRain.rain_material,
      rainfall_chance * pickedRain.chance
    ];
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
  perks = perksData;
  temples = templeData;

  _G = new Global();

  _getReroll(perkDeck: any[], amountOfPerks: number) {
    let perks = perkDeck;
    let perk_count = amountOfPerks;
    let perk_reroll_perks = () => {
      let result: any[] = [];

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
    return perk_reroll_perks();
  }
  get_perk_flag_name(perk_id: string) {
    return "PERK_" + perk_id
  }
  get_perk_picked_flag_name(perk_id: string) {
    return "PERK_PICKED_" + perk_id
  }
  perk_spawn_many(perks: string | any[], x: number, y: number) {
    let result: any[] = [];
    let perk_count = parseFloat(this._G.GetValue("TEMPLE_PERK_COUNT", "3"))

    let count = perk_count;

    for (let i = 0; i < count; i++) {
      let next_perk_index = parseFloat(this._G.GetValue("TEMPLE_NEXT_PERK_INDEX", "0"));
      let perk_id = perks[next_perk_index];

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

  getPerkDeck(returnPerkObjects?: boolean) {
    let perk_list = this.perks;

    let shuffle_table = (t: any[]) => {
      //assert( t, "shuffle_table() expected a table, got nil" )
      let iterations = t.length - 1;
      let j: number;

      for (let i = iterations; i >= 1; i--) {
        //for i = iterations, 2, -1 do
        j = this.randoms.Random(0, i);
        //console.log("j", j);
        let tmp = t[i];
        t[i] = t[j];
        t[j] = tmp;
        //[t[i], t[j]] = [t[j], t[i]];
      }
    }

    const table_contains = (table: { [s: string]: unknown; } | ArrayLike<unknown>, element: unknown) => {
      return Object.values(table).indexOf(element) !== -1
    };

    // this generates global perk spawn order for current world seed
    const perk_get_spawn_order = (ignore_these_?: any) => {
      // this function should return the same list in the same order no matter when or where during a run it is called.
      // the expection is that some of the elements in the list can be set to "" to indicate that they're used

      // 1) Create a Deck from all the perks, add multiple of stackable
      // 2) Shuffle the Deck
      // 3) Remove duplicate perks that are too close to each other

      // NON DETERMISTIC THINGS ARE ALLOWED TO HAPPEN
      // 4) Go through the perk list and "" the perks we've picked up

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
      for (let i = 0; i < perk_list.length; i++) {
        const perk_data = perk_list[i];
        if ((table_contains(ignore_these, perk_data.id) === false) && (!perk_data.not_in_default_perk_pool)) {
          const perk_name = perk_data.id;
          let how_many_times = 1;
          stackable_distances[perk_name] = -1;
          stackable_count[perk_name] = -1;

          if (perk_data.stackable === true) {
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

            if (perk_data.stackable_is_rare === true) {
              max_perks = 1;
            }

            stackable_distances[perk_name] = perk_data.stackable_how_often_reappears || MIN_DISTANCE_BETWEEN_DUPLICATE_PERKS;

            how_many_times = this.randoms.Random(1, max_perks);
          }

          for (let j = 1; j <= how_many_times; j++) {
            perk_deck.push(perk_name);
          }
        }
      }

      //console.log("STEP 1", perk_deck);

      // 2) Shuffle the Deck
      shuffle_table(perk_deck);

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

      // NON DETERMISTIC THINGS ARE ALLOWED TO HAPPEN
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
    let result = perk_get_spawn_order();
    if (returnPerkObjects) {
      for (let i = 0; i < result.length; i++) {
        result[i] = this.perks.find(f => f.id === result[i]);
      }
    }
    return result;
  }

  provide(perkPicks?: any, maxLevels?: number, returnPerkObjects?: boolean, worldOffset?: number, rerolls?: number[][]) {
    perkPicks = perkPicks || [];
    worldOffset = worldOffset || 0;
    if (!maxLevels || maxLevels === -1) maxLevels = Infinity;

    this._G = new Global();
    let perkDeck = this.getPerkDeck();
    type IPerk = typeof this.perks[number];
    let result: IPerk[][] = [];
    let i: number, world = 0;
    this._G.SetValue("TEMPLE_PERK_COUNT", "3")
    let temple_locations = this.temples;
    while (true) {
      i = 0;
      for (let loc of temple_locations) {
        if (i >= maxLevels) break;
        let offsetX = 0, offsetY = 0;
        if (worldOffset !== 0 && world !== 0) {
          offsetX += 35840 * worldOffset;
          if (i + 1 === temple_locations.length) break;
        }
        let res = this.perk_spawn_many(perkDeck, loc.x + offsetX, loc.y + offsetY);

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
        result[i] = result[i].map((e: any) => this.perks.find(f => f.id === e) as any) as IPerk[];
      }
    }
    return result;

  }
}

export class FungalInfoProvider extends InfoProvider {
  data = fungalMaterialsData;
  _G = new Global();

  fungal_shift(entity: null, x: null, y: null, debug_no_limits: boolean): { flaskTo:boolean, flaskFrom: boolean, from: string[], to: string } {
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
  modifiers = biomeModifiersData;
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
    return this.modifiers.find(e => e.id === modifier_id);
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



    let biome_modifier_fog_of_war_clear_at_player = biome_modifiers.find(e => e.id === "FOG_OF_WAR_CLEAR_AT_PLAYER");
    let biome_modifier_cosmetic_freeze = biome_modifiers.find(e => e.id === "FREEZING_COSMETIC");




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
        modifier = this.randoms.pick_random_from_table_weighted(rnd, biome_modifiers);
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
}

class BiomeInfoProvider extends InfoProvider {
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
}


export abstract class SeedRequirement {
  type: string;
  name: string;
  once: boolean;
  provider; // There should be a generic way to use a specific infoprovider for types
  providers: IProviders;
  or?;

  abstract displayName: string;

  constructor(type: string, name: string, once: boolean, provider, providers: IProviders) {
    this.type = type;
    this.name = name;
    this.once = once;
    this.provider = provider;
    this.providers = providers;
  }

  abstract test(...args): boolean;
  abstract textify(): string;
  abstract serialize(): string;

  // No static abstract :(
  // https://github.com/microsoft/TypeScript/issues/34516
  // Implement when it becomes available
  abstract deserialize(str: string): SeedRequirement | undefined;
}

interface IProviders {
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

// +
export class SeedRequirementStartingFlask extends SeedRequirement {
  type = "StartingFlask";
  displayName = "Starting Flask";
  material;

  constructor(providers: IProviders) {
    super("StartingFlask", "Starting Flask", true, providers.startingFlask, providers);
    this.material = this.provider.materials[0];
  }
  test(mat) {
    return mat === this.provider.provide();
  }
  textify() {
    return "Start with a " + this.providers.material.translate(this.material) + " flask"
  }
  serialize() {
    return "sf-m" + this.material;
  }
  deserialize(str) {
    if (!str.startsWith("sf")) return;
    let req = new SeedRequirementStartingFlask(this.providers);
    [req.material] = str.match(/^sf-m(.+?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementStartingSpell extends SeedRequirement {
  type = "StartingSpell";
  displayName = "Starting Spell"
  spell;

  constructor(providers: IProviders) {
    super("StartingSpell", "Starting Spell", true, providers.startingSpell, providers);
    if (this.spell) return;
    this.spell = this.provider.spells[0];
  }
  test(spell) {
    return spell === this.provider.provide();
  }
  textify() {
    return "Have " + this.spell + " as its starting spell"

  }
  serialize() {
    return "ss-s" + this.spell;
  }
  deserialize(str) {
    if (!str.startsWith("ss")) return;
    let req = new SeedRequirementStartingSpell(this.providers);
    [req.spell] = str.match(/^ss-s(.+?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementStartingBombSpell extends SeedRequirement {
  type = "StartingBombSpell";
  spell;
  displayName = "Starting Bomb Spell";

  constructor(providers: IProviders) {
    super("StartingBombSpell", "Starting Bomb Spell", true, providers.startingBombSpell, providers);
    if (this.spell) return;
    this.spell = this.provider.spells[0];
  }
  test(spell) {
    return spell === this.provider.provide();
  }
  textify() {
    return "Have " + this.spell + " as its starting bomb spell"

  }
  serialize() {
    return "sbw-s" + this.spell;

  }
  deserialize(str) {
    if (!str.startsWith("sbw")) return;
    let req = new SeedRequirementStartingBombSpell(this.providers);
    [req.spell] = str.match(/^sbw-s(.+?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementRain extends SeedRequirement {
  type = "Rain";
  displayName = "Rain";
  material = "";

  constructor(providers: IProviders) {
    super("Rain", "Rain", true, providers.rain, providers);
  }
  test(shouldRainMaterial) {
    let [rains, rainMaterial] = this.provider.provide();
    if (!rains) return !shouldRainMaterial;
    return rainMaterial === shouldRainMaterial;
  }
  textify() {
    if (this.material) {
      return "Have " + this.providers.material.translate(this.material) + " rain";
    }
    return "Have no rain"
  }
  serialize() {
    return "r-m" + this.material;
  }
  deserialize(str) {
    if (!str.startsWith("r")) return;
    let req = new SeedRequirementRain(this.providers);
    [req.material] = str.match(/^r-m(.*?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementPerk extends SeedRequirement {
  type = "Perk";
  level = 1;
  perk;
  displayName = "Perk";

  constructor(providers: IProviders) {
    super("Perk", "Perk", false, providers.perk, providers);
    if (this.perk) return;
    this.perk = this.provider.perks[0].id
  }
  test(level, perk) {
    let perks = this.provider.provide(null, level);
    if (level === -1) {
      for (let i = 0; i < perks.length; i++) {
        if (perks[i].indexOf(perk) !== -1) return true;
      }
      return false;
    }
    return perks[level - 1].indexOf(perk) !== -1;
  }
  textify() {
    let str = "Have the perk '" + this.provider.perks.find(e => e.id === this.perk).ui_name + "'";
    if (this.level !== -1) {
      str += " in the " + nthify(this.level) + " level";
    }
    return str;
  }
  serialize() {
    return "p-l" + this.level + "-p" + this.perk;
  }
  deserialize(str) {
    if (!str.startsWith("p")) return;
    let req = new SeedRequirementPerk(this.providers);
    [req.level, req.perk] = str.match(/^p-l(-?\d+)-p(.+?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementFungalShift extends SeedRequirement {
  type = "FungalShift";
  iterations = 1;
  fromMaterial = "";
  toMaterial = "";
  displayName = "Fungal Shift";

  constructor(providers: IProviders) {
    super("FungalShift", "Fungal Shift", false, providers.fungalShift, providers);
  }
  test() {
    let holdingFlask;
    if (this.fromMaterial === "(flask)" || this.toMaterial === "(flask)") { holdingFlask = true; }
    let shifts = this.provider.provide(this.iterations, holdingFlask);
    const checkShift = (shift) => {
      let fromMats = shift[0];
      let toMat = shift[1];
      if (this.fromMaterial) {
        if (fromMats.indexOf(this.fromMaterial) === -1) return false;
      }
      if (this.toMaterial) {
        if (toMat !== this.toMaterial) return false;
      }
      return true;
    }
    if (this.iterations === -1) {
      for (let shift of shifts) {
        if (!checkShift(shift)) continue;
        return true;
      }
      return false;
    }
    return checkShift(shifts[this.iterations - 1]);
  }
  textify() {
    if (this.iterations === -1) {
      return "Have any fungal shift turn " + this.providers.material.translate(this.fromMaterial || "(anything)") + " to " + this.providers.material.translate(this.toMaterial || "(anything)")
    } else {
      return "Have the " + nthify(this.iterations) + " fungal shift turn " + this.providers.material.translate(this.fromMaterial || "(anything)") + " to " + this.providers.material.translate(this.toMaterial || "(anything)")
    }
  }
  serialize() {
    return "fs-i" + this.iterations + "-f" + this.fromMaterial + "-t" + this.toMaterial;
  }
  deserialize(str) {
    if (!str.startsWith("fs")) return;
    let req = new SeedRequirementFungalShift(this.providers);
    [req.iterations, req.fromMaterial, req.toMaterial] = str.match(/^fs-i(-?\d+)-f(.*?)-t(.*?)$/).slice(1);
    return req;
  }
}

// +
export class SeedRequirementBiomeModifier extends SeedRequirement {
  type = "BiomeModifier";
  biome = "coalmine";
  modifier;
  displayName = "Biome Modifier";

  constructor(providers: IProviders) {
    super("BiomeModifier", "Biome Modifier", false, providers.biomeModifier, providers);
    if (this.modifier) return;
    this.modifier = this.provider.modifiers[0].id;
  }
  test(biome, modifier) {
    let biomeModifiers = this.provider.provide();
    return biomeModifiers[biome] && biomeModifiers[biome].id === modifier;
  }
  textify() {
    return "Have the biome modifier '" + this.modifier.replace(/_/g, " ").toLowerCase() + "' in " + this.providers.biome.translate(this.biome);
  }
  serialize() {
    return "bm-b" + this.biome + "-m" + this.modifier;
  }
  deserialize(str) {
    if (!str.startsWith("bm")) return;
    let req = new SeedRequirementBiomeModifier(this.providers);
    [req.biome, req.modifier] = str.match(/^bm-b(.+?)-m(.+?)$/).slice(1);
    return req;
  }
}

export class GameInfoProvider extends EventTarget {
  randoms!: IRandom;
  ready = false;

  providers!: IProviders;
  requirements?: SeedRequirement[];

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
      this.requirements = this.buildRequirements();
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
      perk: new PerkInfoProvider(this.randoms),
      fungalShift: new FungalInfoProvider(this.randoms),
      biomeModifier: new BiomeModifierInfoProvider(this.randoms),
      biome: new BiomeInfoProvider(this.randoms),
      material: new MaterialInfoProvider(this.randoms),
    }
  }

  buildRequirements(): SeedRequirement[] {
    return [
      new SeedRequirementStartingFlask(this.providers),
      new SeedRequirementStartingSpell(this.providers),
      new SeedRequirementStartingBombSpell(this.providers),
      new SeedRequirementRain(this.providers),
      new SeedRequirementPerk(this.providers),
      new SeedRequirementFungalShift(this.providers),
      new SeedRequirementBiomeModifier(this.providers)
    ]
  }

  parseSeedCriteria(str: string) {
    let result: SeedRequirement[] = [];
    let parts = str.split(",");
    for (let part of parts) {
      let or = false;
      if (part.endsWith(";")) {
        part = part.slice(0, -1);
        or = true;
      }
      for (let critertaType of this.requirements!) {
        const criteria = critertaType.deserialize(part);
        if (criteria) {
          criteria.or = or;
          result.push(criteria);
          break;
        }
      }
    }
    return result;
  }

  provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    this.randoms!.SetWorldSeed(Number(this.config.seed));
    return {
      alchemy: this.providers.alchemy.provide(this.config.seed),
      rainType: this.providers.rain.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      startingBombSpell: this.providers.startingBombSpell.provide(),
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
