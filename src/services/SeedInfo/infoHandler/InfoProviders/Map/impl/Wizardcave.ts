// data/scripts/biomes/wizardcave.lua
import Base from "../Base";
class Wizardcave extends Base {
  chestLevel = 3;
  g_small_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/firemage.xml",
    },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/thundermage.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/icemage.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_tele.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_poly.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_dark.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_swapper.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/wizard_returner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_weaken.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_homing.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/barfer.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/failed_alchemist.xml",
    },
  ];
  g_big_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/thundermage.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_tele.xml",
        "data/entities/animals/wizard_dark.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_dark.xml",
        "data/entities/animals/wizard_poly.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_poly.xml",
        "data/entities/animals/wizard_swapper.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_swapper.xml",
        "data/entities/animals/wizard_hearty.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_hearty.xml",
        "data/entities/animals/wizard_twitchy.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_twitchy.xml",
        "data/entities/animals/wizard_neutral.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_neutral.xml",
        "data/entities/animals/wizard_returner.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_returner.xml",
        "data/entities/animals/wizard_weaken.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_weaken.xml",
        "data/entities/animals/wizard_homing.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_homing.xml",
        "data/entities/animals/wizard_tele.xml",
      ],
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/wizard_tele.xml",
        "data/entities/animals/wizard_dark.xml",
        "data/entities/animals/wizard_poly.xml",
        "data/entities/animals/wizard_swapper.xml",
        "data/entities/animals/wizard_neutral.xml",
        "data/entities/animals/wizard_twitchy.xml",
        "data/entities/animals/wizard_returner.xml",
        "data/entities/animals/wizard_hearty.xml",
        "data/entities/animals/wizard_weaken.xml",
        "data/entities/animals/wizard_homing.xml",
      ],
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_06.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_06_better.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_05.xml",
    },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_06.xml",
    },
  ];
  g_scorpions = [
    { prob: 0.7, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scorpion.xml",
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/crypt/stairs_right.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_04 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/crypt/stairs_left.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
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
  g_lamp2 = [
    { prob: 0.2, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/chain_torch.xml",
    },
  ];
  g_props = [
    { prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/physics_vase.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/physics_vase_longleg.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/animals/mimic_physics.xml",
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
  g_unique_enemy = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_x: 2,
      entity: "data/entities/buildings/arrowtrap_right.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_x: 2,
      entity: "data/entities/buildings/firetrap_right.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_x: 2,
      entity: "data/entities/buildings/thundertrap_right.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_x: 2,
      entity: "data/entities/buildings/spittrap_right.xml",
    },
  ];
  g_large_enemies = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_x: 1,
      entity: "data/entities/buildings/arrowtrap_left.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_x: 1,
      entity: "data/entities/buildings/firetrap_left.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_x: 1,
      entity: "data/entities/buildings/thundertrap_left.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_x: 1,
      entity: "data/entities/buildings/spittrap_left.xml",
    },
  ];
  g_ghost_crystal = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/ghost.xml",
        },
        "data/entities/buildings/ghost_crystal.xml",
      ],
    },
  ];
  g_pressureplates = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/pressure_plate.xml",
    },
  ];
  g_doors = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_templedoor.xml",
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
  g_pixel_scene_01 = [
    {
      prob: 1,
      material_file: "data/biome_impl/crypt/cathedral.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/crypt/mining.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/crypt/polymorphroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_background_scenes = [
    { prob: 4, sprite_file: "" },
    { prob: 1, sprite_file: "data/biome_impl/wizardcave/drape_1.png" },
    { prob: 0.66, sprite_file: "data/biome_impl/wizardcave/drape_2.png" },
    { prob: 0.33, sprite_file: "data/biome_impl/wizardcave/drape_3.png" },
  ];
  g_small_background_scenes = [
    { prob: 4, visual_file: "" },
    { prob: 1, sprite_file: "data/biome_impl/crypt/slab_01_background.png" },
    { prob: 0.5, sprite_file: "data/biome_impl/crypt/slab_02_background.png" },
    { prob: 0.5, sprite_file: "data/biome_impl/crypt/slab_03_background.png" },
    { prob: 1, sprite_file: "data/biome_impl/crypt/slab_04_background.png" },
    { prob: 1, sprite_file: "data/biome_impl/crypt/slab_05_background.png" },
    { prob: 1, sprite_file: "data/biome_impl/crypt/slab_06_background.png" },
    { prob: 1, sprite_file: "data/biome_impl/crypt/slab_07_background.png" },
  ];
  g_scavengers = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 3,
      entities: [
        "data/entities/animals/scavenger_smg.xml",
        "data/entities/animals/scavenger_grenade.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_leader.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_clusterbomb.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_poison.xml",
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 10,
      entity: "data/entities/props/physics/chain_torch_ghostly.xml",
    },
  ];
  g_bones = [
    { prob: 2.4, min_count: 1, max_count: 1, entity: "" },
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
  init(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_statues(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene3(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene4(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene5(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene5b(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp2(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_large_enemies(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_ghost_crystal(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_crawlers(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pressureplates(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_doors(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_scavengers(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_scorpions(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_bones(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_beam(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_background_scene(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_small_background_scene(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_cavein(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_vines(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_statue_back(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_shopitem(x: number, y: number) {
    this.warn(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Wizardcave;
