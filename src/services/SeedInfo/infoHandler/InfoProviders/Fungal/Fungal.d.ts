// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
  _malloc(_0: number): number;
  _free(_0: number): void;
}

export interface VectorString {
  size(): number;
  get(_0: number): ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string | undefined;
  push_back(_0: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string): void;
  resize(_0: number, _1: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string): void;
  set(_0: number, _1: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string): boolean;
  delete(): void;
}

export interface VectorFungalTransformation {
  size(): number;
  get(_0: number): FungalTransformation | undefined;
  push_back(_0: FungalTransformation): void;
  resize(_0: number, _1: FungalTransformation): void;
  set(_0: number, _1: FungalTransformation): boolean;
  delete(): void;
}

export type FungalTransformation = {
  flaskTo: boolean,
  flaskFrom: boolean,
  from: VectorString,
  to: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string,
  gold_to_x: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string,
  grass_to_x: ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string
};

interface EmbindModule {
  VectorString: {new(): VectorString};
  VectorFungalTransformation: {new(): VectorFungalTransformation};
  PickForSeed(_0: number, _1: number): VectorFungalTransformation;
}
export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
