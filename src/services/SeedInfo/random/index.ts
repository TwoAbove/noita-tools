import { loadMapWasmModule } from "../noita_random/mapWasm";
import { genRandom } from "./random";
import { loadRngModule, withRngWasm } from "./rngWasm";

const loadWasm = async () => {
  const mapWasm = new URL("../noita_random/noita_random.wasm", import.meta.url).href;
  return loadMapWasmModule(mapWasm);
};

const load = async () => {
  const Module = await loadWasm();
  const rngWasmUrl = new URL("../wasm/rng.wasm", import.meta.url).href;
  const rngWasm = await loadRngModule(rngWasmUrl);
  return genRandom(withRngWasm(Module, rngWasm));
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
