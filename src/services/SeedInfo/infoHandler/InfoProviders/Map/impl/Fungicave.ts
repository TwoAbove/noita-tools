// data/scripts/biomes/fungicave.lua
import Base from "../Base";
class Fungicave extends Base {
  chestLevel = 2;
  g_small_enemies = [
    { prob: 0.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/zombie.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/rat.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/fungus.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/ant.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 4,
      entity: "data/entities/animals/blob.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tentacler.xml",
    },
    {
      prob: 0.11,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/tentacler_small.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/tentacler_small.xml",
        "data/entities/animals/tentacler.xml",
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/wizard_tele.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_dark.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_swapper.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_invis.xml",
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
  ];
  g_big_enemies = [
    { prob: 0.7, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/thundermage.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/fungus.xml",
    },
    {
      prob: 0.2,
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
    {
      prob: 0.1,
      min_count: 3,
      max_count: 5,
      entity: "data/entities/animals/blob.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/bigzombie.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_poly.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/maggot.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/alchemist.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/fungus_big.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_neutral.xml",
    },
    {
      prob: 0.06,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 3,
          entity: "data/entities/animals/fungus.xml",
        },
        {
          min_count: 1,
          max_count: 1,
          entity: "data/entities/animals/fungus_big.xml",
        },
      ],
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
      ngpluslevel: 2,
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_02.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_01.xml",
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
  g_physics_fungi = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_small.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_big.xml",
    },
  ];
  g_robots = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/roboguard.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drone_physics.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/assassin.xml",
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
  g_potions = [{ prob: 0.5, min_count: 1, max_count: 1, entity: "" }];

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
  async spawn_robots(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_nest(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  async spawn_physics_fungus(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Fungicave;
