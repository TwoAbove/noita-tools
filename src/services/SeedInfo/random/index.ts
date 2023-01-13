import createModule from '../noita_random/noita_random.js';
// import noitaRandomModule from '../noita_random/noita_random.wasm';
import { IRandomModule, genRandom } from './random';

const loadWasm = async () => {
  const noitaRandomModule = global.window ? (await import('../noita_random/noita_random.wasm')).default : '../noita_random/noita_random.wasm';
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
