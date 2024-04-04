import type { AlchemyInfoProvider } from "./InfoProviders/Alchemy";
import type { BiomeInfoProvider } from "./InfoProviders/Biome";
import type { BiomeModifierInfoProvider } from "./InfoProviders/BiomeModifier";
import type { FungalInfoProvider } from "./InfoProviders/Fungal";
import type { InfoProvider } from "./InfoProviders/Base";
import type { IPerkChangeAction, PerkInfoProvider } from "./InfoProviders/Perk";
import type { LotteryInfoProvider } from "./InfoProviders/Lottery";
import type { MapInfoProvider } from "./InfoProviders/Map";
import type { MaterialInfoProvider } from "./InfoProviders/Material";
import type { WeatherInfoProvider } from "./InfoProviders/Weather";
import type { ShopInfoProvider } from "./InfoProviders/Shop";
import type { SpellInfoProvider } from "./InfoProviders/Spell";
import type { StartingBombSpellInfoProvider } from "./InfoProviders/StartingBomb";
import type { StartingFlaskInfoProvider } from "./InfoProviders/StartingFlask";
import type { StartingSpellInfoProvider } from "./InfoProviders/StartingSpell";
import type { AlwaysCastInfoProvider } from "./InfoProviders/AlwaysCast";
import type { WaterCaveInfoProvider } from "./InfoProviders/WaterCave";

// Chests
import type { ChestRandomProvider } from "./InfoProviders/ChestRandom";
import type { PacifistChestProvider } from "./InfoProviders/PacifistChest";

// Special biomes
import type { ExcavationsiteCubeChamberInfoProvider } from "./InfoProviders/ExcavationsiteCubeChamber";

import loadRandom, { IRandom } from "../random";
import type { WandInfoProvider } from "./InfoProviders/Wand";
import type { i18n } from "i18next";
import type { PotionInfoProvider } from "./InfoProviders/Potion";
import type { PotionSecretInfoProvider } from "./InfoProviders/PotionSecret";
import type { PotionRandomMaterialInfoProvider } from "./InfoProviders/PotionRandomMaterial";
import type { PowderStashInfoProvider } from "./InfoProviders/PowderStash";
import type { SnowcaveSecretChamberProvider } from "./InfoProviders/SnowcaveSecretChamber";

interface IProviders {
  alchemy: AlchemyInfoProvider;
  alwaysCast: AlwaysCastInfoProvider;
  biome: BiomeInfoProvider;
  biomeModifier: BiomeModifierInfoProvider;
  fungalShift: FungalInfoProvider;
  lottery: LotteryInfoProvider;
  map: MapInfoProvider;
  material: MaterialInfoProvider;
  perk: PerkInfoProvider;
  weather: WeatherInfoProvider;
  shop: ShopInfoProvider;
  spells: SpellInfoProvider;
  startingBombSpell: StartingBombSpellInfoProvider;
  startingFlask: StartingFlaskInfoProvider;
  startingSpell: StartingSpellInfoProvider;
  statelessPerk: PerkInfoProvider;
  waterCave: WaterCaveInfoProvider;
  wand: WandInfoProvider;

  potion: PotionInfoProvider;
  potionSecret: PotionSecretInfoProvider;
  potionRandomMaterial: PotionRandomMaterialInfoProvider;
  powderStash: PowderStashInfoProvider;

  chestRandom: ChestRandomProvider;
  pacifistChest: PacifistChestProvider;

  excavationSiteCubeChamber: ExcavationsiteCubeChamberInfoProvider;
  snowcaveSecretChamber: SnowcaveSecretChamberProvider;

  [key: string]: InfoProvider;
}

export class GameInfoProvider extends EventTarget {
  randoms!: IRandom;
  dispatch = true;

  providers!: IProviders;

  config!: IProviderConfig;

  i18n?: i18n;

  unlockedSpells: boolean[];

  loadPromise: Promise<any>;

  constructor(
    initialConfig: Partial<IProviderConfig>,
    unlockedSpells: boolean[],
    i18n?: i18n,
    randoms?: IRandom,
    dispatch = true,
  ) {
    super();
    this.dispatch = dispatch;
    this.resetConfig(initialConfig);
    this.unlockedSpells = unlockedSpells;
    this.loadPromise = this.load(randoms);
    this.i18n = i18n;
  }

