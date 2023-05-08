import { IRandom } from "../SeedInfo/random";

import { rgbaToInt, hexTorgba } from "./commonImageActions";

export * from "./commonImageActions";

const _imageData = (w, h): ImageData => {
  return new global.ImageData(w, h);
};

export const ImageData = _imageData;

export const getContext = (
  canvas: OffscreenCanvas,
  config?: CanvasRenderingContext2DSettings
): OffscreenCanvasRenderingContext2D => {
  return canvas.getContext("2d", {
    ...config,
    willReadFrequently: true,
    desynchronized: true,
  })! as OffscreenCanvasRenderingContext2D;
};

export const getBitmapContext = (
  canvas: OffscreenCanvas,
  config?: ImageBitmapRenderingContextSettings
): ImageBitmapRenderingContext => {
  return canvas.getContext("bitmaprenderer", {
    ...config,
  })! as ImageBitmapRenderingContext;
};

export const createCanvas = (w, h): OffscreenCanvas => {
  const can = new OffscreenCanvas(w, h); // document.createElement('canvas');
  // can.width = w;
  // can.height = h;
  const ctx = getContext(can) as any;
  ctx.msImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  return can;
};

export const imageFromBase64 = async (dataUri: string): Promise<ImageData> => {
  // const { data, width, height } = decode(blob);
  // return new ImageData(new Uint8ClampedArray(data), width, height);

  // return new Promise(res => {
  // 	getPixelsFromString(blob, (err, pixels) => {
  // 		savePixels(pixels, 'image/png').then(arr => {
  // 			res(new ImageData(new Uint8ClampedArray(arr), pixels.shape[0], pixels.shape[1]));
  // 		}).catch(e => console.error(e));
  // 	});
  // });

  const btmp = await createImageBitmap(await (await fetch(dataUri.toString())).blob());
  const can = createCanvas(btmp.width, btmp.height);
  const ctx = getContext(can);
  ctx.drawImage(btmp, 0, 0);
  const imageData = getContext(can).getImageData(0, 0, btmp.width, btmp.height);
  return imageData;
};

export const imageToBase64 = async (img: ImageData | ImageBitmap): Promise<string> => {
  // for some reason the typing is funky
  const can: any = createCanvas(img.width, img.height);
  const ctx = getContext(can);
  // Draw the image
  const i = await createImageBitmap(img);
  ctx.drawImage(i, 0, 0);
  return can.convertToBlob().then(blob => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });
};

export const copyImage = img => {
  const image = createCanvas(img.width, img.height);
  const ctx = getContext(image);
  if (img instanceof global.ImageData) {
    ctx.putImageData(img, 0, 0);
  } else {
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }
  return image;
};

export const getPixels = (img): ImageData => {
  if (!(img instanceof OffscreenCanvas)) {
    return getPixels(copyImage(img));
  }
  const ctx = img.getContext("2d")!;
  return ctx.getImageData(0, 0, img.width, img.height);
};

export const toDark = (pixels: ImageData, dark = [0, 0, 0]) => {
  // light, dark arrays of RGB
  var d = pixels.data,
    i = 0,
    l = d.length;
  while (l-- > 0) {
    if (d[i] !== 255 || d[i + 1] !== 255 || d[i + 2] !== 255) {
      [d[i], d[i + 1], d[i + 2]] = dark;
    }
    i += 4;
  }
  return pixels;
};

const scale = (cv: OffscreenCanvas, scale: number): OffscreenCanvas => {
  const canvas = createCanvas(cv.width * scale, cv.height * scale);
  const ctx = getContext(canvas);

  ctx.drawImage(cv, 0, 0, canvas.width, canvas.height);
  return canvas;
};

export const scaleImageData = (img: ImageData, s: number): OffscreenCanvas => {
  const cv = createCanvas(img.width, img.height);
  const cx = getContext(cv);
  cx.putImageData(img, 0, 0);

  return scale(cv, s);
};

export const stretch = (img, width, height): OffscreenCanvas => {
  const canvas = createCanvas(width, height);
  const ctx = getContext(canvas);
  ctx.drawImage(img, 0, 0, width, height);
  // canvas.style.transform =`scale(${img.width / width},${img.height / height})`;

  return canvas;
};

const g = (c: OffscreenCanvas): Uint8ClampedArray => getContext(c).getImageData(0, 0, c.width, c.height)!.data;

export const diff = (img1: OffscreenCanvas, img2: OffscreenCanvas): number => {
  const d1 = g(img1);
  const d2 = g(img2);
  let count = 0;
  for (let i = 0; i < d1.length; i++) {
    if (d1[i] !== d2[i]) {
      count++;
    }
  }
  return count;
};

