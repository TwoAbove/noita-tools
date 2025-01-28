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
        perksAdvanced: false,
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
      alchemy: () => import("./InfoProviders/Alchemy"),
      alwaysCast: () => import("./InfoProviders/AlwaysCast"),
      biome: () => import("./InfoProviders/Biome"),
      biomeModifier: () => import("./InfoProviders/BiomeModifier"),
      fungalShift: () => import("./InfoProviders/FungalShift"),
      lottery: () => import("./InfoProviders/Lottery"),
      map: () => import("./InfoProviders/Map"),
      material: () => import("./InfoProviders/Material"),
      perk: () => import("./InfoProviders/Perk"),
      weather: () => import("./InfoProviders/Weather"),
      shop: () => import("./InfoProviders/Shop"),
      spells: () => import("./InfoProviders/Spell"),
      startingBombSpell: () => import("./InfoProviders/StartingBomb"),
      startingFlask: () => import("./InfoProviders/StartingFlask"),
      startingSpell: () => import("./InfoProviders/StartingSpell"),
      waterCave: () => import("./InfoProviders/WaterCave"),
      wand: () => import("./InfoProviders/Wand"),
      potion: () => import("./InfoProviders/Potion"),
      potionSecret: () => import("./InfoProviders/PotionSecret"),
      potionRandomMaterial: () => import("./InfoProviders/PotionRandomMaterial"),
      powderStash: () => import("./InfoProviders/PowderStash"),
      chestRandom: () => import("./InfoProviders/ChestRandom"),
      pacifistChest: () => import("./InfoProviders/PacifistChest"),
      excavationsiteCubeChamber: () => import("./InfoProviders/ExcavationsiteCubeChamber"),
      snowcaveSecretChamber: () => import("./InfoProviders/SnowcaveSecretChamber"),
      snowcastleSecretChamber: () => import("./InfoProviders/SnowcastleSecretChamber"),
    };

    const imports = await Promise.allSettled(
      Object.entries(importMap).map(([key, importFunc]) =>
        importFunc()
          .then(module => ({ key, module }))
          .catch(e => {
            console.error(e);
            return { key, module: null };
          }),
      ),
    );

    const providers: Partial<IProviders> = {};
    const queue: [string, any][] = [];

    const getDependencies = (providerKey: string): { deps: string[]; getArgs: () => any[] } => {
      const baseArgs = [this.randoms];
      switch (providerKey) {
        case "chestRandom":
          return {
            deps: ["spells"],
            getArgs: () => [...baseArgs, this.unlockedSpells, providers.spells],
          };
        case "pacifistChest":
          return {
            deps: ["chestRandom"],
            getArgs: () => [...baseArgs, providers.chestRandom],
          };
        case "shop":
          return {
            deps: ["wand", "spells"],
            getArgs: () => [...baseArgs, providers.wand, providers.spells],
          };
        case "excavationsiteCubeChamber":
        case "snowcaveSecretChamber":
          return {
            deps: ["map", "wand"],
            getArgs: () => [...baseArgs, providers.map, providers.wand],
          };
        case "snowcastleSecretChamber":
          return {
            deps: ["map"],
            getArgs: () => [...baseArgs, providers.map],
          };
        case "material":
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

    const createProvider = (providerKey: string, ProviderClass: any) => {
      const { deps, getArgs } = getDependencies(providerKey);
      if (deps.every(dep => providers[dep] !== undefined)) {
        const args = getArgs();
        if (args.every(arg => arg !== undefined)) {
          providers[providerKey] = new ProviderClass(...args);
          return true;
        }
      }
      return false;
    };

    imports.forEach(result => {
      if (result.status === "fulfilled" && result.value.module) {
        const { key, module } = result.value;
        const ProviderClass = module.default;
        if (typeof ProviderClass === "function") {
          queue.push([key, ProviderClass]);
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

    return providers as IProviders;
  }

  async provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    const worldSeed = Number(this.config.seed);
    this.randoms!.SetWorldSeed(worldSeed);

    const statelessPerks = this.providers.perk.provideStateless(
      this.config.perkStacks[this.config.perkStacks.length - 1],
      true,
    );

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
      statelessPerks: statelessPerks,
      weather: this.providers.weather.provide(),
      shop: this.providers.shop.provide(
        this.config.perksAdvanced ? statelessPerks.pickedState : this.config.pickedPerks,
        this.config.perkWorldOffset,
      ),
      startingBombSpell: this.providers.startingBombSpell.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      waterCave: this.providers.waterCave.provide(),
    };
  }
}

interface IProviderConfig {
  seed: number;
  perksAdvanced: boolean;
  perkRerolls: Map<number, number[]>;
  pickedPerks: Map<number, string[][]>;
  perkWorldOffset: number;
  perkStacks: IPerkChangeAction[][];
  fungalShifts: boolean[];
}

export default GameInfoProvider;
