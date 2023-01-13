// data/scripts/biomes/sandcave.lua
import Base from "../Base";
class Sandcave extends Base {
  chestLevel = 3;
  g_small_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: [
        "data/entities/animals/scavenger_grenade.xml",
        "data/entities/animals/scavenger_smg.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: [
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/scavenger_smg.xml",
        },
        {
          min_count: 0,
          max_count: 1,
          entity: "data/entities/animals/scavenger_heal.xml",
        },
      ],
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tank_rocket.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_clusterbomb.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_mine.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_poison.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_leader.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_invis.xml",
    },
  ];
  g_big_enemies = [
    { prob: 0.3, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/scavenger_leader.xml",
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/scavenger_smg.xml",
        },
        {
          min_count: 0,
          max_count: 1,
          entity: "data/entities/animals/scavenger_heal.xml",
        },
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_rocket.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/flamer.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/wizard_tele.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/wizard_dark.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/wizard_swapper.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/scavenger_clusterbomb.xml",
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/scavenger_smg.xml",
        },
        {
          min_count: 0,
          max_count: 1,
          entity: "data/entities/animals/scavenger_heal.xml",
        },
      ],
    },
  ];
  g_unique_enemy = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_rocket.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/tank.xml",
        "data/entities/animals/healerdrone_physics.xml",
      ],
    },
  ];
  g_unique_enemy2 = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/scavenger_grenade.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/scavenger_smg.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/sniper.xml",
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_04.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_02.xml",
    },
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_lantern_small.xml",
    },
  ];
  g_lamp2 = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_tubelamp.xml",
    },
  ];
  g_props = [
    { prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: -8,
      entity: "data/entities/props/physics_seamine.xml",
    },
  ];
  g_props2 = [
    { prob: 0.3, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_crate.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      offset_y: 0,
      entity: "data/entities/props/physics_propane_tank.xml",
    },
  ];
  g_props3 = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_green.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_red.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_blue.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_yellow.xml",
    },
  ];
  g_props4 = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.8,
      min_count: 1,
      max_count: 1,
      offset_y: 5,
      entity: "data/entities/props/physics_bed.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_crate.xml",
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.6,
      material_file: "data/biome_impl/snowcastle/shaft.png",
      visual_file: "data/biome_impl/snowcastle/shaft_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/bridge.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/cargobay.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/bar.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/bar_background.png",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/bedroom.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/bedroom_background.png",
      is_unique: 0,
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 10,
      entity: "data/entities/props/physics_chain_torch_ghostly.xml",
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
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_big_enemies(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_items(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props2(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props3(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene2(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy2(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy3(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_ghostlamp(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_candles(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potion_altar(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potions(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_apparition(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_heart(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wands(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_portal(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_end_portal(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_orb(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_perk(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_all_perks(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_ignite(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity_source(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_moon(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_collapse(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp2(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props4(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Sandcave;
