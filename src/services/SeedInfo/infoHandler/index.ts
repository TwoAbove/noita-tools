import { AlchemyInfoProvider } from './InfoProviders/Alchemy';
import { BiomeInfoProvider } from './InfoProviders/Boime';
import { BiomeModifierInfoProvider } from './InfoProviders/BiomeModifier';
import { FungalInfoProvider } from './InfoProviders/Fungal';
import { InfoProvider } from './InfoProviders/Base';
import { IPerkChangeAction, PerkInfoProvider } from './InfoProviders/Perk';
import { LotteryInfoProvider } from './InfoProviders/Lottery';
// import { MapInfoProvider } from './InfoProviders/Map';
import { MaterialInfoProvider } from './InfoProviders/Material';
import { RainInfoProvider } from './InfoProviders/Rain';
import { ShopInfoProvider } from './InfoProviders/Shop';
import { SpellInfoProvider } from './InfoProviders/Spell';
import { StartingBombSpellInfoProvider } from './InfoProviders/StartingBomb';
import { StartingFlaskInfoProvider } from './InfoProviders/StartingFlask';
import { StartingSpellInfoProvider } from './InfoProviders/StartingSpell';
import { AlwaysCastInfoProvider } from './InfoProviders/AlwaysCast';
import { WaterCaveInfoProvider } from './InfoProviders/WaterCave';

import loadRandom, { IRandom } from '../random';
import { WandInfoProvider } from './InfoProviders/Wand';
import { i18n } from 'i18next';

interface IProviders {
  alchemy: AlchemyInfoProvider;
  alwaysCast: AlwaysCastInfoProvider;
  biome: BiomeInfoProvider;
  biomeModifier: BiomeModifierInfoProvider;
  fungalShift: FungalInfoProvider;
  lottery: LotteryInfoProvider;
  // map: MapInfoProvider;
  material: MaterialInfoProvider;
  perk: PerkInfoProvider;
  rain: RainInfoProvider;
  shop: ShopInfoProvider;
  startingBombSpell: StartingBombSpellInfoProvider;
  startingFlask: StartingFlaskInfoProvider;
  startingSpell: StartingSpellInfoProvider;
  statelessPerk: PerkInfoProvider;
  waterCave: WaterCaveInfoProvider;
  wand: WandInfoProvider;
  [key: string]: InfoProvider;
}

export class GameInfoProvider extends EventTarget {
  randoms!: IRandom;
  ready = false;

  providers!: IProviders;

  config!: IProviderConfig;

  i18n?: i18n;

  constructor(initialConfig: Partial<IProviderConfig>, i18n?: i18n) {
    super();
    this.resetConfig(initialConfig);
    loadRandom().then((randoms) => {
      this.randoms = randoms;
      this.providers = this.buildInfoProviders();
    }).finally(() => {
      this.ready = true;
    });
    this.i18n = i18n;
  }

  onRandomLoad(cb) {
    return new Promise<void>(async res => {
      while (!this.ready) {
        await new Promise(r => setTimeout(r, 10));
      }
      await cb();
      res();
    });
  }

  resetConfig(initialConfig: Partial<IProviderConfig>) {
    this.config = Object.assign({}, {
      seed: 1,
      perkRerolls: new Map(),
      pickedPerks: new Map(),
      perkWorldOffset: 0,
      perkStacks: [[]],
      fungalShifts: []
    }, initialConfig);
    this.dispatchEvent(new CustomEvent('reset', { detail: {} }));
  }

  // This should be a reducer;
  updateConfig(config: Partial<IProviderConfig>) {
    Object.assign(this.config, config);
    this.dispatchEvent(new CustomEvent('update', { detail: {} }));
  }

  buildInfoProviders(): IProviders {
    const providers: any = {
      alchemy: new AlchemyInfoProvider(this.randoms),
      alwaysCast: new AlwaysCastInfoProvider(this.randoms),
      biome: new BiomeInfoProvider(this.randoms),
      biomeModifier: new BiomeModifierInfoProvider(this.randoms),
      fungalShift: new FungalInfoProvider(this.randoms),
      lottery: new LotteryInfoProvider(this.randoms),
      // map: new MapInfoProvider(this.randoms),
      material: new MaterialInfoProvider(this.i18n),
      perk: new PerkInfoProvider(this.randoms),
      rain: new RainInfoProvider(this.randoms),
      spells: new SpellInfoProvider(this.randoms),
      startingBombSpell: new StartingBombSpellInfoProvider(this.randoms),
      startingFlask: new StartingFlaskInfoProvider(this.randoms),
      startingSpell: new StartingSpellInfoProvider(this.randoms),
      statelessPerk: new PerkInfoProvider(this.randoms),
      wand: new WandInfoProvider(this.randoms),
      waterCave: new WaterCaveInfoProvider(this.randoms)
    }

    // shop needs the wand info provider to generate wands
    providers.shop = new ShopInfoProvider(this.randoms, providers.wand);

    return providers as IProviders;
  }

  async provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    this.randoms!.SetWorldSeed(Number(this.config.seed));
    return {
      alchemy: this.providers.alchemy.provide(),
      biomeModifiers: this.providers.biomeModifier.provide(),
      fungalShifts: this.providers.fungalShift.provide(undefined),
      perkDeck: this.providers.perk.getPerkDeck(true),
      perks: this.providers.perk.provide(this.config.pickedPerks, undefined, true, this.config.perkWorldOffset, this.config.perkRerolls),
      statelessPerks: this.providers.statelessPerk.provideStateless(this.config.perkStacks[this.config.perkStacks.length - 1], true),
      rainType: this.providers.rain.provide(),
      shop: this.providers.shop.provide(this.config.pickedPerks, this.config.perkWorldOffset),
      startingBombSpell: this.providers.startingBombSpell.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      waterCave: this.providers.waterCave.provide()
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
