import { MapHandler, type IRandomModule, type WasmAllocation } from "../random/random";
import { loadWasmExports, type WasmSource } from "../wasm/loadWasm";

interface MapWasmExports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  _initialize(): void;
  malloc(size: number): number;
  free(ptr: number): void;
  SetWorldSeedRaw(seed: number): void;
  GetWorldSeedRaw(): number;
  GetWidthFromPixRaw(a: number, b: number): number;
  GetWidthFromPixWithOffsetRaw(a: number, b: number, offset: number): number;
  GetGlobalPosX(x: number, y: number): number;
  GetGlobalPosY(x: number, y: number): number;
  GetTilePosX(gx: number, gy: number): number;
  GetTilePosY(gx: number, gy: number): number;
  PngImageDecode(pngData: number, len: number): number;
  PngImageDelete(handle: number): void;
  MapHandlerNew(
    width: number,
    height: number,
    color: number,
    isCoalMine: number,
    shouldBlockOutRooms: number,
    randomMaterials: number,
    worldX: number,
    worldY: number,
  ): number;
  MapHandlerDelete(handle: number): void;
  MapHandlerMapPtr(handle: number): number;
  MapHandlerBigMapPtr(handle: number): number;
  MapHandlerGenerateMap(handle: number, rgbaTilesBase64: number, len: number): void;
  MapHandlerToBig(handle: number): void;
  MapHandlerDrawImageData(
    handle: number,
    imageHandle: number,
    gx: number,
    gy: number,
    colorToMaterialTable: number,
  ): void;
  GenerateMapRaw(
    rgbaTiles: number,
    color: number,
    tilesWidth: number,
    tilesHeight: number,
    result: number,
    mapWidth: number,
    mapHeight: number,
    isCoalMine: number,
    shouldBlockOutRooms: number,
    randomMaterials: number,
    worldX: number,
    worldY: number,
  ): void;
  GeneratePathMapRaw(
    map: number,
    mapWidth: number,
    mapHeight: number,
    result: number,
    worldX: number,
    worldY: number,
  ): void;
}

const WORLD_OFFSET_X = 35;
const WORLD_OFFSET_Y = 14;

const defaultWasmUrl = () => new URL("./noita_random.wasm", import.meta.url).href;

const vector2 = (x: number, y: number) => ({
  get(index: number) {
    return index === 0 ? x : y;
  },
});

const rgbaToInt = (r: number, g: number, b: number, a: number) => r * 0x1000000 + g * 0x10000 + b * 0x100 + a;

const allocationPtr = (allocation: number | WasmAllocation) => Number(allocation);

