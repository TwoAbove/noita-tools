import createModule from '../noita_random/noita_random.js';
// import noitaRandomModule from '../noita_random/noita_random.wasm';
import { IRandomModule, genRandom } from './random';

const loadWasm = async () => {
  const noitaRandomModule = typeof process === 'object' && typeof require === 'function' ? '../noita_random/noita_random.wasm' : (await import('../noita_random/noita_random.wasm')).default;

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
