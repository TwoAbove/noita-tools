/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { includesAll, isNode, simd } from "../../../../helpers";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

import createModule from "./Map.mjs";
import type { MainModule } from "./Map.d";

export class MapModuleInfoProvider extends InfoProvider {
  readyPromise: Promise<void>;

  map!: MainModule;

  constructor(randoms: InfoProvider["randoms"]) {
    super(randoms);

    this.readyPromise = this.loadWasm();
  }

  async ready(): Promise<void> {
    return this.readyPromise;
  }

  async loadWasm() {
    let wasmModule: string;
    if (isNode) {
      const wasmPath = new URL("./Map.wasm", import.meta.url).href;
      wasmModule = new URL(wasmPath, import.meta.url).href;
    } else {
      const hasSIMD = await simd();
      wasmModule = hasSIMD
        ? new URL("./Map.wasm", import.meta.url).href
        : new URL("./Map-base.wasm", import.meta.url).href;
    }

    const Module = await createModule({
      locateFile(path: string) {
        if (path.endsWith(".wasm")) {
          return wasmModule;
        }
        return path;
      },
    });
    this.map = Module;
  }

  provide() {
    const worldSeed = this.randoms.GetWorldSeed();
    // TODO: Figure out what to do here.
    // const res = this.map.wang_main(worldSeed);
    return {};
  }

  test(rule: IRule): boolean {
    return true;
  }
}

export default MapModuleInfoProvider;
