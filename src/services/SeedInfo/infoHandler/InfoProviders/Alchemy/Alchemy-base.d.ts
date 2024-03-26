// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
  _malloc(_0: number): number;
  _free(_0: number): void;
}

interface EmbindModule {
  PickForSeed(_0: number): string;
}
export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
