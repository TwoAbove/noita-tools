// data/scripts/biomes/secret_entrance.lua
import Base from "../Base";
class Secretentrance extends Base {
  chestLevel = 3;
  g_small_enemies = [
    { prob: 0.1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drone_physics.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lasershooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/roboguard.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/assassin.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.3,
      min_count: 3,
      max_count: 5,
      entity: "data/entities/animals/blob.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/bigzombie.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 2,
      entities: [
        "data/entities/animals/sniper.xml",
        "data/entities/animals/flamer.xml",
      ],
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
  init(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Secretentrance;
