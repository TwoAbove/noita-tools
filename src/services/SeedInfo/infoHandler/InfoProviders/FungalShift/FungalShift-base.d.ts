// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
    let HEAPF32: any;
    let HEAPF64: any;
    let HEAP_DATA_VIEW: any;
    let HEAP8: any;
    let HEAPU8: any;
    let HEAP16: any;
    let HEAPU16: any;
    let HEAP32: any;
    let HEAPU32: any;
    let HEAP64: any;
    let HEAPU64: any;
}
interface WasmModule {
  _malloc(_0: number): number;
  _free(_0: number): void;
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  clone(): this;
}
export interface VectorString extends ClassHandle {
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  size(): number;
  get(_0: number): EmbindString | undefined;
  set(_0: number, _1: EmbindString): boolean;
}

export type FungalTransformation = {
  flaskTo: boolean,
  flaskFrom: boolean,
  from: VectorString,
  to: EmbindString,
  gold_to_x: EmbindString,
  grass_to_x: EmbindString
};

export interface VectorFungalTransformation extends ClassHandle {
  push_back(_0: FungalTransformation): void;
  resize(_0: number, _1: FungalTransformation): void;
  size(): number;
  get(_0: number): FungalTransformation | undefined;
  set(_0: number, _1: FungalTransformation): boolean;
}

interface EmbindModule {
  VectorString: {
    new(): VectorString;
  };
  VectorFungalTransformation: {
    new(): VectorFungalTransformation;
  };
  PickForSeed(_0: number, _1: number): VectorFungalTransformation;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