export const cropImageData = (
  img: ImageData,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): ImageData => {
  const c = copyImage(img);
  const res = crop(c, cropX, cropY, cropWidth, cropHeight);
  return getContext(res).getImageData(0, 0, res.width, res.height);
  // console.log({ img, cropX, cropY, cropWidth, cropHeight });
  // const res = new ImageData(cropWidth, cropHeight);

  // let i = 0;
  // for (let x = cropX; x < cropX + cropWidth; x++) {
  // 	for (let y = cropY; y < cropY + cropHeight; y++) {
  // 		let offset = (x * cropWidth + y) * 4;
  // 		res.data[i++] = img.data[offset++];
  // 		res.data[i++] = img.data[offset++];
  // 		res.data[i++] = img.data[offset++];
  // 		res.data[i++] = img.data[offset++];
  // 	}
  // }
  // console.log({ cropWidth, cropHeight, pixels: cropWidth * cropHeight * 4, i });
  // return res;
};

export const crop = (
  cv: OffscreenCanvas | CanvasImageSource,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): OffscreenCanvas => {
  const canvas = createCanvas(cropWidth, cropHeight);
  const ctx = getContext(canvas);
  ctx.drawImage(cv, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  return canvas;
};

export const invert = (cv: OffscreenCanvas): OffscreenCanvas => {
  const ctx = getContext(cv);
  const imageData = ctx.getImageData(0, 0, cv.width, cv.height);
  const data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    // red
    data[i] = 255 - data[i];
    // green
    data[i + 1] = 255 - data[i + 1];
    // blue
    data[i + 2] = 255 - data[i + 2];
  }
  return cv;
};

export const unAlpha = (cv: OffscreenCanvas): OffscreenCanvas => {
  const ctx = getContext(cv);
  const imageData = ctx.getImageData(0, 0, cv.width, cv.height);
  const data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i + 3] = 255;
  }
  return cv;
};

export const enhance = (cv: OffscreenCanvas): OffscreenCanvas => {
  const canvas = createCanvas(cv.width, cv.height);
  const ctx = getContext(canvas);
  ctx.filter = "brightness(600%) contrast(400%)";
  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cv, 0, 0);
  const pixels = getPixels(canvas);
  toDark(pixels);
  const thresholdImage = copyImage(pixels);
  return thresholdImage;
};

export const clearBg = (cv: OffscreenCanvas): OffscreenCanvas => {
  const ctx = getContext(cv);
  const imageData = ctx.getImageData(0, 0, cv.width, cv.height);
  const data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // const a = data[i + 3];
    if (r === 0 && g === 0 && b === 0) {
      data[i + 3] = 0;
    } else {
      data[i + 3] = 255;
    }
  }
  return copyImage(imageData);
  // ctx.putImageData(imageData, 0, 0);
  // return cvs;
};

// export const rgbaToHex = (r, g, b, a) => {
// 	let rs = pad(r.toString(16));
// 	let gs = pad(g.toString(16));
// 	let bs = pad(b.toString(16));
// 	let as = pad(a.toString(16));
// 	const hex = rs + gs + bs + as;
// 	return hex;
// };

export const drawImageData = (
  src: ImageData,
  dest: OffscreenCanvas,
  startX: number,
  startY: number,
  color_to_material_table?: { [color: string]: string }
) => {
  const img = new global.ImageData(src.data, src.width, src.height);

  let f = {};
  if (color_to_material_table) {
    for (const color in color_to_material_table) {
      f[rgbaToInt(...hexTorgba(color))] = hexTorgba(color_to_material_table[color]);
    }
  }

  if (color_to_material_table) {
    for (let p = 0; p < src.data.length; p += 4) {
      const c = rgbaToInt(src.data[p + 0], src.data[p + 1], src.data[p + 2], src.data[p + 3]);
      if (f[c]) {
        img.data[p + 0] = f[c][0];
        img.data[p + 1] = f[c][1];
        img.data[p + 2] = f[c][2];
        img.data[p + 3] = f[c][3];
      }
    }
  }

  // use temporary canvas to preserve transparent pixels
  const tmp = copyImage(img);
  const ctx = getContext(dest);
  ctx.drawImage(tmp, startX, startY);
};

export const printImage = (image: ImageData | OffscreenCanvas) => {
  let cv: OffscreenCanvas;
  if (image instanceof ImageData) {
    cv = createCanvas(image.width, image.height);
    const cx = getContext(cv);
    cx.putImageData(image as any, 0, 0);
  } else {
    cv = image as any;
  }
  cv[
    cv["convertToBlob"]
      ? "convertToBlob" // specs
      : "toBlob" // current Firefox
  ]().then(blob => {
    const fr = new FileReader();
    fr.readAsDataURL(blob);

    fr.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        const dataURL = fr.result;
        console.trace();
        console.log(dataURL);
        // console.log(
        // 	'%c ',
        // 	`font-size:400px; width:1000px; background:url(${dataURL}) no-repeat;`
        // );
      },
      false
    );
  });
};

export const getColor = (map: ImageData, x: number, y: number) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return 0;
  }
  const pixelPos = 4 * (x + y * map.width);
  const color = rgbaToInt(
    map.data[pixelPos + 0],
    map.data[pixelPos + 1],
    map.data[pixelPos + 2],
    map.data[pixelPos + 3]
  );
  return color;
};

