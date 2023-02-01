import { simd } from 'wasm-feature-detect';

import createModule from '../noita_random/noita_random.js';
// import noitaRandomModule from '../noita_random/noita_random.wasm';
import { IRandomModule, genRandom } from './random';

const isNode = typeof process === 'object' && typeof require === 'function';

const loadNodeWasm = async () => {
  let wasmPath = '../noita_random/noita_random.wasm';

  const Module: IRandomModule = await createModule({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        return wasmPath;
      }
      return path;
    }
  });
  return Module;
}

const loadWasm = async () => {
  if (isNode) { return loadNodeWasm(); }

  const hasSIMD = await simd();

  const noitaRandomModule = hasSIMD ? (await import('../noita_random/noita_random.wasm')).default : (await import('../noita_random/noita_random-base.wasm')).default;

  const Module: IRandomModule = await createModule({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        return noitaRandomModule;
      }
      return path;
    }
  });
  return Module;
};

const load = async () => {
  const Module = await loadWasm();
  return genRandom(Module) as any;
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
