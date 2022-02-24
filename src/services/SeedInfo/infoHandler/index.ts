import { AlchemyInfoProvider } from './InfoProviders/Alchemy';
import { InfoProvider } from './InfoProviders/Base';
import { BiomeModifierInfoProvider } from './InfoProviders/BiomeModifier';
import { BiomeInfoProvider } from './InfoProviders/Boime';
import { FungalInfoProvider } from './InfoProviders/Fungal';
import { LotteryInfoProvider } from './InfoProviders/Lottery';
import { MaterialInfoProvider } from './InfoProviders/Material';
import { IPerkChangeAction, PerkInfoProvider } from './InfoProviders/Perk';
import { RainInfoProvider } from './InfoProviders/Rain';
import { ShopInfoProvider } from './InfoProviders/Shop';
import { SpellInfoProvider } from './InfoProviders/Spell';
import { StartingBombSpellInfoProvider } from './InfoProviders/StartingBomb';
import { StartingFlaskInfoProvider } from './InfoProviders/StartingFlask';
import { StartingSpellInfoProvider } from './InfoProviders/StartingSpell';

import loadRandom, { IRandom } from '../random';
import { WandInfoProvider } from './InfoProviders/Wand';

interface IProviders {
  shop: ShopInfoProvider;
  alchemy: AlchemyInfoProvider;
  rain: RainInfoProvider;
  startingFlask: StartingFlaskInfoProvider;
  startingSpell: StartingSpellInfoProvider;
  startingBombSpell: StartingBombSpellInfoProvider;
  perk: PerkInfoProvider;
  lottery: LotteryInfoProvider;
  fungalShift: FungalInfoProvider;
  biomeModifier: BiomeModifierInfoProvider;
  biome: BiomeInfoProvider;
  material: MaterialInfoProvider;
  wand: WandInfoProvider;
  [key: string]: InfoProvider;
}

export class GameInfoProvider extends EventTarget {
  randoms!: IRandom;
  ready = false;

  providers!: IProviders;

  config!: IProviderConfig;

  constructor(initialConfig: Partial<IProviderConfig>) {
    super()
    this.resetConfig(initialConfig);
    loadRandom().then((randoms) => {
      this.randoms = randoms;
      this.providers = this.buildInfoProviders();
      this.ready = true;
    });
  }

  resetConfig(initialConfig: Partial<IProviderConfig>) {
    this.config = Object.assign({}, {
      seed: 1,
      perkRerolls: new Map(),
      pickedPerks: new Map(),
      perkWorldOffset: 0,
      perkStack: []
    }, initialConfig);
    this.dispatchEvent(new CustomEvent('update', { detail: {} }));
  }

  // This should be a reducer;
  updateConfig(config: Partial<IProviderConfig>) {
    Object.assign(this.config, config);
    this.dispatchEvent(new CustomEvent('update', { detail: {} }));
  }

  buildInfoProviders(): IProviders {
    const providers: any = {
      alchemy: new AlchemyInfoProvider(this.randoms),
      rain: new RainInfoProvider(this.randoms),
      startingFlask: new StartingFlaskInfoProvider(this.randoms),
      startingSpell: new StartingSpellInfoProvider(this.randoms),
      startingBombSpell: new StartingBombSpellInfoProvider(this.randoms),
      perk: new PerkInfoProvider(this.randoms),
      lottery: new LotteryInfoProvider(this.randoms),
      fungalShift: new FungalInfoProvider(this.randoms),
      biomeModifier: new BiomeModifierInfoProvider(this.randoms),
      spells: new SpellInfoProvider(this.randoms),
      biome: new BiomeInfoProvider(this.randoms),
      material: new MaterialInfoProvider(this.randoms),
      wand: new WandInfoProvider(this.randoms)
    }

    // shop needs the wand info provider to generate wands
    providers.shop = new ShopInfoProvider(this.randoms, providers.wand);

    return providers as IProviders;
  }

  provideAll() {
    // I think the c++ code should be immutable. Idea for next refactor.
    this.randoms!.SetWorldSeed(Number(this.config.seed));
    return {
      alchemy: this.providers.alchemy.provide(),
      rainType: this.providers.rain.provide(),
      startingFlask: this.providers.startingFlask.provide(),
      startingSpell: this.providers.startingSpell.provide(),
      startingBombSpell: this.providers.startingBombSpell.provide(),
      shop: this.providers.shop.provide(this.config.pickedPerks, this.config.perkWorldOffset),
      perks: this.providers.perk.provide(this.config.pickedPerks, undefined, true, this.config.perkWorldOffset, this.config.perkRerolls),
      statefulPerks: this.providers.perk.provideStateful(this.config.perkStack, true),
      perkDeck: this.providers.perk.getPerkDeck(true),
      fungalShifts: this.providers.fungalShift.provide(undefined),
      biomeModifiers: this.providers.biomeModifier.provide()
    };
  }
}

interface IProviderConfig {
  seed: number;
  perkRerolls: Map<number, number[]>;
  pickedPerks: Map<number, string[][]>;
  perkWorldOffset: number;
  perkStack: IPerkChangeAction[];
}

export default GameInfoProvider;
