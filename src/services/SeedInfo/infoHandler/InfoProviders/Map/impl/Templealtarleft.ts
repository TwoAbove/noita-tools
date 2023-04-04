// data/scripts/biomes/temple_altar_left.lua
import Base from "../Base";
class Templealtarleft extends Base {
  chestLevel = 3;
  g_lamp = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/temple_lantern.xml",
    },
  ];
  g_fish = [
    {
      prob: 1,
      min_count: 1,
      max_count: 4,
      entity: "data/entities/animals/fish.xml",
    },
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
  ];
  g_rubble = [
    { prob: 2, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_01.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_02.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_03.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_04.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_05.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_temple_rubble_06.xml",
    },
  ];
  g_vines = [
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
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
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_short.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_shorter.xml",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
  }
  spawn_big_enemies(x: number, y: number) {
  }
  spawn_items(x: number, y: number) {
  }
  spawn_props(x: number, y: number) {
  }
  spawn_props2(x: number, y: number) {
  }
  spawn_props3(x: number, y: number) {
  }
  spawn_lamp(x: number, y: number) {
    this.spawn(this.g_lamp, x, y, 0, 10);
  }
  load_pixel_scene(x: number, y: number) {
  }
  load_pixel_scene2(x: number, y: number) {
  }
  spawn_unique_enemy(x: number, y: number) {
  }
  spawn_unique_enemy2(x: number, y: number) {
  }
  spawn_unique_enemy3(x: number, y: number) {
  }
  spawn_ghostlamp(x: number, y: number) {
  }
  spawn_candles(x: number, y: number) {
  }
  spawn_potions(x: number, y: number) {
  }
  init(x: number, y: number) {
    this.spawn_altar_top(x, y, false);

    this.LoadPixelScene("data/biome_impl/temple/altar_left.png", "data/biome_impl/temple/altar_left_visual.png", x, y - 40 + 300, "data/biome_impl/temple/altar_left_background.png", true);
  }
  spawn_hp(x: number, y: number) {
    this.EntityLoad("data/entities/items/pickup/heart_fullhp_temple.xml", x - 16, y)
    this.EntityLoad("data/entities/items/pickup/heart_refresh.xml", x + 16, y)
  }
  spawn_shopitem(x: number, y: number) {
    this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, null]);
  }
  spawn_cheap_shopitem(x: number, y: number) {
    this.HandleInterest('ShopInfoProvider', x, y, [x, y, true, null]);

  }
  spawn_workshop(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/workshop.xml", x, y);
  }
  spawn_workshop_extra(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/workshop_allow_mods.xml", x, y);
  }
  spawn_motordoor(x: number, y: number) {
    this.EntityLoad("data/entities/props/physics_templedoor2.xml", x, y);
  }
  spawn_pressureplate(x: number, y: number) {
    this.EntityLoad("data/entities/props/temple_pressure_plate.xml", x, y);
  }
  spawn_music_trigger(x: number, y: number) {
  }
  spawn_duplicator(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/temple_duplicator.xml", x, y);
  }
  spawn_areachecks(x: number, y: number) {
    if (this.temple_should_we_spawn_checkers(x, y)) {
      this.EntityLoad("data/entities/buildings/temple_areacheck_horizontal.xml", x + 5 - 10, y - 65 - 16 - 20)
      this.EntityLoad("data/entities/buildings/temple_areacheck_horizontal.xml", x - 10, y + 140)
      this.EntityLoad("data/entities/buildings/temple_areacheck_vertical.xml", x - 120 - 10, y)
      this.EntityLoad("data/entities/buildings/temple_areacheck_vertical_stub.xml", x - 120 - 10, y - 20 - 80)
    }
  }
  spawn_rubble(x: number, y: number) {
    this.spawn(this.g_rubble, x, y, 5, 0);
  }
  spawn_lamp_long(x: number, y: number) {
    this.spawn(this.g_lamp, x, y, 0, 15);
  }
  spawn_vines(x: number, y: number) {
    this.spawn(this.g_vines, x + 5, y + 5);
  }
  spawn_statue(x: number, y: number) {
    const curse = this.GameHasFlagRun("greed_curse");

    if (curse) {
      this.EntityLoad("data/entities/misc/greed_curse/greed_crystal.xml", x, y - 48);
      this.EntityLoad("data/entities/props/temple_statue_01_green.xml", x, y);
    } else {
      this.EntityLoad("data/entities/props/temple_statue_01.xml", x, y);
    }
  }
}
export default Templealtarleft;
