// data/scripts/biomes/snowcastle.lua
import { GameGetDateAndTimeLocal } from "../../helpers";
import Base from "../Base";

const isJussi = () => !!GameGetDateAndTimeLocal()[6];
class Snowcastle extends Base {
  chestLevel = 3;
  g_small_enemies = [
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: ["data/entities/animals/scavenger_grenade.xml", "data/entities/animals/scavenger_smg.xml"],
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
          min_count: 0,
          max_count: 2,
          entity: "data/entities/animals/scavenger_smg.xml",
        },
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/sniper.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/miner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tank.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tank_rocket.xml",
    },
    {
      prob: 0.002,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tank_super.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_heal.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_lasership.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_leader.xml",
      ngpluslevel: 2,
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 0,
          max_count: 1,
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
          entity: "data/entities/animals/coward.xml",
        },
      ],
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 2,
      entities: ["data/entities/animals/drunk/scavenger_grenade.xml", "data/entities/animals/drunk/scavenger_smg.xml"],
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 2,
      entities: [
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 0,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
      ],
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/sniper.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drunk/miner.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drunk/shotgunner.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.05,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.01,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.002,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/scavenger_heal.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
    {
      prob: 1.1,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 0,
          max_count: 1,
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
      ],
      spawn_check: isJussi,
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
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entities: [
        "data/entities/animals/scavenger_leader.xml",
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
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/coward.xml",
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
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_heal.xml",
    },
    {
      prob: 0.005,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/scavenger_clusterbomb.xml",
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
          min_count: 1,
          max_count: 1,
          entity: "data/entities/animals/scavenger_heal.xml",
        },
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/drone_lasership.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/coward.xml",
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
      ],
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/hpcrystal.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.075,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot.xml",
      ngpluslevel: 2,
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot_super.xml",
      ngpluslevel: 3,
    },
    {
      prob: 2.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/drunk/scavenger_leader.xml",
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
      ],
      spawn_check: isJussi,
    },
    {
      prob: 2.1,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entities: [
        "data/entities/animals/drunk/scavenger_leader.xml",
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
      ],
      spawn_check: isJussi,
    },
    {
      prob: 2.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/scavenger_heal.xml",
      spawn_check: isJussi,
    },
    {
      prob: 2.02,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/drunk/scavenger_clusterbomb.xml",
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
        {
          min_count: 1,
          max_count: 1,
          entity: "data/entities/animals/drunk/scavenger_heal.xml",
        },
      ],
      spawn_check: isJussi,
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
      prob: 0.002,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/healderdrone_physics.xml",
    },
  ];
  g_unique_enemy2 = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/scavenger_grenade.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/scavenger_smg.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/sniper.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_heal.xml",
    },
    {
      prob: 2.6,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/drunk/scavenger_grenade.xml",
      spawn_check: isJussi,
    },
    {
      prob: 2.6,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/drunk/scavenger_smg.xml",
      spawn_check: isJussi,
    },
    {
      prob: 2.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/sniper.xml",
      spawn_check: isJussi,
    },
    {
      prob: 2.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/scavenger_heal.xml",
      spawn_check: isJussi,
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_03.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_03_better.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_03.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
    },
  ];
  g_lamp = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
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
      offset_y: 0,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_propane_tank.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -8,
      entity: "data/entities/props/physics_seamine.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
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
    {
      prob: 0.5,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/items/easter/beer_bottle.xml",
      spawn_check: isJussi,
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
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/items/pickup/potion_alcohol.xml",
    },
    {
      prob: 0.025,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/items/pickup/potion.xml",
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/snowcastle/shaft.png",
      visual_file: "data/biome_impl/snowcastle/shaft_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/snowcastle/bridge.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/snowcastle/drill.png",
      visual_file: "data/biome_impl/snowcastle/drill_visual.png",
      background_file: "data/biome_impl/snowcastle/drill_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/snowcastle/greenhouse.png",
      visual_file: "data/biome_impl/snowcastle/greenhouse_visual.png",
      background_file: "data/biome_impl/snowcastle/greenhouse_background.png",
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
      prob: 0.8,
      material_file: "data/biome_impl/snowcastle/bar.png",
      visual_file: "data/biome_impl/snowcastle/bar_visual.png",
      background_file: "data/biome_impl/snowcastle/bar_background.png",
      is_unique: 0,
    },
    {
      prob: 0.8,
      material_file: "data/biome_impl/snowcastle/bedroom.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/bedroom_background.png",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/acidpool.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.4,
      material_file: "data/biome_impl/snowcastle/polymorphroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.2,
      material_file: "data/biome_impl/snowcastle/teleroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.3,
      material_file: "data/biome_impl/snowcastle/sauna.png",
      visual_file: "data/biome_impl/snowcastle/sauna_visual.png",
      background_file: "data/biome_impl/snowcastle/sauna_background.png",
      is_unique: 0,
    },
    {
      prob: 0.3,
      material_file: "data/biome_impl/snowcastle/kitchen.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_turret = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/turret_right.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/turret_left.xml",
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
  g_barricade = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_box_harmless.xml",
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
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_hanging_wire.xml",
    },
  ];
  g_forcefield_generator = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/forcefield_generator.xml",
    },
  ];
  g_pods_large = [
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_large_blank_01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_large_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_large_01_background.png",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_large_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_large_01_background_b.png",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_large_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_large_01_background_c.png",
      is_unique: 0,
    },
  ];
  g_pods_small_l = [
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_l_blank_01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_l_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_small_l_01_background.png",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_l_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_small_l_01_background_b.png",
      is_unique: 0,
    },
  ];
  g_pods_small_r = [
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_r_blank_01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_r_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_small_r_01_background.png",
      is_unique: 0,
    },
    {
      prob: 1,
      material_file: "data/biome_impl/snowcastle/pod_small_r_01.png",
      visual_file: "",
      background_file: "data/biome_impl/snowcastle/pod_small_r_01_background_b.png",
      is_unique: 0,
    },
  ];
  g_furniture = [
    { prob: 2, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_bunk.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_table.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_locker.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_footlocker.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_stool.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/furniture_cryopod.xml",
    },
  ];

  safe(x: number, y: number) {
    if (x >= 125 && x <= 249 && y >= 5118 && y <= 5259) {
      return false;
    }
    if (y > 6100) {
      return false;
    }
    return true;
  }

  spawn_small_enemies(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_small_enemies, x, y);
    }
  }
  spawn_big_enemies(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_big_enemies, x, y);
    }
  }
  spawn_unique_enemy(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_unique_enemy, x, y);
    }
  }
  spawn_unique_enemy2(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_unique_enemy2, x, y);
    }
  }
  spawn_turret(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_turret, x, y, 0, 0);
    }
  }
  spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);
    if (r > 0.2) {
      this.LoadPixelScene(
        "data/biome_impl/wand_altar_vault.png",
        "data/biome_impl/wand_altar_vault_visual.png",
        x - 5,
        y - 9,
        "",
        true
      );
    }
  }
  spawn_lamp(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_lamp, x + 5, y, 0, 0);
    }
  }
  spawn_lamp2(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_lamp, x, y, 0, 0);
    }
  }
  spawn_props(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_props, x, y - 3, 0, 0);
    }
  }
  spawn_props2(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_props2, x, y - 3, 0, 0);
    }
  }
  spawn_props3(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_props3, x, y, 0, 0);
    }
  }
  load_pixel_scene(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
  }
  load_pixel_scene2(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
  }
  load_paneling(x, y, id) {
    this.LoadPixelScene(
      "data/biome_impl/snowcastle/paneling_wall.png",
      "",
      x,
      y,
      "data/biome_impl/snowcastle/paneling_" + id + ".png",
      true,
      false,
      {},
      60
    );
  }
  load_panel_01(x: number, y: number) {
    this.load_paneling(x - 15, y - 30, "01");
  }
  load_panel_02(x: number, y: number) {
    this.load_paneling(x - 10, y - 20, "02");
  }
  load_panel_03(x: number, y: number) {
    this.load_paneling(x - 60, y - 20, "03");
  }
  load_panel_04(x: number, y: number) {
    this.load_paneling(x - 20, y - 20, "04");
  }
  load_panel_05(x: number, y: number) {
    this.load_paneling(x - 60, y - 60, "05");
  }
  load_panel_06(x: number, y: number) {
    this.load_paneling(x - 20, y - 60, "06");
  }
  load_panel_07(x: number, y: number) {
    this.load_paneling(x - 40, y - 40, "07");
  }
  load_panel_08(x: number, y: number) {
    this.load_paneling(x - 40, y - 20, "08");
  }
  load_panel_09(x: number, y: number) {
    this.load_paneling(x - 20, y - 20, "09");
  }
  spawn_vines(x: number, y: number) {
    this.spawn(this.g_vines, x + 5, y + 5);
  }
  spawn_potion_altar(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x, y, 0, 1);
    if (r > 0.65) {
      this.LoadPixelScene(
        "data/biome_impl/potion_altar_vault.png",
        "data/biome_impl/potion_altar_vault_visual.png",
        x - 3,
        y - 9,
        "",
        true
      );
    }
  }
  spawn_barricade(x: number, y: number) {
    this.spawn(this.g_barricade, x, y, 0, 0);
  }
  spawn_forcefield_generator(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.spawn(this.g_forcefield_generator, x, y - 2, 0, 0);
  }
  spawn_brimstone(x: number, y: number) {
    this.EntityLoad("data/entities/items/pickup/brimstone.xml", x, y);
    this.EntityLoad("data/entities/buildings/sauna_stove_heat.xml", x, y + 10);
  }
  spawn_vasta_or_vihta(x: number, y: number) {
    if (x > 190) {
      this.EntityLoad("data/entities/items/wand_vasta.xml", x, y);
    } else {
      this.EntityLoad("data/entities/items/wand_vihta.xml", x, y);
    }
  }

  load_chamfer_top_r(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_top_r.png", "", x - 10, y, "", true);
  }
  load_chamfer_top_l(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_top_l.png", "", x - 1, y, "", true);
  }
  load_chamfer_bottom_r(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_bottom_r.png", "", x - 10, y - 20, "", true);
  }
  load_chamfer_bottom_l(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_bottom_l.png", "", x - 1, y - 20, "", true);
  }
  load_chamfer_inner_top_r(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_inner_top_r.png", "", x - 10, y, "", true);
  }
  load_chamfer_inner_top_l(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_inner_top_l.png", "", x, y, "", true);
  }
  load_chamfer_inner_bottom_r(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_inner_bottom_r.png", "", x - 10, y - 20, "", true);
  }
  load_chamfer_inner_bottom_l(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/chamfer_inner_bottom_l.png", "", x, y - 20, "", true);
  }
  load_pillar_filler(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/pillar_filler_01.png", "", x, y, "", true);
  }
  load_pillar_filler_tall(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    this.LoadPixelScene("data/biome_impl/snowcastle/pillar_filler_tall_01.png", "", x, y, "", true);
  }
  load_pod_large(x: number, y: number) {
    if (!this.safe(x, y - 50)) {
      return;
    }
    this.load_random_pixel_scene(this.g_pods_large, x, y - 50);
  }
  load_pod_small_l(x: number, y: number) {
    if (!this.safe(x, y - 40)) {
      return;
    }
    this.load_random_pixel_scene(this.g_pods_small_l, x - 30, y - 40);
  }
  load_pod_small_r(x: number, y: number) {
    if (!this.safe(x, y - 40)) {
      return;
    }
    this.load_random_pixel_scene(this.g_pods_small_r, x - 10, y - 40);
  }
  load_bunk_with_surprise(x: number, y: number) {
    this.EntityLoad("data/entities/props/furniture_bunk.xml", x, y + 5);
    this.EntityLoad("data/entities/props/physics_propane_tank.xml", x, y);
  }
  load_furniture(x: number, y: number) {
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.002) {
      this.load_bunk_with_surprise(x, y);
    } else {
      this.spawn(this.g_furniture, x, y + 5, 0, 0);
    }
  }
  load_furniture_bunk(x: number, y: number) {
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.02) {
      this.load_bunk_with_surprise(x, y);
    } else {
      this.EntityLoad("data/entities/props/furniture_bunk.xml", x, y + 5);
    }
  }
  spawn_root_grower(x: number, y: number) {
    this.EntityLoad("data/entities/props/root_grower.xml", x, y);
  }
  spawn_forge_check(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/forge_item_check.xml", x, y);
  }
  spawn_drill_laser(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/drill_laser.xml", x, y);
  }
  spawn_cook(x: number, y: number) {
    this.EntityLoad("data/entities/animals/miner_chef.xml", x, y);
  }
}
export default Snowcastle;
