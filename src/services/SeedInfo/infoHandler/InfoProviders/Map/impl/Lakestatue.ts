// data/scripts/biomes/lake_statue.lua
import Base from "../Base";
class Lakestatue extends Base {
  chestLevel = 3;
  g_fish = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/fish.xml",
    },
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
  ];
  g_small_animals = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/deer.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/duck.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/elk.xml",
    },
    {
      prob: 1,
      min_count: 2,
      max_count: 5,
      entity: "data/entities/animals/sheep.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wolf.xml",
    },
  ];
  g_hiisi = [
    {
      prob: 0.3,
      min_count: 2,
      max_count: 2,
      entity: "data/entities/animals/drunk/miner_weak.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 2,
      entity: "data/entities/animals/drunk/miner_fire.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/shotgunner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entities: [
        "data/entities/animals/drunk/miner.xml",
        "data/entities/animals/drunk/miner.xml",
        "data/entities/animals/drunk/shotgunner.xml",
      ],
    },
    {
      prob: 0.12,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/shotgunner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: [
        "data/entities/animals/drunk/scavenger_grenade.xml",
        "data/entities/animals/drunk/scavenger_smg.xml",
      ],
    },
    {
      prob: 0.1,
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
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/sniper.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drunk/miner.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/drunk/shotgunner.xml",
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/scavenger_heal.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_lasership.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drunk/scavenger_leader.xml",
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
          entity: "data/entities/animals/drunk/scavenger_grenade.xml",
        },
        {
          min_count: 1,
          max_count: 2,
          entity: "data/entities/animals/drunk/scavenger_smg.xml",
        },
      ],
    },
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_lantern_small.xml",
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
  init(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_building_stash(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_fish(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_bigfish(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_small_animals(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_essence(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_secret_checker(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Lakestatue;
