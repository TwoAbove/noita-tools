// data/scripts/biomes/lake_deep.lua
import Base from "../Base";
class Lakedeep extends Base {
  chestLevel = 0;
  g_small_enemies = [
    { prob: 1.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 5,
      entity: "data/entities/animals/fish.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/fish_large.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/eel.xml",
    },
  ];
  g_items = [
    { prob: 1.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/grenadelauncher.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/machinegun.xml",
    },
    {
      prob: 0.001,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/opgun.xml",
    },
    {
      prob: 0.0001,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/lightninggun.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/rocketlauncher.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/shotgun.xml",
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_chain_torch_ghostly.xml",
    },
  ];
  g_stash = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/pickup/heart.xml",
    },
  ];
  g_candles = [
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_1.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_2.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_3.xml",
    },
  ];
  g_lamp = [
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_mining_lamp.xml",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_big_enemies(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_items(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props3(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_lamp(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  load_pixel_scene(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  load_pixel_scene2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy3(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_ghostlamp(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_candles(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_potion_altar(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_potions(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_apparition(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_heart(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wands(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_portal(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_end_portal(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_orb(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_perk(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_all_perks(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_ignite(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_electricity_source(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_electricity(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_moon(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_collapse(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  init(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
}
export default Lakedeep;
