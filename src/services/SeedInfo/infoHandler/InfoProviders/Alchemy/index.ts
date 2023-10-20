/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { includesAll, isNode, simd } from "../../../../helpers";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

import createModule from "./Alchemy.js";

interface IAlchemyModule {
  PickForSeed(seed: number): string;
}

export class AlchemyInfoProvider extends InfoProvider {
  readyPromise: Promise<void>;

  alchemy!: IAlchemyModule;

  constructor(randoms) {
    super(randoms);

    this.readyPromise = this.loadWasm();
  }

  async ready(): Promise<void> {
    return this.readyPromise;
  }

  async loadWasm() {
    // Unfortunately, I couldn't get dynamic imports to work with wasm modules
    // I think it's because of bundling and supporting both node and browser
    // and using a CRA template from 5 years ago.
    // So in all info providers, I have to import the wasm module like this
    // with the path hardcoded and lots of duplicate code :(
    let noitaRandomModule;
    if (isNode) {
      // Must be in the same folder as this file
      // or else esbuild will not bundle it with the correct path
      const wasmPath = (await import("./Alchemy.wasm")).default;
      noitaRandomModule = new URL(wasmPath, import.meta.url).href;
    } else {
      const hasSIMD = await simd();
      noitaRandomModule = hasSIMD
        ? (await import("./Alchemy.wasm")).default
        : (await import("./Alchemy-base.wasm")).default;
    }

    const Module = await createModule({
      locateFile(path) {
        if (path.endsWith(".wasm")) {
          return noitaRandomModule;
        }
        return path;
      },
    });
    this.alchemy = Module;
  }

  provide() {
    const worldSeed = this.randoms.GetWorldSeed();
    const res = this.alchemy.PickForSeed(worldSeed);
    const [LC, AP] = res.split(";");
    return {
      LC: LC.split(":")[1].split(","),
      AP: AP.split(":")[1].split(","),
    };
  }

  test(rule: IRule): boolean {
    let info = this.provide();
    const allLC = includesAll(rule.val.LC.map(String), info.LC);
    const allAP = includesAll(rule.val.AP.map(String), info.AP);
    return allLC && allAP;
  }
}
