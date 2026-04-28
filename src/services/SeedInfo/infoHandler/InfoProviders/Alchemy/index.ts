import { includesAll } from "../../../../helpers";
import { loadAlchemyWasm, type AlchemyWasmExports } from "../../../wasm/compiled";
import { materialName } from "../../../wasm/materials";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

export class AlchemyInfoProvider extends InfoProvider {
  readyPromise: Promise<void>;

  alchemy!: AlchemyWasmExports;

  constructor(randoms: InfoProvider["randoms"]) {
    super(randoms);

    this.readyPromise = this.loadWasm();
  }

  async ready(): Promise<void> {
    return this.readyPromise;
  }

  async loadWasm() {
    this.alchemy = await loadAlchemyWasm(new URL("./Alchemy.wasm", import.meta.url).href);
  }

  provide() {
    const worldSeed = this.randoms.GetWorldSeed();
    this.alchemy.PickAlchemy(worldSeed);

    return {
      LC: [0, 1, 2].map(index => materialName(this.alchemy.GetAlchemyMaterial(index))),
      AP: [3, 4, 5].map(index => materialName(this.alchemy.GetAlchemyMaterial(index))),
    };
  }

  test(rule: IRule): boolean {
    const info = this.provide();
    const allLC = includesAll(rule.val.LC.map(String), info.LC);
    const allAP = includesAll(rule.val.AP.map(String), info.AP);
    return allLC && allAP;
  }
}

export default AlchemyInfoProvider;
