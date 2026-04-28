import D, { Decimal } from "decimal.js";
import cloneDeep from "lodash/cloneDeep.js";

export type WasmAllocation = {
  ptr: number;
  delete(): void;
  valueOf(): number;
  [Symbol.toPrimitive](): number;
};

export class MapHandler {
  map!: number;
  bigMap!: number;

  constructor(
    public width: number,
    public height: number,
    public color: number,
    public isCoalMine: boolean,
    public shouldBlockOutRooms: boolean,
    public randomMaterials: number,
    public worldX: number,
    public worldY: number,
  ) {}

  delete() {}
  generate_map(rgba_tiles_b64: string) {}
  iterateMap(x: number, y: number, cb: (gx: number, gy: number, color: number) => void) {}
  somePixels(
    map_ptr: number,
    width: number,
    height: number,
    stet: number,
    cb: (x: number, y: number, color: number) => boolean,
  ) {
    return Boolean();
  }
  getMap() {
    return String();
  }
  toBig() {}
  drawImageData(path: string, impl: string, gx: number, gy: number, color_to_material_table: number | WasmAllocation) {}
}
export interface IRandomModule {
  HEAPU32: any;
  Module: any;

  printErr?: any;
  print?: any;

  doLeakCheck?: () => void;

  ProceduralRandomf(arg0: number, arg1: number, arg2: number, arg3: number): number;

  RoundHalfOfEven(number): number;

  Randomf(): number;

  Random(arg0: number, arg1: number): number;
  Random(arg0: number): number;
  Random(): number;

  ProceduralRandomi(arg0: number, arg1: number, arg2: number, arg3: number): number;

  RandomDistribution(min: number, max: number, mean: number, sharpness?: number, baseline?: number): number;

  RandomDistributionf(min: number, max: number, mean: number, sharpness?: number, baseline?: number): number;

  SetRandomSeed(arg0: number, arg1: number): void;

  SetWorldSeed(arg0: number): void;
  GetWorldSeed(): number;
  SeededRandom?(seed: number, x: number, y: number): number;

  GetRandomAction(x: number, y: number, level: number, i: number): string;

  GetRandomActionWithType(x: number, y: number, level: number, type: number, i: number): string;

  _malloc(number): number;
  _free(number): number;

  HEAPU8: any;

  GenerateMap(
    mapData: any,
    color: number,
    w: number,
    h: number,
    result: any,
    xs: number,
    ys: number,
    isCoalMine: boolean,
    shouldBlockOutRooms: boolean,
    randomMaterials: number,
    xOffset: number,
    yOffset: number,
  ): void;

  GetGlobalPos(x: number, y: number): { get: (number) => number };
  GetLocalPos?: (x: number, y: number, gx: number, gy: number) => { get: (number) => number };
  GetTilePos(gx: number, gy: number): { get: (number) => number };
  GeneratePathMap(...args): void;

  SetUnlockedSpells?(i: number, val: number): void;
  GetWidthFromPix(x1: number, x2: number): number;
  GetWidthFromPixWithOffset(x1: number, x2: number, offset: number): number;

  MapHandler: typeof MapHandler;

  objToColorToMaterialTablePtr: (obj: any) => WasmAllocation;
}

interface IRND {
  x: number;
  y: number;
}

