// data/scripts/biomes/tower.lua
import Base from "../Base";
class Solidwalltower3 extends Base {
  chestLevel = 1;
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_lantern_small.xml",
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_001.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_002.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_003.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_004.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_005.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_006.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_007.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_008.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wands/level_01/wand_009.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_01.xml",
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
      prob: 0.25,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_cart.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_skull_01.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_skull_02.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_skull_03.xml",
    },
  ];
  g_props2 = [
    { prob: 0.5, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -3,
      entity: "data/entities/props/physics/minecart.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_brewing_stand.xml",
    },
  ];
  g_props3 = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/items/pickup/potion.xml",
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/coalpit01.png",
      visual_file: "data/biome_impl/coalmine/coalpit01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/coalpit02.png",
      visual_file: "data/biome_impl/coalmine/coalpit02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/carthill.png",
      visual_file: "data/biome_impl/coalmine/carthill_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/coalpit03.png",
      visual_file: "data/biome_impl/coalmine/coalpit03_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/coalpit04.png",
      visual_file: "data/biome_impl/coalmine/coalpit04_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/coalpit05.png",
      visual_file: "data/biome_impl/coalmine/coalpit05_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/shrine01.png",
      visual_file: "data/biome_impl/coalmine/shrine01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/shrine02.png",
      visual_file: "data/biome_impl/coalmine/shrine02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/slimepit.png",
      visual_file: "data/biome_impl/coalmine/slimepit_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/laboratory.png",
      visual_file: "data/biome_impl/coalmine/laboratory_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/swarm.png",
      visual_file: "data/biome_impl/coalmine/swarm_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/symbolroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_01.png",
      visual_file: "data/biome_impl/coalmine/physics_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_02.png",
      visual_file: "data/biome_impl/coalmine/physics_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_03.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.75,
      material_file: "data/biome_impl/coalmine/shop.png",
      visual_file: "data/biome_impl/coalmine/shop_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/coalmine/radioactivecave.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/coalmine/wandtrap_h_02.png",
      visual_file: "data/biome_impl/coalmine/wandtrap_h_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/coalmine/wandtrap_h_04.png",
      visual_file: "data/biome_impl/coalmine/wandtrap_h_04_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "oil",
          "alcohol",
          "gunpowder_explosive",
          "oil",
          "alcohol",
          "oil",
          "alcohol",
        ],
      },
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/coalmine/wandtrap_h_06.png",
      visual_file: "data/biome_impl/coalmine/wandtrap_h_06_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "magic_liquid_teleportation",
          "magic_liquid_polymorph",
          "magic_liquid_random_polymorph",
          "radioactive_liquid",
        ],
      },
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/coalmine/wandtrap_h_07.png",
      visual_file: "data/biome_impl/coalmine/wandtrap_h_06_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: ["water", "oil", "alcohol", "radioactive_liquid"],
      },
    },
  ];
  g_oiltank = [
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_1.png",
      visual_file: "data/biome_impl/coalmine/oiltank_1_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "sand",
          "coal",
          "radioactive_liquid",
        ],
      },
    },
    {
      prob: 0.0004,
      material_file: "data/biome_impl/coalmine/oiltank_1.png",
      visual_file: "data/biome_impl/coalmine/oiltank_1_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "magic_liquid_teleportation",
          "magic_liquid_polymorph",
          "magic_liquid_random_polymorph",
          "magic_liquid_berserk",
          "magic_liquid_charm",
          "magic_liquid_invisibility",
          "magic_liquid_hp_regeneration",
          "salt",
          "blood",
          "gold",
          "honey",
        ],
      },
    },
    {
      prob: 0.01,
      material_file: "data/biome_impl/coalmine/oiltank_2.png",
      visual_file: "data/biome_impl/coalmine/oiltank_2_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "blood_fungi",
          "blood_cold",
          "lava",
          "poison",
          "slime",
          "gunpowder_explosive",
          "soil",
          "salt",
          "blood",
          "cement",
        ],
      },
    },
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_2.png",
      visual_file: "data/biome_impl/coalmine/oiltank_2_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "oil",
          "coal",
          "radioactive_liquid",
        ],
      },
    },
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_3.png",
      visual_file: "data/biome_impl/coalmine/oiltank_3_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "water",
          "coal",
          "radioactive_liquid",
          "magic_liquid_teleportation",
        ],
      },
    },
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_4.png",
      visual_file: "data/biome_impl/coalmine/oiltank_4_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "sand",
          "coal",
          "radioactive_liquid",
          "magic_liquid_polymorph",
        ],
      },
    },
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_5.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "radioactive_liquid",
          "coal",
          "radioactive_liquid",
        ],
      },
    },
  ];
  g_oiltank_alt = [
    {
      prob: 1,
      material_file: "data/biome_impl/coalmine/oiltank_alt.png",
      visual_file: "data/biome_impl/coalmine/oiltank_alt_visual.png",
      background_file: "",
      color_material: {
        fff0bbee: [
          "water",
          "oil",
          "water",
          "oil",
          "alcohol",
          "sand",
          "radioactive_liquid",
          "radioactive_liquid",
          "magic_liquid_berserk",
        ],
      },
    },
  ];
  g_i_structures = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_i_structure_01.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_i_structure_02.xml",
    },
  ];
  g_structures = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_structure_01.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_structure_01.xml",
    },
  ];
  g_large_structures = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_large_structure_01.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/coalmine_large_structure_02.xml",
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
  g_nest = [
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/flynest.xml",
    },
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
  ];
  g_vines = [
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_long.xml",
    },
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_short.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_shorter.xml",
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
  async spawn_nest(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_fungi(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_vines(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_skulls(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_chest(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_shopitem(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Solidwalltower3;
