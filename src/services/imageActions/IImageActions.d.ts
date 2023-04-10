
export interface IImageActions {
  ImageData: (w: number, h: number) => ImageData;

  getContext: (canvas: OffscreenCanvas, config?: CanvasRenderingContext2DSettings) => OffscreenCanvasRenderingContext2D,
  createCanvas: (w, h) => OffscreenCanvas;
  imageFromBase64: (dataUri: string) => Promise<ImageData>;
  imageToBase64: (img: ImageData | ImageBitmap) => Promise<string>
  copyImage: (img) => OffscreenCanvas;
  getPixels: (img) => ImageData;
  threshold: <T>(pixels: T, threshold, light = [255, 255, 255], dark = [0, 0, 0]) => T;
  toDark: (pixels: ImageData, dark: [0, 0, 0]) => ImageData;
  scaleImageData: (img: ImageData, s: number) => OffscreenCanvas;
  stretch: (img, width, height) => OffscreenCanvas;
  diff: (img1: OffscreenCanvas, img2: OffscreenCanvas) => number;
  cropImageData: (
    img: ImageData,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number) => ImageData;
  crop: (
    cv: OffscreenCanvas | CanvasImageSource,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number) => OffscreenCanvas;
  invert: (cv: OffscreenCanvas) => OffscreenCanvas;
  unAlpha: (cv: OffscreenCanvas) => OffscreenCanvas;
  enhance: (cv: OffscreenCanvas) => OffscreenCanvas;
  clearBg: (cv: OffscreenCanvas) => OffscreenCanvas;
  rgba2rgb: (src: any, dest: any) => void;
  rgb2rgba: (src: any, dest: any) => void;
  hexRGBAtoIntRGB: (hex: string) => number;
  rgbaToHex: (r, g, b, a) => string;
  drawImageData: (src: ImageData,
    dest: OffscreenCanvas,
    startX: number,
    startY: number,
    color_to_material_table?: { [color: string]: string }) => void;
  printImage: (image: ImageData | OffscreenCanvas) => void;
  getColor: (map: ImageData, x: number, y: number) => number;
  somePixelsSync: (
    image: ImageData,
    step: number,
    cb: (x: number, y: number, color: number) => boolean) => boolean
  somePixels: (image: ImageData,
    step: number,
    cb: (x: number, y: number, color: number) => Promise<boolean>) => Promise<boolean>
  iteratePixels: (image: ImageData | OffscreenCanvas,
    step: number,
    cb: (x: number, y: number, color: number) => void) => void;
  rgbaToInt: (r: number, g: number, b: number, a: number) => number;
  hexTorgba: (h: string) => [r: number, g: number, b: number, a: number];
  imageFromHexArray: (hexArray: string[],
    w: number,
    h: number) => ImageData;
  getTilePos: (gx: number, gy: number) => {
    x: number;
    y: number;
  };
  getGlobalPos: (x: number, y: number, px: number, py: number) => {
    gx: number;
    gy: number;
  };
  getLocalPos: (x: number, y: number, gx: number, gy: number) => {
    px: number;
    py: number;
  };
  rgbToHsl: (_r, _g, _b) => [h, s, l];

  GetPathMap: (
    randoms: IRandom,
    map: ImageData,
    map_w: number,
    map_h: number,
    xOffset: number,
    yOffset: number) => ImageData;

  GenerateMap: (
    randoms: IRandom,
    wang: ImageData,
    color: number,
    tiles_w: number,
    tiles_h: number,
    map_w: number,
    map_h: number,
    isCoalMine: boolean,
    shouldBlockOutRooms: boolean,
    randomMaterials: number[],
    xOffset: number,
    yOffset: number) => ImageData;

}
