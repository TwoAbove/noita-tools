import fungalMaterialsData from "../../../data/fungal-materials.json";
import { includesSome } from "../../../../helpers";
import { loadFungalWasm, type FungalWasmExports } from "../../../wasm/compiled";
import { materialName } from "../../../wasm/materials";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

type FungalTransformation = {
  flaskTo: boolean;
  flaskFrom: boolean;
  from: string[];
  to: string;
  gold_to_x: string;
  grass_to_x: string;
};

export class FungalShiftInfoProvider extends InfoProvider {
  readyPromise: Promise<void>;

  fungal!: FungalWasmExports;
  fungalData = fungalMaterialsData;

  constructor(randoms: InfoProvider["randoms"]) {
    super(randoms);

    this.readyPromise = this.loadWasm();
  }

  async ready(): Promise<void> {
    return this.readyPromise;
  }

  async loadWasm() {
    this.fungal = await loadFungalWasm(new URL("./FungalShift.wasm", import.meta.url).href);
  }

  provide() {
    const worldSeed = this.randoms.GetWorldSeed();
    const shiftCount = this.fungal.PickFungal(worldSeed, 20);
    const fungalData: FungalTransformation[] = [];

    for (let i = 0; i < shiftCount; i++) {
      const from: string[] = [];
      const fromCount = this.fungal.GetFungalFromCount(i);
      for (let j = 0; j < fromCount; j++) {
        from.push(materialName(this.fungal.GetFungalFromMaterial(i, j)));
      }

      fungalData.push({
        flaskTo: Boolean(this.fungal.GetFungalFlaskTo(i)),
        flaskFrom: Boolean(this.fungal.GetFungalFlaskFrom(i)),
        from,
        to: materialName(this.fungal.GetFungalTo(i)),
        gold_to_x: materialName(this.fungal.GetFungalGoldToX(i)),
        grass_to_x: materialName(this.fungal.GetFungalGrassToX(i)),
      });
    }
    return fungalData;
  }

  test(rule: IRule<IFungalRule>): boolean {
    const info = this.provide();
    if (!rule.val) {
      return false;
    }
    for (let i = 0; i < info.length; i++) {
      if (!rule.val[i]) {
        continue;
      }

      const flaskTo = rule.val[i].flaskTo;
      if (flaskTo && flaskTo !== info[i].flaskTo) {
        return false;
      }

      const flaskFrom = rule.val[i].flaskFrom;
      if (flaskFrom && flaskFrom !== info[i].flaskFrom) {
        return false;
      }

      const gold_to_x = rule.val[i].gold_to_x;
      if (gold_to_x && gold_to_x.valueOf() !== info[i].gold_to_x.valueOf()) {
        return false;
      }

      const grass_to_x = rule.val[i].grass_to_x;
      if (grass_to_x && grass_to_x.valueOf() !== info[i].grass_to_x.valueOf()) {
        return false;
      }

      const from = rule.val[i].from;
      if (
        from &&
        !includesSome(
          from.flatMap(l => l.split(",")),
          info[i].from,
        )
      ) {
        return false;
      }

      const to = rule.val[i].to;
      if (to && to.length > 0 && !to.includes(info[i].to)) {
        return false;
      }
    }
    return true;
  }
}

export type IFungalRule = Array<{
  from?: string[];
  to?: string;
  flaskFrom?: boolean;
  flaskTo?: boolean;
  gold_to_x?: string;
  grass_to_x?: string;
}>;

export default FungalShiftInfoProvider;
