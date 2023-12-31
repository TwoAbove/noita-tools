import { isNode, simd } from "../../helpers";
import createModule from "../noita_random/noita_random.mjs";
// import noitaRandomModule from '../noita_random/noita_random.wasm';
import { IRandomModule, genRandom } from "./random";

const loadNodeWasm = async () => {
  let wasmPath = new URL("../noita_random/noita_random.wasm", import.meta.url).href;
  const Module: IRandomModule = await createModule({
    locateFile(path) {
      if (path.endsWith(".wasm")) {
        return wasmPath;
      }
      return path;
    },
  });
  return Module;
};

const loadWasm = async () => {
  if (isNode) {
    return loadNodeWasm();
  }

  const hasSIMD = await simd();

  const noitaRandomModule = hasSIMD
    ? new URL("../noita_random/noita_random.wasm", import.meta.url).href
    : new URL("../noita_random/noita_random-base.wasm", import.meta.url).href;

  const Module: IRandomModule = await createModule({
    locateFile(path) {
      if (path.endsWith(".wasm")) {
        return noitaRandomModule;
      }
      return path;
    },
  });
  return Module;
};

const load = async () => {
  const Module = await loadWasm();
  return genRandom(Module);
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
