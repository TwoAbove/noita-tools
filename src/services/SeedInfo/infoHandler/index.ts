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

import loadRandom, { IRandom } from "../random";
import type { WandInfoProvider } from "./InfoProviders/Wand";
import type { i18n } from "i18next";
import type { PotionInfoProvider } from "./InfoProviders/Potion";
import type { PotionSecretInfoProvider } from "./InfoProviders/PotionSecret";
import type { PotionRandomMaterialInfoProvider } from "./InfoProviders/PotionRandomMaterial";
import type { PowderStashInfoProvider } from "./InfoProviders/PowderStash";

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
    return Promise.allSettled(Object.values(this.providers).map(p => p.ready())).catch(e => {
      console.error(e);
    });
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
    ] = await Promise.all([
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
    ]);

    const providers: any = {
      alchemy: new alchemy.AlchemyInfoProvider(this.randoms),
      alwaysCast: new alwaysCast.AlwaysCastInfoProvider(this.randoms),
      biome: new biome.BiomeInfoProvider(this.randoms),
      biomeModifier: new biomeModifier.BiomeModifierInfoProvider(this.randoms),
      fungalShift: new fungalShift.FungalInfoProvider(this.randoms),
      lottery: new lottery.LotteryInfoProvider(this.randoms),
      map: new map.MapInfoProvider(this.randoms),
      material: new material.MaterialInfoProvider(this.i18n),
      perk: new perk.PerkInfoProvider(this.randoms),
      weather: new weather.WeatherInfoProvider(this.randoms),
      spells: new spells.SpellInfoProvider(this.randoms),
      startingBombSpell: new startingBombSpell.StartingBombSpellInfoProvider(this.randoms),
      startingFlask: new startingFlask.StartingFlaskInfoProvider(this.randoms),
      startingSpell: new startingSpell.StartingSpellInfoProvider(this.randoms),
      statelessPerk: new statelessPerk.PerkInfoProvider(this.randoms),
      wand: new wand.WandInfoProvider(this.randoms),
      waterCave: new waterCave.WaterCaveInfoProvider(this.randoms),

      potion: new potion.PotionInfoProvider(this.randoms),
      potionSecret: new potionSecret.PotionSecretInfoProvider(this.randoms),
      potionRandomMaterial: new potionRandomMaterial.PotionRandomMaterialInfoProvider(this.randoms),
      powderStash: new powderStash.PowderStashInfoProvider(this.randoms),
    };

    providers.chestRandom = new chestRandom.ChestRandomProvider(this.randoms, this.unlockedSpells, providers.spells);
    providers.pacifistChest = new pacifistChest.PacifistChestProvider(this.randoms, providers.chestRandom);
    // shop needs the wand info provider to generate wands
    providers.shop = new shop.ShopInfoProvider(this.randoms, providers.wand, providers.spells);

    return providers as IProviders;
  }

  async provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    const worldSeed = Number(this.config.seed);
    this.randoms!.SetWorldSeed(worldSeed);
    return {
      alchemy: this.providers.alchemy.provide(),
      biomeModifiers: this.providers.biomeModifier.provide(),
      fungalShifts: this.providers.fungalShift.provide(undefined),
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
