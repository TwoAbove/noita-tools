// data/scripts/biomes/vault.lua
import { ShopInfoProvider } from "../../Shop";
import { WandInfoProvider } from "../../Wand";
import Base from "../Base";

const lab_liquids = {
  fff0bbee: ["radioactive_liquid", "radioactive_liquid", "acid", "acid", "acid", "alcohol"],
  ffa4dbd5: ["radioactive_liquid", "radioactive_liquid", "acid", "acid", "acid", "alcohol"]
}
class Vault extends Base {
  chestLevel = 6;
  g_small_enemies = [
    { prob: 0.8, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/vault/drone_physics.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/lasershooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/roboguard.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/assassin.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tentacler.xml",
    },
    {
      prob: 0.12,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/vault/tentacler_small.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/tentacler_small.xml",
        "data/entities/animals/vault/tentacler.xml",
      ],
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/acidshooter.xml",
    },
    {
      prob: 0.18,
      min_count: 3,
      max_count: 5,
      entity: "data/entities/animals/vault/blob.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/vault/bigzombie.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/scavenger_mine.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 2,
      entities: [
        "data/entities/animals/vault/sniper.xml",
        "data/entities/animals/vault/flamer.xml",
      ],
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/drone_lasership.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/monk.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/thunderskull.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
      ngpluslevel: 2,
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/sniper.xml",
        "data/entities/animals/vault/coward.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/vault/scavenger_glue.xml",
    },
  ];
  g_big_enemies = [
    { prob: 0.8, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/vault/firemage.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/thundermage.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_invis.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_shield.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/roboguard.xml",
        "data/entities/animals/vault/healerdrone_physics.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/wizard_dark.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_swapper.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/maggot.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 2,
      entities: [
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/vault/scavenger_smg.xml",
        },
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/vault/scavenger_grenade.xml",
        },
        {
          min_count: 0,
          max_count: 3,
          entity: "data/entities/animals/vault/scavenger_glue.xml",
        },
        "data/entities/animals/vault/scavenger_leader.xml",
        "data/entities/animals/vault/scavenger_heal.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tank.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tank_rocket.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tank_super.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/missilecrab.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/spearbot.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/flamer.xml",
        "data/entities/animals/vault/icer.xml",
        "data/entities/animals/vault/healerdrone_physics.xml",
      ],
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/roboguard.xml",
        "data/entities/animals/vault/healerdrone_physics.xml",
        "data/entities/animals/vault/coward.xml",
      ],
    },
    {
      prob: 0.075,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot.xml",
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
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_tubelamp.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/dripping_water.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/dripping_water_heavy.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/dripping_oil.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      offset_y: -4,
      entity: "data/entities/props/dripping_radioactive.xml",
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_05.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_05_better.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_03.xml",
    },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_04.xml",
    },
  ];
  g_props = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_pressure_tank.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_propane_tank.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -8,
      entity: "data/entities/props/physics_seamine.xml",
    },
  ];
  g_hanging_props = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_container.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_tank_radioactive.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_tank_acid.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_seamine.xml",
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/lab.png",
      visual_file: "data/biome_impl/vault/lab_visual.png",
      background_file: "data/biome_impl/vault/lab_background.png",
      is_unique: 0,
      color_material: lab_liquids,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/lab2.png",
      visual_file: "data/biome_impl/vault/lab2_visual.png",
      background_file: "data/biome_impl/vault/lab2_background.png",
      is_unique: 0,
      color_material: lab_liquids,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/lab3.png",
      visual_file: "data/biome_impl/vault/lab3_visual.png",
      background_file: "data/biome_impl/vault/lab3_background.png",
      is_unique: 0,
      color_material: lab_liquids,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/vault/symbolroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.3,
      material_file: "data/biome_impl/vault/lab_puzzle.png",
      visual_file: "data/biome_impl/vault/lab_puzzle_visual.png",
      background_file: "data/biome_impl/vault/lab_puzzle_background.png",
      is_unique: 0,
      background_z_index: 38,
    },
  ];
  g_pixel_scene_wide = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/brain_room.png",
      visual_file: "data/biome_impl/vault/brain_room_visual.png",
      background_file: "data/biome_impl/vault/brain_room_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/shop.png",
      visual_file: "data/biome_impl/vault/shop_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/acidtank.png",
      visual_file: "data/biome_impl/vault/acidtank_visual.png",
      background_file: "data/biome_impl/vault/acidtank_background.png",
      is_unique: 0,
    },
  ];
  g_pixel_scene_tall = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/electric_tunnel_room.png",
      visual_file: "",
      background_file:
        "data/biome_impl/vault/electric_tunnel_room_background.png",
      is_unique: 0,
    },
  ];
  g_pipes_hor = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_hor_1.png",
      visual_file: "data/biome_impl/vault/pipe_hor_1_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_hor_2.png",
      visual_file: "data/biome_impl/vault/pipe_hor_2_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/vault/pipe_hor_3.png",
      visual_file: "data/biome_impl/vault/pipe_hor_3_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_ver = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_ver_1.png",
      visual_file: "data/biome_impl/vault/pipe_ver_1_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_ver_2.png",
      visual_file: "data/biome_impl/vault/pipe_ver_2_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.05,
      material_file: "data/biome_impl/vault/pipe_ver_3.png",
      visual_file: "data/biome_impl/vault/pipe_ver_3_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/vault/pipe_ver_4.png",
      visual_file: "data/biome_impl/vault/pipe_ver_4_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_turn_right = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_turn_right.png",
      visual_file: "data/biome_impl/vault/pipe_turn_right_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_turn_left = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_turn_left.png",
      visual_file: "data/biome_impl/vault/pipe_turn_left_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_cross = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_cross.png",
      visual_file: "data/biome_impl/vault/pipe_cross_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_big_hor = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_hor_1.png",
      visual_file: "data/biome_impl/vault/pipe_big_hor_1_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_hor_2.png",
      visual_file: "data/biome_impl/vault/pipe_big_hor_2_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_big_ver = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_ver_1.png",
      visual_file: "data/biome_impl/vault/pipe_big_ver_1_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_ver_2.png",
      visual_file: "data/biome_impl/vault/pipe_big_ver_2_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_big_turn_right = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_turn_right.png",
      visual_file: "data/biome_impl/vault/pipe_big_turn_right_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pipes_big_turn_left = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/pipe_big_turn_left.png",
      visual_file: "data/biome_impl/vault/pipe_big_turn_left_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_stains = [
    {
      prob: 0.5,
      material_file: "",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/stain.png",
      visual_file: "data/biome_impl/vault/stain_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/stain.png",
      visual_file: "data/biome_impl/vault/stain_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/stain.png",
      visual_file: "data/biome_impl/vault/stain_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_stains_ceiling = [
    {
      prob: 0.5,
      material_file: "",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/stain_ceiling.png",
      visual_file: "data/biome_impl/vault/stain_ceiling_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/vault/stain_ceiling.png",
      visual_file: "data/biome_impl/vault/stain_ceiling_02_visual.png",
      background_file: "",
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
  g_turret = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/turret_right.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/turret_left.xml",
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
  g_machines = [
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_1.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_2.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_3.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_4.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_5.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_machine_6.xml",
    },
    { prob: 1.4, min_count: 1, max_count: 1, entity: "" },
  ];
  g_apparatus = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_apparatus_01.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/vault_apparatus_02.xml",
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
  g_catwalks = [
    {
      prob: 1,
      material_file: "data/biome_impl/vault/catwalk_01.png",
      visual_file: "",
      background_file: "data/biome_impl/vault/catwalk_01_background.png",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/vault/catwalk_02.png",
      visual_file: "",
      background_file: "data/biome_impl/vault/catwalk_02_background.png",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/vault/catwalk_02b.png",
      visual_file: "",
      background_file: "data/biome_impl/vault/catwalk_02b_background.png",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/vault/catwalk_03.png",
      visual_file: "",
      background_file: "data/biome_impl/vault/catwalk_03_background.png",
      is_unique: 0,
    },
    {
      prob: 0.1,
      material_file: "data/biome_impl/vault/catwalk_04.png",
      visual_file: "",
      background_file: "data/biome_impl/vault/catwalk_04_background.png",
      is_unique: 0,
    },
  ];
  g_pillars = [
    {
      prob: 1,
      sprite_file: "data/biome_impl/vault/pillar_01_background.png",
      z_index: 40,
    },
    {
      prob: 0.2,
      sprite_file: "data/biome_impl/vault/pillar_02_background.png",
      z_index: 40,
    },
    {
      prob: 0.2,
      sprite_file: "data/biome_impl/vault/pillar_03_background.png",
      z_index: 40,
    },
    {
      prob: 0.3,
      sprite_file: "data/biome_impl/vault/pillar_04_background.png",
      z_index: 40,
    },
    {
      prob: 0.2,
      sprite_file: "data/biome_impl/vault/pillar_05_background.png",
      z_index: 40,
    },
  ];
  g_pillar_bases = [
    {
      prob: 1,
      sprite_file: "data/biome_impl/vault/pillar_base_01_background.png",
      z_index: 40,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/vault/pillar_base_02_background.png",
      z_index: 40,
    },
  ];

  safe(x: number, y: number) {
    let result = true;

    if ((x >= 125) && (x <= 249) && (y >= 8694) && (y <= 8860)) {
      result = false;
    }

    return result;
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
  spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);
    if (r < 0.93) {
      this.LoadPixelScene("data/biome_impl/wand_altar_vault.png", "data/biome_impl/wand_altar_vault_visual.png", x - 5, y - 10, "", true)
    }
  }
  spawn_props(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_props, x, y);
    }
  }
  spawn_lamp(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_lamp, x, y);
    }
  }
  load_pixel_scene(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
  }
  load_pixel_scene2(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
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
    const r = this.randoms.ProceduralRandomf(x, y, 0, 1);

    if (r > 0.65) {
      this.LoadPixelScene("data/biome_impl/potion_altar_vault.png", "data/biome_impl/potion_altar_vault_visual.png", x - 3, y - 10, "", true);
    }
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
  load_pixel_scene_wide(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_wide, x, y);
  }
  load_pixel_scene_tall(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_tall, x, y);
  }
  load_warning_strip(x: number, y: number) {
    // this.LoadBackgroundSprite("data/biome_impl/vault/warningstrip_background.png", x, y-4, 40);
  }
  spawn_turret(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_turret, x, y, 0, 0);
    }
  }
  spawn_vines(x: number, y: number) {
    this.spawn(this.g_vines, x + 5, y + 5);
  }
  spawn_machines(x: number, y: number) {
    this.spawn(this.g_machines, x + 5, y + 5, 0, 0);
  }
  spawn_hanging_prop(x: number, y: number) {
    if (this.safe(x, y)) {
      this.spawn(this.g_hanging_props, x, y);
    }
  }
  spawn_pipes_hor(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_hor, x, y);
  }
  spawn_pipes_turn_right(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_turn_right, x, y);
  }
  spawn_pipes_turn_left(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_turn_left, x, y);
  }
  spawn_pipes_ver(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_ver, x, y);
  }
  spawn_pipes_cross(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_cross, x, y);
  }
  spawn_pipes_big_hor(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_big_hor, x, y);
  }
  spawn_pipes_big_turn_right(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_big_turn_right, x, y);
  }
  spawn_pipes_big_turn_left(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_big_turn_left, x, y);
  }
  spawn_pipes_big_ver(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pipes_big_ver, x, y);
  }
  spawn_stains(x: number, y: number) {
    this.load_random_pixel_scene(this.g_stains, x - 10, y);
  }
  spawn_stains_ceiling(x: number, y: number) {
    this.load_random_pixel_scene(this.g_stains_ceiling, x - 20, y - 10);
  }
  spawn_barricade(x: number, y: number) {
    this.spawn(this.g_barricade, x, y, 0, 0);
  }
  load_pillar(x: number, y: number) {
    this.load_random_background_sprite(this.g_pillars, x, y + 3);
  }
  load_pillar_base(x: number, y: number) {
    this.load_random_background_sprite(this.g_pillar_bases, x, y + 3);
  }
  load_catwalk(x: number, y: number) {
    this.randoms.SetRandomSeed(x, y);
    const ym = this.rand(y, y + 1);
    this.load_random_pixel_scene(this.g_catwalks, x, ym - 20);
  }
  spawn_apparatus(x: number, y: number) {
    this.spawn(this.g_apparatus, x - 4, y - 5, 0, 0);
  }
  spawn_electricity_trap(x: number, y: number) {
    this.EntityLoad("data/entities/props/physics_trap_electricity_enabled.xml", x, y);
  }
  spawn_shopitem(x: number, y: number) {
    this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, null]);
  }
  spawn_laser_trap(x: number, y: number) {
    this.randoms.SetRandomSeed(x, y);

    this.LoadPixelScene("data/biome_impl/vault/hole.png", "", x, y, "", true);

    if (this.randoms.Random(1, 3) === 2) {
      this.EntityLoad("data/entities/props/physics/trap_laser_toggling.xml", x + 5, y + 5);
    }
  }
  spawn_lab_puzzle(x: number, y: number) {
    this.randoms.SetRandomSeed(x, y)
    const type_a = this.randoms.randomFromArray([
      "poly",
      "tele",
      "charm",
      "berserk",
    ]);
    const type_b = this.randoms.randomFromArray([
      "protect",
      "worm",
      "invis",
      "speed",
    ]);
    this.EntityLoad("data/entities/buildings/vault_lab_puzzle_" + type_a + ".xml", x - 10, y);
    this.EntityLoad("data/entities/buildings/vault_lab_puzzle_" + type_b + ".xml", x + 11, y);
  }
}
export default Vault;
