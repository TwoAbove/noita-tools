import createModule from '../noita_random/noita_random.js';
// import noitaRandomModule from '../noita_random/noita_random.wasm';
import { IRandomModule, genRandom } from './random';

const simd = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]))

const isNode = typeof process === 'object' && typeof require === 'function';

const loadNodeWasm = async () => {
  let wasmPath = (await import('../noita_random/noita_random.wasm')).default
  const Module: IRandomModule = await createModule({
    locateFile(path) {
      if (path.endsWith('.wasm')) {
        return new URL(wasmPath as any, import.meta.url).href;
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
  return genRandom(Module);
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