  async load(randoms?: IRandom) {
    if (randoms) {
      this.randoms = randoms;
    } else {
      this.randoms = await loadRandom();
    }

    this.providers = await this.buildInfoProviders();
  }

  setRandoms(randoms: IRandom) {
    this.randoms = randoms;
  }

  async ready() {
    await this.loadPromise;
    return Promise.allSettled(
      Object.entries(this.providers).map(([k, p]) =>
        p.ready().catch(e => {
          console.error(k, e);
        }),
      ),
    );
  }

  onRandomLoad(cb?) {
    return new Promise<void>(async res => {
      await this.ready();
      if (cb) {
        await cb();
      }
      res();
    });
  }

  resetConfig(initialConfig: Partial<IProviderConfig>) {
    this.config = Object.assign(
      {},
      {
        seed: 1,
        perkRerolls: new Map(),
        pickedPerks: new Map(),
        perkWorldOffset: 0,
        perkStacks: [[]],
        fungalShifts: [],
      },
      initialConfig,
    );
    if (this.dispatch) {
      this.dispatchEvent(new CustomEvent("reset", { detail: {} }));
    }
  }

  // This should be a reducer;
  updateConfig(config: Partial<IProviderConfig>) {
    Object.assign(this.config, config);
    if (this.dispatch) {
      this.dispatchEvent(new CustomEvent("update", { detail: {} }));
    }
  }

