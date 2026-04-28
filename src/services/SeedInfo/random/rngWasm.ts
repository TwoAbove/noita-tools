import type { IRandomModule } from "./random";
import { loadRngWasm, type RngWasmExports } from "../wasm/compiled";
import type { WasmSource } from "../wasm/loadWasm";

export const loadRngModule = (source: WasmSource) => loadRngWasm(source);

export const withRngWasm = (module: IRandomModule, rngWasm: RngWasmExports): IRandomModule => {
  const setMapWorldSeed = module.SetWorldSeed.bind(module);
  const random = (...args: number[]) => {
    if (args.length === 0) {
      return rngWasm.Random();
    }
    if (args.length === 1) {
      return rngWasm.RandomMax(args[0]);
    }
    return Number.isInteger(args[0]) && Number.isInteger(args[1])
      ? rngWasm.RandomInt(args[0], args[1])
      : rngWasm.RandomRounded(args[0], args[1]);
  };

  module.Random = random as IRandomModule["Random"];
  module.Randomf = rngWasm.Randomf;
  module.SeededRandom = rngWasm.SeededRandom;
  module.RandomDistribution = rngWasm.RandomDistribution;
  module.RandomDistributionf = rngWasm.RandomDistributionf;
  module.ProceduralRandomf = rngWasm.ProceduralRandomf;
  module.ProceduralRandomi = rngWasm.ProceduralRandomi;
  module.SetRandomSeed = rngWasm.SetRandomSeed;
  module.SetWorldSeed = (seed: number) => {
    setMapWorldSeed(seed);
    rngWasm.SetWorldSeed(seed);
  };
  module.GetWorldSeed = rngWasm.GetWorldSeed;
  module.RoundHalfOfEven = rngWasm.RoundHalfOfEven;

  return module;
};