export const somePixelsSync = (
  image: ImageData | OffscreenCanvas,
  step: number,
  cb: (x: number, y: number, color: number) => boolean
) => {
  let img: ImageData;
  if (!(image as any).data) {
    img = getPixels(image);
  } else {
    img = image as ImageData;
  }

  for (let y = 0; y < img.height; y += step) {
    for (let x = 0; x < img.width; x += step) {
      const pos = img.width * y * 4 + x * 4;
      const r = img.data[pos + 0];
      const g = img.data[pos + 1];
      const b = img.data[pos + 2];
      const a = img.data[pos + 3];
      const color = rgbaToInt(r, g, b, a);
      if (cb(x, y, color)) {
        return true;
      }
    }
  }
  return false;
};

export const somePixels = async (
  image: ImageData,
  step: number,
  cb: (x: number, y: number, color: number) => Promise<boolean>
) => {
  for (let y = 0; y < image.height; y += step) {
    for (let x = 0; x < image.width; x += step) {
      const pos = image.width * y * 4 + x * 4;
      const r = image.data[pos + 0];
      const g = image.data[pos + 1];
      const b = image.data[pos + 2];
      const a = image.data[pos + 3];
      const color = rgbaToInt(r, g, b, a);
      if (await cb(x, y, color)) {
        return true;
      }
    }
  }
  return false;
};

export const iteratePixels = (
  image: ImageData | OffscreenCanvas,
  step: number,
  cb: (x: number, y: number, color: number) => void
) => {
  let img: ImageData;
  if (!(image as any).data) {
    img = getPixels(image as OffscreenCanvas);
  } else {
    img = image as ImageData;
  }

  for (let y = 0; y < img.height; y += step) {
    for (let x = 0; x < img.width; x += step) {
      const pos = 4 * (img.width * y + x);
      const r = img.data[pos + 0];
      const g = img.data[pos + 1];
      const b = img.data[pos + 2];
      const a = img.data[pos + 3];
      const color = rgbaToInt(r, g, b, a);
      cb(x, y, color);
    }
  }
};

export const imageFromHexArray = (hexArray: string[], w: number, h: number): ImageData => {
  const arr = hexArray.flatMap(hexTorgba);
  return new global.ImageData(new Uint8ClampedArray(arr), w, h);
};

export const GenerateMap = (
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
  yOffset: number
): ImageData => {
  const tilesDataPtr = randoms.Module._malloc(4 * tiles_w * tiles_h);
  // 8-bit (char)
  const tileData = new Uint8ClampedArray(randoms.Module.HEAPU8.buffer, tilesDataPtr, 4 * tiles_w * tiles_h);
  tileData.set(wang.data);

  // rgba2rgb(wang.data, tileData);

  const randomMaterialsPtr = randoms.Module._malloc(randomMaterials.length * 4);
  // 32-bit (uint)
  const randomMatData = new Uint32Array(randoms.Module.HEAPU32.buffer, randomMaterialsPtr, randomMaterials.length * 4);
  randomMatData.set(randomMaterials);

  const resultPtr = randoms.Module._malloc(4 * map_w * map_h);
  const result = new Uint8ClampedArray(randoms.Module.HEAPU8.buffer, resultPtr, 4 * map_w * map_h);

  randoms.Module.GenerateMap(
    tilesDataPtr,
    color,
    tiles_w,
    tiles_h,
    resultPtr,
    map_w,
    map_h,
    isCoalMine,
    shouldBlockOutRooms,
    randomMaterialsPtr,
    xOffset,
    yOffset
  );

  const resImgData = new global.ImageData(map_w, map_h);
  resImgData.data.set(result);
  // rgb2rgba(result, resImgData.data);

  randoms.Module._free(randomMaterialsPtr);
  randoms.Module._free(tilesDataPtr);
  randoms.Module._free(resultPtr);

  return resImgData;
};

export const GetPathMap = (
  randoms: IRandom,
  map: ImageData,
  map_w: number,
  map_h: number,
  xOffset: number,
  yOffset: number
): ImageData => {
  const mapDataPtr = randoms.Module._malloc(4 * map_w * map_h);
  // 8-bit (char)
  const mapData = new Uint8ClampedArray(randoms.Module.HEAPU8.buffer, mapDataPtr, 4 * map_w * map_h);
  mapData.set(map.data);
  // rgba2rgb(map.data, mapData);

  const resultPtr = randoms.Module._malloc(4 * map_w * map_h);
  const result = new Uint8ClampedArray(randoms.Module.HEAPU8.buffer, resultPtr, 4 * map_w * map_h);

  randoms.Module.GeneratePathMap(mapDataPtr, map_w, map_h, resultPtr, xOffset, yOffset);

  const resImgData = new global.ImageData(result, map_w, map_h);
  // resImgData.data.set(result);
  // rgb2rgba(result, resImgData.data);

  randoms.Module._free(mapDataPtr);
  randoms.Module._free(resultPtr);

  return resImgData;
};
