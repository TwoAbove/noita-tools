export const threshold = (pixels, threshold, light = [255, 255, 255], dark = [0, 0, 0]) => {
  // light, dark arrays of RGB
  var d = pixels.data,
    i = 0,
    l = d.length;
  while (l-- > 0) {
    const v = d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722;
    [d[i], d[i + 1], d[i + 2]] = v >= threshold ? light : dark;
    i += 4;
  }
  return pixels;
};

// [r, g, b, a, r, g, b, a...] => [r, g, b, r, g, b...]
export const rgba2rgb = (src: any, dest: any) => {
  let j = 0;
  for (let i = 0; i < src.length; i++) {
    if (i && (i + 1) % 4 === 0) continue;
    dest[j] = src[i];
    j++;
  }
};

// [r, g, b, r, g, b...] => [r, g, b, a, r, g, b, a...]
export const rgb2rgba = (src: any, dest: any) => {
  let j = 0;
  for (let i = 0; i < src.length; i++) {
    dest[j] = src[i];
    j++;
    if (i && (i + 1) % 3 === 0) {
      dest[j] = 255;
      j++;
    }
  }
};

export const rgbaToHex = (r, g, b, a) => {
  const hex = rgbaToInt(r, g, b, a).toString(16);
  if (hex.length === 8) {
    return hex;
  }
  return "0" + hex;
};

export const pad = (s: string) => {
  if (s.length === 1) {
    s = "0" + s;
  }
  return s;
};

export const hexRGBAtoIntRGB = (hex: string) => {
  const rgb = hex.substring(0, 6);
  return parseInt(rgb, 16);
};

export const getPos = (w, x, y) => w * y * 4 + 4 * x;
export const isBlack = (data, p) => {
  return data[p] === 0 && data[p + 1] === 0 && data[p + 2] === 0;
};
const isWhite = (data, p) => {
  return data[p] === 255 && data[p + 1] === 255 && data[p + 2] === 255;
};

export const rgbaToInt = (r: number, g: number, b: number, a: number) => ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;

export const hexTorgba = (h: string): [r: number, g: number, b: number, a: number] => {
  const hh = parseInt(h, 16);
  const r = (hh >> 24) & 0xff;
  const g = (hh >> 16) & 0xff;
  const b = (hh >> 8) & 0xff;
  const a = hh & 0xff;
  return [r, g, b, a];
};

export const WORLD_OFFSET_X = 35;
export const WORLD_OFFSET_Y = 14;

export const getTilePos = (gx, gy) => {
  const x = Math.floor((gx + 5) / 512) + WORLD_OFFSET_X;
  const y = Math.floor((gy + 3) / 512) + WORLD_OFFSET_Y;
  return { x, y };
};

export const getGlobalPos = (x, y, px, py) => {
  const gx = (x - WORLD_OFFSET_X) * 512 + px - 5;
  const gy = (y - WORLD_OFFSET_Y) * 512 + py - 3;
  return { gx, gy };
};

export const getLocalPos = (x, y, gx, gy) => {
  const px = gx - (x - WORLD_OFFSET_X) * 512 + 5;
  const py = gy - (y - WORLD_OFFSET_Y) * 512 + 3;
  return { px, py };
};

export const rgbToHsl = (_r, _g, _b): [h: number, s: number, l: number] => {
  let r = _r / 255;
  let g = _g / 255;
  let b = _b / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
};
