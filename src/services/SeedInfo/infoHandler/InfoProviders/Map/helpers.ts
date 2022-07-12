import { rgbaToHex } from "../../../../../components/LiveSeedStats/OCRHandler/imageActions";

export const getColor = (map: ImageData, x, y) => {
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

export const imageFromHexArray = (
  hexArray: string[],
  w: number,
  h: number
): ImageData => {
  const arr = hexArray.flatMap(h => {
    const hh = parseInt(h, 16);
    const r = (hh >> 24) & 0xff;
    const g = (hh >> 16) & 0xff;
    const b = (hh >> 8) & 0xff;
    const a = hh & 0xff;
    return [r, g, b, a]
  });
  return new ImageData(new Uint8ClampedArray(arr), w, h);
};



export const getGlobalPos = (x: number, y: number, px: number, py: number) => {
  const gx = (x - 35) * 512 + px - 13;
  const gy = (y - 14) * 512 + py - 13;
  return { gx, gy };
}

export const getLocalPos = (x: number, y: number, gx: number, gy: number) => {
  const px = gx - (x - 35) * 512 + 13;
  const py = gy - (y - 14) * 512 + 13;
  return { px, py };
}