const base64Bytes = (value: string) => {
  const payload = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  if (!payload) {
    return new Uint8Array();
  }

  if (typeof atob === "function") {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return new Uint8Array(Buffer.from(payload, "base64"));
};

export const loadMapWasmModule = async (source: WasmSource = defaultWasmUrl()): Promise<IRandomModule> => {
  const wasm = await loadWasmExports<MapWasmExports>(source);
  wasm._initialize();
  const malloc = (size: number) => wasm.malloc(size);
  const free = (ptr: number) => wasm.free(ptr);
  const imageCache = new Map<string, number>();

  const writeBytes = (bytes: Uint8Array) => {
    const ptr = malloc(bytes.length);
    new Uint8Array(wasm.memory.buffer, ptr, bytes.length).set(bytes);
    return { ptr, len: bytes.length };
  };

  const pngImageHandle = (path: string, impl: string) => {
    const cached = imageCache.get(path);
    if (cached !== undefined) {
      return cached;
    }

    const encoded = writeBytes(base64Bytes(impl));
    const handle = wasm.PngImageDecode(encoded.ptr, encoded.len);
    free(encoded.ptr);
    imageCache.set(path, handle);
    return handle;
  };

  class WasmMapHandler extends MapHandler {
    private handle: number;
    private internalWorldX: number;
    private internalWorldY: number;

    constructor(
      width: number,
      height: number,
      color: number,
      isCoalMine: boolean,
      shouldBlockOutRooms: boolean,
      randomMaterials: number,
      worldX: number,
      worldY: number,
    ) {
      super(width, height, color, isCoalMine, shouldBlockOutRooms, randomMaterials, worldX, worldY);
      this.internalWorldX = worldX - WORLD_OFFSET_X;
      this.internalWorldY = worldY - WORLD_OFFSET_Y;
      this.handle = wasm.MapHandlerNew(
        width,
        height,
        color,
        Number(isCoalMine),
        Number(shouldBlockOutRooms),
        randomMaterials,
        worldX,
        worldY,
      );
      this.map = wasm.MapHandlerMapPtr(this.handle);
      this.bigMap = wasm.MapHandlerBigMapPtr(this.handle);
    }

    delete() {
      wasm.MapHandlerDelete(this.handle);
    }

    generate_map(rgbaTilesBase64: string) {
      const encoded = writeBytes(base64Bytes(rgbaTilesBase64));
      wasm.MapHandlerGenerateMap(this.handle, encoded.ptr, encoded.len);
      free(encoded.ptr);
    }

    iterateMap(x: number, y: number, cb: (gx: number, gy: number, color: number) => void) {
      const gx = wasm.GetGlobalPosX(x, y);
      const gy = wasm.GetGlobalPosY(x, y);
      const cw = wasm.GetWidthFromPixRaw(x, x + 1);
      const ch = wasm.GetWidthFromPixRaw(y, y + 1);
      const dw = wasm.GetWidthFromPixRaw(this.internalWorldX + WORLD_OFFSET_X, x);
      const dh = wasm.GetWidthFromPixRaw(this.internalWorldY + WORLD_OFFSET_Y, y);
      const heap = new Uint8Array(wasm.memory.buffer);

      for (let px = 0; px < cw; px++) {
        for (let py = 0; py < ch; py++) {
          const pos = this.map + 4 * (this.width * (dh + py) + dw + px);
          const color = rgbaToInt(heap[pos], heap[pos + 1], heap[pos + 2], heap[pos + 3]);
          if (color === 0xff || color === 0xffffffff) {
            continue;
          }
          cb(gx + px * 10, gy + py * 10, color);
        }
      }
    }

    somePixels(
      mapPtr: number,
      width: number,
      height: number,
      step: number,
      cb: (x: number, y: number, color: number) => boolean,
    ) {
      const heap = new Uint8Array(wasm.memory.buffer);
      const maxPos = width * height;
      for (let pixel = 0; pixel < maxPos; pixel += step) {
        const pos = mapPtr + pixel * 4;
        const color = rgbaToInt(heap[pos], heap[pos + 1], heap[pos + 2], heap[pos + 3]);
        if (color === 0xff || color === 0xffffffff) {
          continue;
        }
        if (cb(pixel % width, Math.floor(pixel / width), color)) {
          return true;
        }
      }
      return false;
    }

    toBig() {
      wasm.MapHandlerToBig(this.handle);
    }

    drawImageData(path: string, impl: string, gx: number, gy: number, colorToMaterialTable: number | WasmAllocation) {
      wasm.MapHandlerDrawImageData(
        this.handle,
        pngImageHandle(path, impl),
        gx,
        gy,
        allocationPtr(colorToMaterialTable),
      );
    }
  }

  const module = {
    get HEAPU8() {
      return new Uint8Array(wasm.memory.buffer);
    },
    get HEAPU32() {
      return new Uint32Array(wasm.memory.buffer);
    },
    get Module() {
      return module;
    },
    _malloc: malloc,
    _free: free,
    SetWorldSeed: wasm.SetWorldSeedRaw,
    GetWorldSeed: wasm.GetWorldSeedRaw,
    GetWidthFromPix: wasm.GetWidthFromPixRaw,
    GetWidthFromPixWithOffset: wasm.GetWidthFromPixWithOffsetRaw,
    GetGlobalPos: (x: number, y: number) => vector2(wasm.GetGlobalPosX(x, y), wasm.GetGlobalPosY(x, y)),
    GetTilePos: (gx: number, gy: number) => vector2(wasm.GetTilePosX(gx, gy), wasm.GetTilePosY(gx, gy)),
    GenerateMap: (
      rgbaTiles: number,
      color: number,
      tilesWidth: number,
      tilesHeight: number,
      result: number,
      mapWidth: number,
      mapHeight: number,
      isCoalMine: boolean,
      shouldBlockOutRooms: boolean,
      randomMaterials: number,
      worldX: number,
      worldY: number,
    ) =>
      wasm.GenerateMapRaw(
        rgbaTiles,
        color,
        tilesWidth,
        tilesHeight,
        result,
        mapWidth,
        mapHeight,
        Number(isCoalMine),
        Number(shouldBlockOutRooms),
        randomMaterials,
        worldX,
        worldY,
      ),
    GeneratePathMap: wasm.GeneratePathMapRaw,
    MapHandler: WasmMapHandler,
  } as unknown as IRandomModule;

  return module;
};
