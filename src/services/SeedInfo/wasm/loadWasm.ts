type WasmSource = string | ArrayBuffer | Uint8Array;

const isNodeRuntime = () => typeof process === "object" && !!process.versions?.node;
const nodeFsPromises = "node:fs/promises";

const loadBytes = async (source: WasmSource) => {
  if (typeof source !== "string") {
    return source;
  }

  if (isNodeRuntime()) {
    const { readFile } = await import(/* @vite-ignore */ nodeFsPromises);
    return readFile(new URL(source));
  }

  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Failed to load wasm from ${source}: ${response.status} ${response.statusText}`);
  }
  return response.arrayBuffer();
};

export const loadWasmExports = async <T extends WebAssembly.Exports>(
  source: WasmSource,
  imports: WebAssembly.Imports = {},
) => {
  const bytes = await loadBytes(source);
  const { instance } = await WebAssembly.instantiate(bytes, imports);
  return instance.exports as T;
};

export type { WasmSource };
