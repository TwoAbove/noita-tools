// data/scripts/biomes/coalmine_alt.lua
import Base from "../Base";
class Coalminealt extends Base {
  chestLevel = 1;
  g_small_enemies = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/zombie.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/frog.xml",
    },
    {
      prob: 0.3,
      min_count: 2,
      max_count: 2,
      entity: "data/entities/animals/miner_weak.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 2,
      entity: "data/entities/animals/miner_fire.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_dark.xml",
      ngpluslevel: 1,
    },
  ];
  g_big_enemies = [
    { prob: 1.7, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/firemage_weak.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/worm.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/miner.xml",
        "data/entities/animals/miner.xml",
        "data/entities/animals/shotgunner.xml",
      ],
    },
    {
      prob: 0.12,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/giantshooter.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/fireskull.xml",
    },
    {
      prob: 0.2,
      min_count: 3,
      max_count: 5,
      entity: "data/entities/animals/frog.xml",
    },
    {
      prob: 0.13,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/frog_big.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/frog.xml",
        "data/entities/animals/frog.xml",
        "data/entities/animals/frog_big.xml",
      ],
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/miner_santa.xml",
      spawn_check: "TODO: FunctionDeclaration",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shaman.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
      ngpluslevel: 2,
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_clusterbomb.xml",
      ngpluslevel: 1,
    },
  ];
  g_lamp = [
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/lantern_small.xml",
    },
    { prob: 0.3, min_count: 1, max_count: 1, entity: "" },
  ];
  g_unique_enemy = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/giantshooter.xml",
    },
  ];
  g_unique_enemy2 = [
    { prob: 1.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/miner_santa.xml",
      spawn_check: "TODO: FunctionDeclaration",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.5,
      min_count: 2,
      max_count: 2,
      entity: "data/entities/animals/miner.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/slimeshooter.xml",
    },
  ];
  g_unique_enemy3 = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/firemage_weak.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/thundermage.xml",
    },
  ];
  g_fungi = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/fungus.xml",
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
  ];
  g_props = [
    { prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.1,
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
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_oil.xml",
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
      prob: 0.25,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_cart.xml",
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
  g_nest = [
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/flynest.xml",
    },
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
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
      material_file: "data/biome_impl/coalmine/shrine01_alt.png",
      visual_file: "data/biome_impl/coalmine/shrine01_visual.png",
      background_file: "",
      is_unique: 1,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/shrine02_alt.png",
      visual_file: "data/biome_impl/coalmine/shrine02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/swarm_alt.png",
      visual_file: "data/biome_impl/coalmine/swarm_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/symbolroom_alt.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_01_alt.png",
      visual_file: "data/biome_impl/coalmine/physics_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_02_alt.png",
      visual_file: "data/biome_impl/coalmine/physics_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/coalmine/physics_03_alt.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.75,
      material_file: "data/biome_impl/coalmine/shop_alt.png",
      visual_file: "data/biome_impl/coalmine/shop_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/coalmine/radioactivecave.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
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
  async load_structures(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_large_structures(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_vines(x: number, y: number) {
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
export default Coalminealt;
