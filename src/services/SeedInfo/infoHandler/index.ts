import { AlchemyInfoProvider } from "./InfoProviders/Alchemy";
import { BiomeInfoProvider } from "./InfoProviders/Biome";
import { BiomeModifierInfoProvider } from "./InfoProviders/BiomeModifier";
import { FungalInfoProvider } from "./InfoProviders/Fungal";
import { InfoProvider } from "./InfoProviders/Base";
import { IPerkChangeAction, PerkInfoProvider } from "./InfoProviders/Perk";
import { LotteryInfoProvider } from "./InfoProviders/Lottery";
import { MapInfoProvider } from "./InfoProviders/Map";
import { MaterialInfoProvider } from "./InfoProviders/Material";
import { WeatherInfoProvider } from "./InfoProviders/Weather";
import { ShopInfoProvider } from "./InfoProviders/Shop";
import { SpellInfoProvider } from "./InfoProviders/Spell";
import { StartingBombSpellInfoProvider } from "./InfoProviders/StartingBomb";
import { StartingFlaskInfoProvider } from "./InfoProviders/StartingFlask";
import { StartingSpellInfoProvider } from "./InfoProviders/StartingSpell";
import { AlwaysCastInfoProvider } from "./InfoProviders/AlwaysCast";
import { WaterCaveInfoProvider } from "./InfoProviders/WaterCave";

// Chests
import { ChestRandomProvider } from "./InfoProviders/ChestRandom";
import { PacifistChestProvider } from "./InfoProviders/PacifistChest";

import loadRandom, { IRandom } from "../random";
import { WandInfoProvider } from "./InfoProviders/Wand";
import { i18n } from "i18next";
import { PotionInfoProvider } from "./InfoProviders/Potion";
import { PotionSecretInfoProvider } from "./InfoProviders/PotionSecret";
import { PotionRandomMaterialInfoProvider } from "./InfoProviders/PotionRandomMaterial";
import { PowderStashInfoProvider } from "./InfoProviders/PowderStash";

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

  loadRandomPromise: Promise<any>;

  constructor(
    initialConfig: Partial<IProviderConfig>,
    unlockedSpells: boolean[],
    i18n?: i18n,
    randoms?: IRandom,
    dispatch = true
  ) {
    super();
    this.dispatch = dispatch;
    this.resetConfig(initialConfig);
    this.unlockedSpells = unlockedSpells;
    if (randoms) {
      this.loadRandomPromise = Promise.resolve();
      this.setRandoms(randoms);
    } else {
      this.loadRandomPromise = loadRandom()
        .then(r => this.setRandoms(r))
        .catch(e => console.error(e));
    }
    this.i18n = i18n;
  }

  setRandoms(randoms: IRandom) {
    this.randoms = randoms;
    this.providers = this.buildInfoProviders();
  }

  async ready() {
    await this.loadRandomPromise;
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
      initialConfig
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

  buildInfoProviders(): IProviders {
    const providers: any = {
      alchemy: new AlchemyInfoProvider(this.randoms),
      alwaysCast: new AlwaysCastInfoProvider(this.randoms),
      biome: new BiomeInfoProvider(this.randoms),
      biomeModifier: new BiomeModifierInfoProvider(this.randoms),
      fungalShift: new FungalInfoProvider(this.randoms),
      lottery: new LotteryInfoProvider(this.randoms),
      map: new MapInfoProvider(this.randoms),
      material: new MaterialInfoProvider(this.i18n),
      perk: new PerkInfoProvider(this.randoms),
      weather: new WeatherInfoProvider(this.randoms),
      spells: new SpellInfoProvider(this.randoms),
      startingBombSpell: new StartingBombSpellInfoProvider(this.randoms),
      startingFlask: new StartingFlaskInfoProvider(this.randoms),
      startingSpell: new StartingSpellInfoProvider(this.randoms),
      statelessPerk: new PerkInfoProvider(this.randoms),
      wand: new WandInfoProvider(this.randoms),
      waterCave: new WaterCaveInfoProvider(this.randoms),

      potion: new PotionInfoProvider(this.randoms),
      potionSecret: new PotionSecretInfoProvider(this.randoms),
      potionRandomMaterial: new PotionRandomMaterialInfoProvider(this.randoms),
      powderStash: new PowderStashInfoProvider(this.randoms),

      chestRandom: new ChestRandomProvider(this.randoms, this.unlockedSpells),
      pacifistChest: new PacifistChestProvider(this.randoms, this.unlockedSpells),
    };

    // shop needs the wand info provider to generate wands
    providers.shop = new ShopInfoProvider(this.randoms, providers.wand);

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
        this.config.perkRerolls
      ),
      statelessPerks: this.providers.statelessPerk.provideStateless(
        this.config.perkStacks[this.config.perkStacks.length - 1],
        true
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
