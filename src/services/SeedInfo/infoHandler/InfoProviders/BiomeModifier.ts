/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class BiomeModifierInfoProvider extends InfoProvider {
  biomeModifierPromise = import("../../data/obj/biome_modifiers.json")
    .catch(e => {
      console.error(e);
      return {};
    })
    .then((biomeModifiersData: any) => {
      this.modifiers = biomeModifiersData.default;

      this.availableBiomeModifiers = Object.values<any>(this.modifiers).reduce(
        (c, bm) => {
          for (const biome in c) {
            if (bm.does_not_apply_to_biome && bm.does_not_apply_to_biome.includes(biome)) {
              continue;
            }
            if (bm.apply_only_to_biome && !bm.apply_only_to_biome.includes(biome)) {
              continue;
            }
            c[biome].push(bm.id);
          }
          return c;
        },
        this.biomes.flat(2).reduce<{ [modifier: string]: string[] }>((c, b) => {
          c[b] = [];
          return c;
        }, {}),
      );
    });

  async ready(): Promise<void> {
    await this.biomeModifierPromise;
  }

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

  modifiers;
  availableBiomeModifiers;

  CHANCE_OF_MODIFIER_PER_BIOME = 0.1;
  CHANCE_OF_MODIFIER_COALMINE = 0.2;
  CHANCE_OF_MODIFIER_EXCAVATIONSITE = 0.15;
  CHANCE_OF_MOIST_FUNGICAVE = 0.5;
  CHANCE_OF_MOIST_LAKE = 0.75;

  HasFlagPersistent(flag: any) {
    // assume everything is unlocked
    return true;
  }

  get_modifier(modifier_id: string) {
    return this.modifiers[modifier_id];
  }

  biome_modifier_applies_to_biome(
    modifier: {
      requires_flag: any;
      does_not_apply_to_biome: string | any[];
      apply_only_to_biome: string | any[];
    },
    biome_name: string,
  ) {
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
      ok = false;
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
      return false;
    }

    let chance_of_modifier = this.CHANCE_OF_MODIFIER_PER_BIOME;
    if (biome_name === "coalmine") {
      chance_of_modifier = this.CHANCE_OF_MODIFIER_COALMINE;
    } else if (biome_name === "excavationsite") {
      chance_of_modifier = this.CHANCE_OF_MODIFIER_EXCAVATIONSITE;
    }

    return this.randoms.random_next(ctx.rnd, 0.0, 1.0) <= chance_of_modifier;
  }

  provide() {
    let biome_modifiers = this.modifiers;

    let result: {
      [biome: string]: ReturnType<BiomeModifierInfoProvider["get_modifier"]>;
    } = {};

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

  get(modifier) {
    return this.modifiers[modifier];
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

export default BiomeModifierInfoProvider;
