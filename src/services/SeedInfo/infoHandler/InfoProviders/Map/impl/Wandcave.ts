// data/scripts/biomes/wandcave.lua
import Base from "../Base";
class Wandcave extends Base {
  chestLevel = 1;
  g_small_enemies = [
    { prob: 0.3, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/wand_ghost.xml",
    },
  ];
  g_big_enemies = [
    { prob: 0.3, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/statue_physics.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/phantom_a.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/phantom_b.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necromancer.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_returner.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wraith_glowing.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/enlightened_alchemist.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/failed_alchemist.xml",
    },
  ];
  g_lamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/chain_torch_ghostly.xml",
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/chain_torch_ghostly.xml",
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
  g_props = [
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
    { prob: 5.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_01.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_02.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_03.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_04.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_05.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bone_06.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_01.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_02.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_03.xml",
    },
  ];
  g_cloud_trap = [
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/cloud_trap.xml",
    },
  ];
  g_floor_rubble = [
    {
      prob: 15,
      material_file: "",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_01.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_02.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_03.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/wandcave/floor_rubble_l_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_l_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/wandcave/floor_rubble_l_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_l_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/wandcave/floor_rubble_r_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_r_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/wandcave/floor_rubble_r_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_r_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_floor_rubble_l = [
    {
      prob: 2,
      material_file: "",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_l_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_l_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_l_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_l_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_03.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_01.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_02.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_floor_rubble_r = [
    {
      prob: 2,
      material_file: "",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_r_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_r_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_r_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_r_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_01.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_02.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/wandcave/floor_rubble_small_03.png",
      visual_file: "data/biome_impl/wandcave/floor_rubble_small_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_01.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/wandcave/floor_rubble_dynamic_02.png",
      visual_file:
        "data/biome_impl/wandcave/floor_rubble_dynamic_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];

  async spawn_small_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_big_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_items(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_props(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_props2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_props3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_lamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_pixel_scene(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_pixel_scene2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_unique_enemy(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_unique_enemy2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_unique_enemy3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_ghostlamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_candles(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_potion_altar(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_potions(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_apparition(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_heart(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_wands(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_end_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_orb(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_perk(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_all_perks(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_wand_trap(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_wand_trap_ignite(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_wand_trap_electricity_source(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_wand_trap_electricity(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_moon(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_collapse(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_cloud_trap(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_floor_rubble(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_floor_rubble_l(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_floor_rubble_r(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Wandcave;