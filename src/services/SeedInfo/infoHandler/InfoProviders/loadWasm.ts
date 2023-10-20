import { isNode, simd } from "../../../helpers";

const loadNodeWasm = async (path: string) => {
  let wasmPath = (await import(path)).default;
  const Module = await WebAssembly.instantiate(await import(wasmPath));
  return Module;
};

export const loadWasm = async (path: string) => {
  if (isNode) {
    return loadNodeWasm(path);
  }

  const hasSIMD = await simd();

  const noitaRandomModule = hasSIMD
    ? (await import(path)).default
    : (await import(path.replace(".wasm", "-base.wasm"))).default;

  const Module = await WebAssembly.instantiate(await import(noitaRandomModule));
  return Module;
};
