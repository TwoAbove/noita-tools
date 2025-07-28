// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
  _free(_0: number): void;
  _malloc(_0: number): number;
  _generate_path_map(_0: number, _1: number, _2: number, _3: number, _4: number, _5: number): void;
}

type EmbindString = ArrayBuffer|Uint8Array|Uint8ClampedArray|Int8Array|string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  // @ts-ignore - If targeting lower than ESNext, this symbol might not exist.
  [Symbol.dispose](): void;
  clone(): this;
}
export interface MapUIntUInt extends ClassHandle {
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): void;
  keys(): UIntVector;
}

export interface IntVector extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface UIntVector extends ClassHandle {
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  size(): number;
  get(_0: number): number | undefined;
  set(_0: number, _1: number): boolean;
}

export interface MapHandler extends ClassHandle {
  width: number;
  height: number;
  map: number;
  bigMap: number;
  generate_map(_0: EmbindString): void;
  iterateMap(_0: number, _1: number, _2: any): void;
  somePixels(_0: number, _1: number, _2: number, _3: number, _4: any): boolean;
  getMap(): string;
  toBig(): void;
  drawImageData(_0: EmbindString, _1: EmbindString, _2: number, _3: number, _4: number): void;
}

interface EmbindModule {
  MapUIntUInt: {
    new(): MapUIntUInt;
  };
  Random(_0: number, _1: number): number;
  Random(_0: number, _1: number): number;
  Random(_0: number): number;
  Random(): number;
  Randomf(): number;
  ProceduralRandomf(_0: number, _1: number, _2: number, _3: number): number;
  ProceduralRandomi(_0: number, _1: number, _2: number, _3: number): number;
  SetRandomSeed(_0: number, _1: number): void;
  SetWorldSeed(_0: number): void;
  GetWorldSeed(): number;
  RandomDistributionf(_0: number, _1: number, _2: number, _3: number): number;
  RandomDistribution(_0: number, _1: number, _2: number, _3: number): number;
  GetRandomActionWithType(_0: number, _1: number, _2: number, _3: number, _4: number): string;
  GetRandomAction(_0: number, _1: number, _2: number, _3: number): string;
  RoundHalfOfEven(_0: number): number;
  GetWidthFromPix(_0: number, _1: number): number;
  GetWidthFromPixWithOffset(_0: number, _1: number, _2: number): number;
  IntVector: {
    new(): IntVector;
  };
  UIntVector: {
    new(): UIntVector;
  };
  GetGlobalPos(_0: number, _1: number): IntVector;
  GetTilePos(_0: number, _1: number): IntVector;
  SetUnlockedSpells(_0: number, _1: number): void;
  MapHandler: {
    new(_0: number, _1: number, _2: number, _3: boolean, _4: boolean, _5: number, _6: number, _7: number): MapHandler;
  };
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
