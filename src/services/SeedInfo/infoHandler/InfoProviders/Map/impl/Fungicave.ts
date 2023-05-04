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
      entities: ["data/entities/animals/tentacler_small.xml", "data/entities/animals/tentacler.xml"],
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

  get_portal_position() {
    const biome_x_min = -2450;
    const biome_x_max = 1900;
    const biome_y_min = 6700;
    const biome_y_max = 8000;
    const rim = 200;
    const portal_x = this.randoms.ProceduralRandomi(209, 13, biome_x_min + rim, biome_x_max - rim);
    const portal_y = this.randoms.ProceduralRandomi(211, 1.9, biome_y_min + rim, biome_y_max - rim);
    // --print("portal position: " .. portal_x .. ", " .. portal_y)
    return [portal_x, portal_y];
  }

  init(x: number, y: number, w: number, h: number) {
    const is_inside_tile = (pos_x, pos_y) => pos_x >= x && pos_x <= x + w && pos_y >= y && pos_y <= y + h;

    const [portal_x, portal_y] = this.get_portal_position();
    this.HandleInterest("jungle_portal", portal_x, portal_y);

    if (is_inside_tile(portal_x, portal_y)) {
      this.EntityLoad("data/entities/misc/summon_portal_target.xml", portal_x, portal_y);
      this.LoadPixelScene("data/biome_impl/hole.png", "", portal_x - 22, portal_y - 22, "", true);
    }
  }

  spawn_small_enemies(x: number, y: number) {
    this.spawn(this.g_small_enemies, x, y);
  }
  spawn_big_enemies(x: number, y: number) {
    this.spawn(this.g_big_enemies, x, y);
  }
  spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);
    if (r > 0.06) {
      this.LoadPixelScene(
        "data/biome_impl/wand_altar.png",
        "data/biome_impl/wand_altar_visual.png",
        x - 10,
        y - 17,
        "",
        true
      );
    }
  }
  spawn_nest(x: number, y: number) {
    this.spawn(this.g_nest, x, y);
  }
  spawn_robots(x: number, y: number) {
    this.spawn(this.g_robots, x, y);
  }
  spawn_props(x: number, y: number) {
    this.spawn(this.g_props, x, y);
  }
  spawn_potion_altar(x: number, y: number) {
    this.LoadPixelScene(
      "data/biome_impl/potion_altar.png",
      "data/biome_impl/potion_altar_visual.png",
      x - 10,
      y - 17,
      "",
      true
    );
  }
  spawn_physics_fungus(x: number, y: number) {
    this.spawn(this.g_physics_fungi, x, y);
  }

  spawn_lamp(x, y) {}
  load_pixel_scene(x, y) {}
  load_pixel_scene2(x, y) {}
  spawn_props2(x, y) {}
  spawn_props3(x, y) {}
  spawn_unique_enemy(x, y) {}
  spawn_unique_enemy2(x, y) {}
  spawn_unique_enemy3(x, y) {}
  spawn_ghostlamp(x, y) {}
  spawn_candles(x, y) {}
}
export default Fungicave;
