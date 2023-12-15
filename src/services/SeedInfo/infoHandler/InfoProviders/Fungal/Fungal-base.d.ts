export interface VectorString {
  size(): number;
  push_back(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
  resize(_0: number, _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
  set(_0: number, _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  get(_0: number): any;
  delete(): void;
}

export interface VectorFungalTransformation {
  size(): number;
  push_back(_0: FungalTransformation): void;
  resize(_0: number, _1: FungalTransformation): void;
  set(_0: number, _1: FungalTransformation): boolean;
  get(_0: number): any;
  delete(): void;
}

export type FungalTransformation = {
  flaskTo: boolean;
  flaskFrom: boolean;
  from: VectorString;
  to: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
};

export interface MainModule {
  VectorString: { new (): VectorString };
  VectorFungalTransformation: { new (): VectorFungalTransformation };
  PickForSeed(_0: number, _1: number): VectorFungalTransformation;
}