export const genRandom = async (Module: IRandomModule) => {
  const spells = (await import("../data/spells.json")).default;
  const spellsArr = spells as Array<{
    id: string;
    type: number;
    spawn_probabilities: Partial<Record<string, number>>;
  }>;
  let unlockedSpells: boolean[] = [];

  Module.print = function (text) {
    if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
    console.warn(text);
  };

  Module.printErr = Module.print;

  const randomFromArray = <T>(arr: T[]) => {
    const i = Module.Random(0, arr.length - 1);
    return arr[i];
  };

  const random_create = (x: number, y: number) => ({
    x,
    y,
  });

  const random_next = (rnd: IRND, min: number, max: number) => {
    const result = Module.ProceduralRandomf(rnd.x, rnd.y, min, max);
    rnd.y++;
    return result;
  };

  const pick_random_from_table_backwards = <T>(t: T[], rnd: IRND) => {
    let result: T | undefined;
    const len = t.length;

    for (let i = len - 1; i >= 0; i--) {
      if (random_next(rnd, 0.0, 1.0) <= (t[i] as any).chance) {
        result = t[i];
        break;
      }
    }

    if (!result) {
      return t[0];
    }

    return result;
  };

  interface ITable {
    weight_min: Decimal;
    weight_max: Decimal;
    probability: Decimal;
  }
  const pick_random_from_table_weighted = <T>(rnd: IRND, t: T[]) => {
    const table: Array<T & ITable> = cloneDeep(t) as any;

    let weight_sum = new D(0.0);
    for (let i = 0; i < table.length; i++) {
      const it = table[i];
      it.weight_min = new D(weight_sum);
      it.weight_max = weight_sum.add(it.probability);
      weight_sum = new D(it.weight_max);
    }

    const val = new D(random_next(rnd, 0.0, weight_sum.toNumber()));
    let result = table[0];
    for (let i = 0; i < table.length; i++) {
      const it = table[i];
      if (val.greaterThanOrEqualTo(it.weight_min) && val.lessThanOrEqualTo(it.weight_max)) {
        result = it;
        break;
      }
    }

    return result as T;
  };

  const random_nexti = (rnd: IRND, min, max) => {
    const result = Module.ProceduralRandomi(rnd.x, rnd.y, min, max);
    rnd.y = rnd.y + 1;
    return result;
  };

  const SetUnlockedSpells = (spells: boolean[]) => {
    unlockedSpells = spells;
    if (Module.SetUnlockedSpells) {
      for (let i = 0; i < spells.length; i++) {
        Module.SetUnlockedSpells(i, Number(spells[i]));
      }
    }
  };

  const getSpawnProbability = (spell: (typeof spellsArr)[number], level: number) =>
    spell.spawn_probabilities[level] ?? 0;

  const seededRandom = (seed: number, x: number, y: number) => {
    if (!Module.SeededRandom) {
      throw new Error("RNG wasm module did not provide SeededRandom");
    }
    return Module.SeededRandom(seed, Math.fround(x), Math.fround(y));
  };

  const GetRandomAction = (x: number, y: number, level: number, offset = 0) => {
    const seed = Module.GetWorldSeed() + offset;
    let sum = 0;
    for (let i = 0; i < spellsArr.length; i++) {
      if (!unlockedSpells[i]) {
        continue;
      }
      sum += getSpawnProbability(spellsArr[i], level);
    }

    let accumulated = sum * seededRandom(seed, x, y);
    for (let i = 0; i < spellsArr.length; i++) {
      if (!unlockedSpells[i]) {
        continue;
      }
      const spell = spellsArr[i];
      const probability = getSpawnProbability(spell, level);
      if (probability === 0) {
        continue;
      }
      if (probability >= accumulated) {
        return spell.id;
      }
      accumulated -= probability;
    }

    return spellsArr[0].id;
  };

  const GetRandomActionWithType = (x: number, y: number, level: number, type: number, offset = 0) => {
    const seed = Module.GetWorldSeed() + offset;
    let sum = 0;
    for (let i = 0; i < spellsArr.length; i++) {
      if (!unlockedSpells[i]) {
        continue;
      }
      if (spellsArr[i].type === type) {
        sum += getSpawnProbability(spellsArr[i], level);
      }
    }

    let accumulated = sum * seededRandom(seed, x, y);
    for (let i = 0; i < spellsArr.length; i++) {
      if (!unlockedSpells[i]) {
        continue;
      }
      const spell = spellsArr[i];
      if (spell.type !== type) {
        continue;
      }
      const probability = getSpawnProbability(spell, level);
      if (probability > 0 && probability >= accumulated) {
        return spell.id;
      }
      accumulated -= probability;
    }

    const rand = Math.trunc(seededRandom(seed, x, y) * spellsArr.length);
    let spell = spellsArr[0];
    for (let j = 0; j < spellsArr.length; j++) {
      spell = spellsArr[(j + rand) % spellsArr.length];
      if (spell.type === type && getSpawnProbability(spell, level) > 0) {
        if (!unlockedSpells[j]) {
          continue;
        }
        return spell.id;
      }
      j++;
    }

    return spell.id;
  };

  const objToColorToMaterialTablePtr = (obj: any) => {
    const entries = Object.entries(obj);
    const data = [entries.length];
    for (const [key, value] of entries) {
      data.push(parseInt(key, 16), parseInt(String(value), 16));
    }
    const ptr = Module._malloc(data.length * 4);
    new Uint32Array(Module.HEAPU32.buffer, ptr, data.length).set(data);
    return {
      ptr,
      delete: () => Module._free(ptr),
      valueOf: () => ptr,
      [Symbol.toPrimitive]: () => ptr,
    };
  };

  return {
    Module,

    Random: Module.Random,
    Randomf: Module.Randomf,
    RandomDistribution: Module.RandomDistribution,
    RandomDistributionf: Module.RandomDistributionf,
    ProceduralRandomf: Module.ProceduralRandomf,
    ProceduralRandomi: Module.ProceduralRandomi,
    SetRandomSeed: Module.SetRandomSeed,
    SetWorldSeed: Module.SetWorldSeed,
    GetWorldSeed: Module.GetWorldSeed,
    RoundHalfOfEven: Module.RoundHalfOfEven,
    GetRandomAction,
    GetRandomActionWithType,
    GetWidthFromPix: Module.GetWidthFromPix,
    GetWidthFromPixWithOffset: Module.GetWidthFromPixWithOffset,
    GetGlobalPos: Module.GetGlobalPos,
    GetLocalPos: Module.GetLocalPos,
    GetTilePos: Module.GetTilePos,
    MapHandler: Module.MapHandler,

    SetUnlockedSpells,
    random_next,
    random_nexti,
    randomFromArray,
    random_create,
    pick_random_from_table_backwards,
    pick_random_from_table_weighted,

    objToColorToMaterialTablePtr,
  };
};
