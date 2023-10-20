// data/scripts/biomes/liquidcave.lua
import Base from "../Base";
class Liquidcave extends Base {
  chestLevel = 1;
  g_small_enemies = [
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/failed_alchemist.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/enlightened_alchemist.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_returner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: ["data/entities/animals/wizard_tele.xml", "data/entities/animals/wizard_dark.xml"],
      ngpluslevel: 1,
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: ["data/entities/animals/wizard_hearty.xml", "data/entities/animals/wizard_swapper.xml"],
      ngpluslevel: 1,
    },
  ];
  g_big_enemies = [
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/failed_alchemist.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/enlightened_alchemist.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shaman.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/failed_alchemist_b.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: ["data/entities/animals/wizard_twitchy.xml", "data/entities/animals/wizard_poly.xml"],
      ngpluslevel: 2,
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/hpcrystal.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot_super.xml",
      ngpluslevel: 2,
    },
  ];
  g_lamp = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/props/physics_lantern.xml",
    },
  ];
  g_props = [
    { prob: 0.5, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.8,
      min_count: 1,
      max_count: 1,
      offset_y: 5,
      entity: "data/entities/props/physics_bed.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_crate.xml",
    },
  ];
  g_props2 = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 5,
      entity: "data/entities/props/banner.xml",
    },
  ];
  g_bottle = [
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
  g_chest = [
    { prob: 0.6, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/chest.xml",
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
  g_statues = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_01.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_02.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_03.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_04.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_05.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_06.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_07.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_08.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_09.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_10.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_11.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/statues/statue_rock_12.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/statue_trap_right.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/statue_trap_left.xml",
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/container_01.png",
      visual_file: "data/biome_impl/liquidcave/container_01_visual.png",
      background_file: "",
      is_unique: 0,
      color_material: {
        f0bbeeff: [
          "oil",
          "alcohol",
          "lava",
          "magic_liquid_teleportation",
          "magic_liquid_protection_all",
          "material_confusion",
          "liquid_fire",
          "magic_liquid_weakness",
        ],
      },
    },
  ];
  g_background_panel_big = [
    {
      prob: 0.2,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_01.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_02.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_03.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_04.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_05.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_06.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_07.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/liquidcave/background_panel_big_material.png",
      visual_file: "",
      background_file: "data/biome_impl/liquidcave/background_panel_big_08.png",
      is_unique: 0,
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    this.spawn(this.g_small_enemies, x, y);
  }
  spawn_big_enemies(x: number, y: number) {
    this.spawn(this.g_big_enemies, x, y);
  }
  spawn_lamp(x: number, y: number) {
    this.spawn(this.g_lamp, x, y + 4, 0, 0);
  }
  spawn_props(x: number, y: number) {
    this.spawn(this.g_props, x, y, 0, 0);
  }
  spawn_props2(x: number, y: number) {
    this.spawn(this.g_props2, x, y, 0, 0);
  }
  spawn_bottle(x: number, y: number) {
    this.spawn(this.g_bottle, x, y, 0, 0);
  }
  spawn_chest(x: number, y: number) {}
  spawn_shopkeeper(x: number, y: number) {}
  spawn_items(x: number, y: number) {}
  spawn_props3(x: number, y: number) {}
  spawn_blood(x: number, y: number) {}
  load_pixel_scene2(x: number, y: number) {}
  spawn_unique_enemy(x: number, y: number) {}
  spawn_unique_enemy2(x: number, y: number) {}
  spawn_unique_enemy3(x: number, y: number) {}
  spawn_save(x: number, y: number) {}
  spawn_ghostlamp(x: number, y: number) {}
  spawn_persistent_teleport(x: number, y: number) {}
  spawn_candles(x: number, y: number) {}
  init(x: number, y: number) {}

  load_pixel_scene(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_01, x - 5, y - 3);
  }

  load_background_panel_big(x: number, y: number) {
    this.load_random_pixel_scene(this.g_background_panel_big, x, y);
  }

  spawn_lasergun(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/lasergun.xml", x + 5, y + 5);
  }

  spawn_vines(x: number, y: number) {
    this.spawn(this.g_vines, x + 5, y + 5);
  }
  spawn_statues(x: number, y: number) {
    this.spawn(this.g_statues, x + 5, y - 10);
  }
  spawn_potions(x: number, y: number) {
    this.spawn_from_list("potion_spawnlist_liquidcave", x, y);
  }
}
export default Liquidcave;