  async buildInfoProviders(): Promise<IProviders> {
    const imports = await Promise.allSettled([
      import("./InfoProviders/Alchemy"),
      import("./InfoProviders/AlwaysCast"),
      import("./InfoProviders/Biome"),
      import("./InfoProviders/BiomeModifier"),
      import("./InfoProviders/Fungal"),
      import("./InfoProviders/Lottery"),
      import("./InfoProviders/Map"),
      import("./InfoProviders/Material"),
      import("./InfoProviders/Perk"),
      import("./InfoProviders/Weather"),
      import("./InfoProviders/Spell"),
      import("./InfoProviders/StartingBomb"),
      import("./InfoProviders/StartingFlask"),
      import("./InfoProviders/StartingSpell"),
      import("./InfoProviders/Perk"),
      import("./InfoProviders/Wand"),
      import("./InfoProviders/WaterCave"),
      import("./InfoProviders/Potion"),
      import("./InfoProviders/PotionSecret"),
      import("./InfoProviders/PotionRandomMaterial"),
      import("./InfoProviders/PowderStash"),
      import("./InfoProviders/ChestRandom"),
      import("./InfoProviders/PacifistChest"),
      import("./InfoProviders/Shop"),
      import("./InfoProviders/ExcavationsiteCubeChamber"),
      import("./InfoProviders/SnowcaveSecretChamber"),
    ]);

    const [
      alchemy,
      alwaysCast,
      biome,
      biomeModifier,
      fungalShift,
      lottery,
      map,
      material,
      perk,
      weather,
      spells,
      startingBombSpell,
      startingFlask,
      startingSpell,
      statelessPerk,
      wand,
      waterCave,
      potion,
      potionSecret,
      potionRandomMaterial,
      powderStash,
      chestRandom,
      pacifistChest,
      shop,
      excavationSiteCubeChamber,
      snowcaveSecretChamber,
    ] = imports;

    const providers: any = {};

    if (alchemy && "value" in alchemy) providers.alchemy = new alchemy.value.AlchemyInfoProvider(this.randoms);
    if (alwaysCast && "value" in alwaysCast)
      providers.alwaysCast = new alwaysCast.value.AlwaysCastInfoProvider(this.randoms);
    if (biome && "value" in biome) providers.biome = new biome.value.BiomeInfoProvider(this.randoms);
    if (biomeModifier && "value" in biomeModifier)
      providers.biomeModifier = new biomeModifier.value.BiomeModifierInfoProvider(this.randoms);
    if (fungalShift && "value" in fungalShift)
      providers.fungalShift = new fungalShift.value.FungalInfoProvider(this.randoms);
    if (lottery && "value" in lottery) providers.lottery = new lottery.value.LotteryInfoProvider(this.randoms);
    if (map && "value" in map) providers.map = new map.value.MapInfoProvider(this.randoms);
    if (material && "value" in material) providers.material = new material.value.MaterialInfoProvider(this.i18n);
    if (perk && "value" in perk) providers.perk = new perk.value.PerkInfoProvider(this.randoms);
    if (weather && "value" in weather) providers.weather = new weather.value.WeatherInfoProvider(this.randoms);
    if (spells && "value" in spells) providers.spells = new spells.value.SpellInfoProvider(this.randoms);
    if (startingBombSpell && "value" in startingBombSpell)
      providers.startingBombSpell = new startingBombSpell.value.StartingBombSpellInfoProvider(this.randoms);
    if (startingFlask && "value" in startingFlask)
      providers.startingFlask = new startingFlask.value.StartingFlaskInfoProvider(this.randoms);
    if (startingSpell && "value" in startingSpell)
      providers.startingSpell = new startingSpell.value.StartingSpellInfoProvider(this.randoms);
    if (statelessPerk && "value" in statelessPerk)
      providers.statelessPerk = new statelessPerk.value.PerkInfoProvider(this.randoms);
    if (wand && "value" in wand) providers.wand = new wand.value.WandInfoProvider(this.randoms);
    if (waterCave && "value" in waterCave)
      providers.waterCave = new waterCave.value.WaterCaveInfoProvider(this.randoms);
    if (potion && "value" in potion) providers.potion = new potion.value.PotionInfoProvider(this.randoms);
    if (potionSecret && "value" in potionSecret)
      providers.potionSecret = new potionSecret.value.PotionSecretInfoProvider(this.randoms);
    if (potionRandomMaterial && "value" in potionRandomMaterial)
      providers.potionRandomMaterial = new potionRandomMaterial.value.PotionRandomMaterialInfoProvider(this.randoms);
    if (powderStash && "value" in powderStash)
      providers.powderStash = new powderStash.value.PowderStashInfoProvider(this.randoms);
    if (chestRandom && "value" in chestRandom)
      providers.chestRandom = new chestRandom.value.ChestRandomProvider(
        this.randoms,
        this.unlockedSpells,
        providers.spells,
      );
    if (pacifistChest && "value" in pacifistChest)
      providers.pacifistChest = new pacifistChest.value.PacifistChestProvider(this.randoms, providers.chestRandom);
    if (shop && "value" in shop)
      providers.shop = new shop.value.ShopInfoProvider(this.randoms, providers.wand, providers.spells);
    if (excavationSiteCubeChamber && "value" in excavationSiteCubeChamber)
      providers.excavationSiteCubeChamber = new excavationSiteCubeChamber.value.ExcavationsiteCubeChamberInfoProvider(
        this.randoms,
        providers.map,
        providers.wand,
      );
    if (snowcaveSecretChamber && "value" in snowcaveSecretChamber)
      providers.snowcaveSecretChamber = new snowcaveSecretChamber.value.SnowcaveSecretChamberProvider(
        this.randoms,
        providers.map,
        providers.wand,
      );

    return providers as IProviders;
  }

  async provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    const worldSeed = Number(this.config.seed);
    this.randoms!.SetWorldSeed(worldSeed);
    return {
      alchemy: this.providers.alchemy.provide(),
      biomeModifiers: this.providers.biomeModifier.provide(),
      fungalShifts: this.providers.fungalShift.provide(),
      perkDeck: this.providers.perk.getPerkDeck(true),
      perks: this.providers.perk.provide(
        this.config.pickedPerks,
        undefined,
        true,
        this.config.perkWorldOffset,
        this.config.perkRerolls,
      ),
      statelessPerks: this.providers.statelessPerk.provideStateless(
        this.config.perkStacks[this.config.perkStacks.length - 1],
        true,
      ),
      weather: this.providers.weather.provide(),
      shop: this.providers.shop.provide(this.config.pickedPerks, this.config.perkWorldOffset),
      startingBombSpell: this.providers.startingBombSpell.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      waterCave: this.providers.waterCave.provide(),
    };
  }
}

interface IProviderConfig {
  seed: number;
  perkRerolls: Map<number, number[]>;
  pickedPerks: Map<number, string[][]>;
  perkWorldOffset: number;
  perkStacks: IPerkChangeAction[][];
  fungalShifts: boolean[];
}

export default GameInfoProvider;
