// data/scripts/biomes/watercave.lua
import Base from "../Base";
class Watercave extends Base {
  chestLevel = 3;
  g_small_enemies = [
    { prob: 0.1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/giantshooter.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lasershooter.xml",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    this.spawn(this.g_small_enemies, x, y)
  }

  spawn_big_enemies(x, y) { }
  spawn_props2(x, y) { }
  spawn_props3(x, y) { }
  spawn_lamp(x, y) { }
  load_pixel_scene(x, y) { }
  load_pixel_scene2(x, y) { }
  spawn_unique_enemy(x, y) { }
  spawn_unique_enemy2(x, y) { }
  spawn_unique_enemy3(x, y) { }
  spawn_ghostlamp(x, y) { }
  spawn_candles(x, y) { }
  spawn_potions(x, y) { }
  init(x: number, y: number) { }

  random_layout(x: number, y: number) {
    const r = Math.floor(this.randoms.ProceduralRandomf(x, y, 1, 6));
    this.LoadPixelScene("data/biome_impl/watercave_layout_" + r + ".png", "", x, y, "", true);
  }

  spawn_items(x, y) {
    this.EntityLoad("data/entities/items/pickup/heart.xml", x, y)
  }

  spawn_props(x, y) {
    this.EntityLoad("data/entities/items/pickup/heart_fullhp.xml", x, y)
  }
}
export default Watercave;
