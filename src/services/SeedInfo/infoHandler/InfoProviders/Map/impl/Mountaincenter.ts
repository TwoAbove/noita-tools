// data/scripts/biomes/mountain/mountain_center.lua
import Base from "../Base";
class Mountaincenter extends Base {
  chestLevel = 7;
  g_small_enemies = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/zombie.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/bat.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/longleg.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/bigbat.xml",
    },
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/lantern_small.xml",
    },
  ];
  g_props = [
    { prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.25,
      min_count: 1,
      max_count: 1,
      offset_y: -3,
      entity: "data/entities/props/physics/minecart.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
  ];
  g_save = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/buildings/save_point.xml",
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_chain_torch.xml",
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
      entity: "data/entities/props/candle_1.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/candle_2.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/candle_3.xml",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_big_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_items(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_ghostlamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_candles(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potion_altar(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potions(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_apparition(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_heart(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wands(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_end_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_orb(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_perk(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_all_perks(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_ignite(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity_source(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_moon(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_collapse(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Mountaincenter;
