import { rgbaToHex } from '../../../../../components/LiveSeedStats/OCRHandler/imageActions';

export const getColor = (map: ImageData, x, y) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return '';
  }
  const pixelPos = 4 * (x + y * map.width);
  const color = rgbaToHex(
    map.data[pixelPos + 0],
    map.data[pixelPos + 1],
    map.data[pixelPos + 2],
    map.data[pixelPos + 3]
  );
  return color;
};

export const iteratePixels = async (
  image: ImageData,
  step: number,
  cb: (x: number, y: number, color: string) => Promise<void>
) => {
  for (let y = 0; y < image.height; y += step) {
    for (let x = 0; x < image.width; x += step) {
      const pos = image.width * y * 4 + x * 4;
      const r = image.data[pos + 0];
      const g = image.data[pos + 1];
      const b = image.data[pos + 2];
      const a = image.data[pos + 3];
      const color = rgbaToHex(r, g, b, a);
      await cb(x, y, color);
    }
  }
};

export const rgbaToInt = (r, g, b, a) =>
  ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;

export const hexTorgba = (h: string): [r: number, g: number, b: number, a: number] => {
  const hh = parseInt(h, 16);
  const r = (hh >> 24) & 0xff;
  const g = (hh >> 16) & 0xff;
  const b = (hh >> 8) & 0xff;
  const a = hh & 0xff;
  return [r, g, b, a];
};

export const imageFromHexArray = (
  hexArray: string[],
  w: number,
  h: number
): ImageData => {
  const arr = hexArray.flatMap(hexTorgba);
  return new ImageData(new Uint8ClampedArray(arr), w, h);
};

export const getGlobalPos = (x: number, y: number, px: number, py: number) => {
  if (y === 14) {
    py -= 10;
  }
  const gx = Math.floor(((x - 35) * 512) / 10) * 10 + px - 5;
  const gy = Math.floor(((y - 14) * 512) / 10) * 10 + py - 3;
  return { gx, gy };
};

export const getLocalPos = (x: number, y: number, gx: number, gy: number) => {
  const px = gx - Math.floor(((x - 35) * 512) / 10) * 10 + 5;
  let py = gy - Math.floor(((y - 14) * 512) / 10) * 10 + 3;
  if (y === 14) {
    py += 10;
  }
  return { px, py };
};

export const rgbToHsl = (_r, _g, _b) => {
  let r = _r / 255
  let g = _g / 255
  let b = _b / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}
