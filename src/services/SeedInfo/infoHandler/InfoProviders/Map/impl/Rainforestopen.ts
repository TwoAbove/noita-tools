// data/scripts/biomes/rainforest.lua
import Base from "../Base";
class Rainforestopen extends Base {
  chestLevel = 4;
  g_small_enemies = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 2,
      max_count: 4,
      entity: "data/entities/animals/rainforest/fly.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_longleg.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/rainforest/shooterflower.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/scavenger_poison.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/scavenger_clusterbomb.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/bloom.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/shaman.xml",
    },
    {
      prob: 0.06,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/rainforest/scavenger_smg.xml",
        "data/entities/animals/rainforest/scavenger_grenade.xml",
        "data/entities/animals/rainforest/coward.xml",
      ],
    },
  ];
  g_big_enemies = [
    { prob: 0.6, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/rainforest/fungus.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_longleg.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/bloom.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/scavenger_mine.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/rainforest/scavenger_poison.xml",
        "data/entities/animals/rainforest/scavenger_clusterbomb.xml",
      ],
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/rainforest/scavenger_poison.xml",
        "data/entities/animals/rainforest/scavenger_clusterbomb.xml",
        "data/entities/animals/rainforest/scavenger_heal.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/shooterflower.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/spearbot.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entities: [
        "data/entities/animals/rainforest/scavenger_poison.xml",
        "data/entities/animals/rainforest/scavenger_clusterbomb.xml",
        "data/entities/animals/rainforest/scavenger_leader.xml",
        "data/entities/animals/rainforest/coward.xml",
      ],
    },
  ];
  g_unique_enemy = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/physics_cocoon.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/shooterflower.xml",
    },
  ];
  g_unique_enemy2 = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/lukki_eggs.xml",
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
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_05.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_02.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_03.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_04_better.xml",
    },
  ];
  g_nest = [
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/flynest.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/spidernest.xml",
    },
  ];
  g_large_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/shooterflower.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/rainforest/fungus.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/rainforest/bloom.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_longleg.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/rainforest/scavenger_clusterbomb.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/rainforest/scavenger_poison.xml",
        },
        "data/entities/animals/rainforest/scavenger_leader.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
  ];
  g_scavengers = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entities: [
        "data/entities/animals/rainforest/scavenger_smg.xml",
        "data/entities/animals/rainforest/scavenger_grenade.xml",
      ],
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/flamer.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/sniper.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/scavenger_leader.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/rainforest/scavenger_mine.xml",
    },
  ];
  g_props = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -2,
      entity: "data/entities/props/physics_seamine.xml",
    },
  ];
  g_lamp = [
    { prob: 0.3, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_torch_stand.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/projectiles/mine.xml",
    },
  ];
  g_lamp2 = [
    { prob: 0, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_tubelamp.xml",
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit02.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit03.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.8,
      material_file: "data/biome_impl/rainforest/oiltank_01.png",
      visual_file: "data/biome_impl/rainforest/oiltank_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/hut01.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/hut01_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/hut02.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/rainforest/base.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/hut03.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/rainforest/symbolroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_04 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife2_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife3_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife4_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife5_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife6_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife7_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife8_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife9_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife10_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife11_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/plantlife.png",
      visual_file: "",
      background_file: "data/biome_impl/rainforest/plantlife12_background.png",
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
  g_vines = [
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
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
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/root/hanging_root_random.xml",
    },
  ];
  g_trees = [
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      offset_x: -10,
      offset_y: -113,
      entity: "data/entities/props/rainforest_tree_01.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_02.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_03.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_04.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_05.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_06.xml",
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
  async init(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_scavengers(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_large_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_lamp2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async load_pixel_scene4(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_vines(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_dragonspot(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_root_grower(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_tree(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Rainforestopen;
