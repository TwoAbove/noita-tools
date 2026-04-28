import { loadWasmExports, type WasmSource } from "./loadWasm";

export interface RngWasmExports extends WebAssembly.Exports {
  SetWorldSeed(seed: number): void;
  GetWorldSeed(): number;
  SetRandomSeed(x: number, y: number): void;
  Random(): number;
  RandomInt(min: number, max: number): number;
  RandomRounded(min: number, max: number): number;
  RandomMax(max: number): number;
  Randomf(): number;
  SeededRandom(seed: number, x: number, y: number): number;
  ProceduralRandomf(x: number, y: number, min: number, max: number): number;
  ProceduralRandomi(x: number, y: number, min: number, max: number): number;
  RandomDistribution(min: number, max: number, mean: number, sharpness: number): number;
  RandomDistributionf(min: number, max: number, mean: number, sharpness: number): number;
  RoundHalfOfEven(value: number): number;
}

export interface AlchemyWasmExports extends WebAssembly.Exports {
  PickAlchemy(worldSeed: number): void;
  GetAlchemyMaterial(index: number): number;
}

export interface FungalWasmExports extends WebAssembly.Exports {
  PickFungal(worldSeed: number, maxShifts: number): number;
  GetFungalFlaskTo(index: number): number;
  GetFungalFlaskFrom(index: number): number;
  GetFungalFromCount(index: number): number;
  GetFungalFromMaterial(index: number, materialIndex: number): number;
  GetFungalTo(index: number): number;
  GetFungalGoldToX(index: number): number;
  GetFungalGrassToX(index: number): number;
}

export const loadRngWasm = (source: WasmSource) => loadWasmExports<RngWasmExports>(source);
export const loadAlchemyWasm = (source: WasmSource) => loadWasmExports<AlchemyWasmExports>(source);
export const loadFungalWasm = (source: WasmSource) => loadWasmExports<FungalWasmExports>(source);
