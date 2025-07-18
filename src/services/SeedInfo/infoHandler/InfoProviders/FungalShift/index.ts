/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import fungalMaterialsData from "../../../data/fungal-materials.json";
import { includesSome, isNode, simd } from "../../../../helpers";
import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

import type { FungalTransformation, MainModule, VectorString } from "./FungalShift.d.ts";

import createModule from "./FungalShift.mjs";

type CorrectedFungalTransformation = Omit<FungalTransformation, "from" | "to" | "gold_to_x" | "grass_to_x"> & {
  from: string[];
  to: string;
  gold_to_x: string;
  grass_to_x: string;
};

export class FungalShiftInfoProvider extends InfoProvider {
  readyPromise: Promise<void>;

  fungal!: MainModule;
  fungalData = fungalMaterialsData;

  constructor(randoms: InfoProvider["randoms"]) {
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
    let noitaRandomModule: string;
    if (isNode) {
      // Must be in the same folder as this file
      // or else esbuild will not bundle it with the correct path
      const wasmPath = new URL("./FungalShift.wasm", import.meta.url).href;
      noitaRandomModule = new URL(wasmPath, import.meta.url).href;
    } else {
      const hasSIMD = await simd();
      noitaRandomModule = hasSIMD
        ? new URL("./FungalShift.wasm", import.meta.url).href
        : new URL("./FungalShift-base.wasm", import.meta.url).href;
    }

    const Module = await createModule({
      locateFile(path: string) {
        if (path.endsWith(".wasm")) {
          return noitaRandomModule;
        }
        return path;
      },
    });
    this.fungal = Module as MainModule;
  }

  provide() {
    const worldSeed = this.randoms.GetWorldSeed();
    const res = this.fungal.PickForSeed(worldSeed, 20);
    const fungalData: CorrectedFungalTransformation[] = [];
    for (let i = 0; i < res.size(); i++) {
      const item = res.get(i) as FungalTransformation;
      const from: string[] = [];
      for (let j = 0; j < item.from.size(); j++) {
        from.push(item.from.get(j)?.toString() ?? "");
      }
      fungalData.push({
        flaskTo: item.flaskTo,
        flaskFrom: item.flaskFrom,
        from: from,
        to: item.to?.toString() ?? "",
        gold_to_x: item.gold_to_x?.toString() ?? "",
        grass_to_x: item.grass_to_x?.toString() ?? "",
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
      console.log(grass_to_x, info[i].grass_to_x, grass_to_x?.valueOf() !== info[i].grass_to_x.valueOf());
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
