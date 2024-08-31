import type { AlchemyInfoProvider } from "./InfoProviders/Alchemy";
import type { BiomeInfoProvider } from "./InfoProviders/Biome";
import type { BiomeModifierInfoProvider } from "./InfoProviders/BiomeModifier";
import type { FungalShiftInfoProvider } from "./InfoProviders/FungalShift";
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
import type { PowderStashInfoProvider } from "./InfoProviders/PowderStash";
import type { PotionInfoProvider } from "./InfoProviders/Potion";
import type { PotionSecretInfoProvider } from "./InfoProviders/PotionSecret";
import type { PotionRandomMaterialInfoProvider } from "./InfoProviders/PotionRandomMaterial";
import type { WandInfoProvider } from "./InfoProviders/Wand";

// Chests
import type { ChestRandomInfoProvider } from "./InfoProviders/ChestRandom";
import type { PacifistChestInfoProvider } from "./InfoProviders/PacifistChest";

// Special biomes
import type { ExcavationsiteCubeChamberInfoProvider } from "./InfoProviders/ExcavationsiteCubeChamber";
import type { SnowcaveSecretChamberInfoProvider } from "./InfoProviders/SnowcaveSecretChamber";
import type { SnowcastleSecretChamberInfoProvider } from "./InfoProviders/SnowcastleSecretChamber";

import loadRandom, { IRandom } from "../random";
import type { i18n } from "i18next";
import { camelCaseName } from "./helpers";

interface IProviders {
  alchemy: AlchemyInfoProvider;
  alwaysCast: AlwaysCastInfoProvider;
  biome: BiomeInfoProvider;
  biomeModifier: BiomeModifierInfoProvider;
  fungalShift: FungalShiftInfoProvider;
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
  waterCave: WaterCaveInfoProvider;
  wand: WandInfoProvider;

  potion: PotionInfoProvider;
  potionSecret: PotionSecretInfoProvider;
  potionRandomMaterial: PotionRandomMaterialInfoProvider;
  powderStash: PowderStashInfoProvider;

  chestRandom: ChestRandomInfoProvider;
  pacifistChest: PacifistChestInfoProvider;

  excavationsiteCubeChamber: ExcavationsiteCubeChamberInfoProvider;
  snowcaveSecretChamber: SnowcaveSecretChamberInfoProvider;
  snowcastleSecretChamber: SnowcastleSecretChamberInfoProvider;

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
    await Promise.allSettled(Object.values(this.providers).map(p => p.ready())).catch(e => console.error(e));
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
    // We have to import like this so that vite can bundle them
    const importMap = {
      Alchemy: () => import("./InfoProviders/Alchemy"),
      AlwaysCast: () => import("./InfoProviders/AlwaysCast"),
      Biome: () => import("./InfoProviders/Biome"),
      BiomeModifier: () => import("./InfoProviders/BiomeModifier"),
      FungalShift: () => import("./InfoProviders/FungalShift"),
      Lottery: () => import("./InfoProviders/Lottery"),
      Map: () => import("./InfoProviders/Map"),
      Material: () => import("./InfoProviders/Material"),
      Perk: () => import("./InfoProviders/Perk"),
      Weather: () => import("./InfoProviders/Weather"),
      Spell: () => import("./InfoProviders/Spell"),
      StartingBombSpell: () => import("./InfoProviders/StartingBomb"),
      StartingFlask: () => import("./InfoProviders/StartingFlask"),
      StartingSpell: () => import("./InfoProviders/StartingSpell"),
      Wand: () => import("./InfoProviders/Wand"),
      WaterCave: () => import("./InfoProviders/WaterCave"),
      Potion: () => import("./InfoProviders/Potion"),
      PotionSecret: () => import("./InfoProviders/PotionSecret"),
      PotionRandomMaterial: () => import("./InfoProviders/PotionRandomMaterial"),
      PowderStash: () => import("./InfoProviders/PowderStash"),
      ChestRandom: () => import("./InfoProviders/ChestRandom"),
      PacifistChest: () => import("./InfoProviders/PacifistChest"),
      ExcavationsiteCubeChamber: () => import("./InfoProviders/ExcavationsiteCubeChamber"),
      SnowcaveSecretChamber: () => import("./InfoProviders/SnowcaveSecretChamber"),
      SnowcastleSecretChamber: () => import("./InfoProviders/SnowcastleSecretChamber"),
      Shop: () => import("./InfoProviders/Shop"),
    };

    const imports = await Promise.allSettled(
      Object.values(importMap).map(importFunc =>
        importFunc().catch(e => {
          console.error(e);
          return null;
        }),
      ),
    );

    const providers: Partial<IProviders> = {};
    const queue: [string, any][] = [];

    const getDependencies = (providerName: string): { deps: string[]; getArgs: () => any[] } => {
      const baseArgs = [this.randoms];
      switch (providerName) {
        case "ChestRandom":
          return {
            deps: ["spell"],
            getArgs: () => [...baseArgs, this.unlockedSpells, providers.spell],
          };
        case "PacifistChest":
          return {
            deps: ["chestRandom"],
            getArgs: () => [...baseArgs, providers.chestRandom],
          };
        case "Shop":
          return {
            deps: ["wand", "spell"],
            getArgs: () => [...baseArgs, providers.wand, providers.spell],
          };
        case "ExcavationsiteCubeChamber":
          return {
            deps: ["map", "wand"],
            getArgs: () => [...baseArgs, providers.map, providers.wand],
          };
        case "SnowcaveSecretChamber":
          return {
            deps: ["map", "wand"],
            getArgs: () => [...baseArgs, providers.map, providers.wand],
          };
        case "SnowcastleSecretChamber":
          return {
            deps: ["map"],
            getArgs: () => [...baseArgs, providers.map],
          };
        case "Material":
          return {
            deps: [],
            getArgs: () => [this.i18n],
          };
        default:
          return {
            deps: [],
            getArgs: () => baseArgs,
          };
      }
    };

    const createProvider = (providerName: string, ProviderClass: any) => {
      const { deps, getArgs } = getDependencies(providerName);
      if (deps.every(dep => providers[dep] !== undefined)) {
        const args = getArgs();
        if (args.every(arg => arg !== undefined)) {
          providers[camelCaseName(providerName)] = new ProviderClass(...args);
          return true;
        }
      }
      return false;
    };

    imports.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value && typeof result.value === "object") {
        const ProviderClass = result.value.default;
        if (typeof ProviderClass === "function") {
          const providerName = Object.keys(importMap)[index];
          queue.push([providerName, ProviderClass]);
        }
      }
    });

    let iter = 0;

    while (queue.length > 0) {
      if (iter++ > 100) {
        console.error("Too many iterations", queue);
        break;
      }
      const [providerName, ProviderClass] = queue.shift()!;
      if (!createProvider(providerName, ProviderClass)) {
        queue.push([providerName, ProviderClass]);
      }
    }

    console.log(providers);

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
      statelessPerks: this.providers.perk.provideStateless(
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
