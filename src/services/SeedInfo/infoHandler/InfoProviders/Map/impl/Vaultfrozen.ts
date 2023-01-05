// data/scripts/biomes/vault_frozen.lua
import Base from "../Base";
class Vaultfrozen extends Base {
  chestLevel = 6;
  g_small_enemies = [
    { prob: 0.8, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.4,
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
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_invis.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/icer.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/icemage.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/thunderskull.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_shield.xml",
    },
    {
      prob: 0.002,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/ultimate_killer.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 4,
      entity: "data/entities/animals/vault/scavenger_glue.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/scavenger_leader.xml",
        "data/entities/animals/vault/scavenger_smg.xml",
        "data/entities/animals/vault/scavenger_grenade.xml",
        "data/entities/animals/vault/scavenger_glue.xml",
        "data/entities/animals/vault/coward.xml",
      ],
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
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/thundermage_big.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/roboguard.xml",
        "data/entities/animals/vault/healerdrone_physics.xml",
        "data/entities/animals/scavenger_invis.xml",
      ],
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
          max_count: 1,
          entity: "data/entities/animals/vault/coward.xml",
        },
        "data/entities/animals/vault/scavenger_leader.xml",
        "data/entities/animals/vault/scavenger_heal.xml",
        "data/entities/animals/scavenger_invis.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tank_rocket.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/tank_super.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_shield.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/vault/missilecrab.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/spearbot.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot_super.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_weaken.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/icer.xml",
        "data/entities/animals/vault/healerdrone_physics.xml",
      ],
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/vault/missilecrab.xml",
        "data/entities/animals/drone_shield.xml",
      ],
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
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_pressure_tank.xml",
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_propane_tank.xml",
    },
  ];
  g_robots = [{ prob: 1, min_count: 0, max_count: 0, entity: "" }];
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
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/cords/verlet_cord.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/cords/verlet_cord_long.xml",
    },
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/cords/verlet_cord_short.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/cords/verlet_cord_shorter.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/slime_vine/slime_vine_short.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/slime_vine/slime_vine.xml",
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
  g_barricade = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_box_harmless.xml",
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
  spawn_robots(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene4(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_turret(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_vines(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_machines(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pipes_hor(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pipes_turn_right(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pipes_turn_left(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pipes_ver(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_pipes_cross(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_barricade(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Vaultfrozen;
