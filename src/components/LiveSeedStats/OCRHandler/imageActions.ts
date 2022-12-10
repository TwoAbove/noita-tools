import {
	hexTorgba,
	rgbaToInt
} from '../../../services/SeedInfo/infoHandler/InfoProviders/Map/helpers';

const canvasStub = {
	getContext: () => ({
		drawImage: () => {},
		putImageData: () => {},
		getImageData: () => new ImageData(0, 0)
	}),
	width: 0,
	height: 0
};

export const createImage = (w, h): HTMLCanvasElement => {
	if ('undefined' === typeof document) {
		return canvasStub as any;
	}
	const can = document.createElement('canvas');
	can.width = w;
	can.height = h;
	const ctx = can.getContext('2d')! as any;
	ctx.msImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	return can;
};

export const imageFromBase64 = async (blob): Promise<ImageData> => {
	if ('undefined' === typeof document) {
		return new ImageData(0, 0);
	}
	const image = new Image();
	image.src = blob;

	return new Promise(res => {
		image.onload = () => {
			const can = createImage(image.width, image.height);
			const ctx = can.getContext('2d')!;
			ctx.drawImage(image, 0, 0);
			const imageData = ctx.getImageData(0, 0, image.width, image.height);
			res(imageData);
		};
	});
};

export const imageToBase64 = async (img: ImageData): Promise<string> => {
	const can = createImage(img.width, img.height);
	const ctx = can.getContext('2d')!;
	// Draw the image
	const i = await createImageBitmap(img);
	ctx.drawImage(i, 0, 0);
	return can.toDataURL('image/png');
};

export const copyImage = img => {
	const image = createImage(img.width, img.height);
	const ctx = image.getContext('2d')!;
	if (img instanceof ImageData) {
		ctx.putImageData(img, 0, 0);
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height);
	}
	return image;
};

export const getPixels = img => {
	if (!(img instanceof HTMLCanvasElement)) {
		img = copyImage(img);
	}
	const ctx = img.getContext('2d');
	return ctx.getImageData(0, 0, img.width, img.height);
};

export const threshold = (
	pixels,
	threshold,
	light = [255, 255, 255],
	dark = [0, 0, 0]
) => {
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

export const toDark = (pixels, dark = [0, 0, 0]) => {
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

export const scale = (img, scale: number): HTMLCanvasElement => {
	const canvas = createImage(img.width * scale, img.height * scale);
	const ctx = canvas.getContext('2d')!;

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas;
};

export const scaleImageData = async (
	img: ImageData,
	s: number
): Promise<ImageData> => {
	const btmp = await createImageBitmap(img);
	return scale(btmp, s)
		.getContext('2d')!
		.getImageData(0, 0, img.width * s, img.height * s);
};

export const stretch = (img, width, height): HTMLCanvasElement => {
	const canvas = createImage(width, height);
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(copyImage(img), 0, 0, width, height);
	// canvas.style.transform =`scale(${img.width / width},${img.height / height})`;

	return canvas;
};

const g = (c: HTMLCanvasElement): Uint8ClampedArray =>
	c.getContext('2d')!.getImageData(0, 0, c.width, c.height)!.data;

export const diff = (
	img1: HTMLCanvasElement,
	img2: HTMLCanvasElement
): number => {
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
	return res.getContext('2d')!.getImageData(0, 0, res.width, res.height);
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
	img: HTMLCanvasElement,
	cropX: number,
	cropY: number,
	cropWidth: number,
	cropHeight: number
): HTMLCanvasElement => {
	const canvas = createImage(cropWidth, cropHeight);
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(
		img,
		cropX,
		cropY,
		cropWidth,
		cropHeight,
		0,
		0,
		cropWidth,
		cropHeight
	);
	return canvas;
};

export const invert = (img: HTMLCanvasElement): HTMLCanvasElement => {
	const ctx = img.getContext('2d')!;
	const imageData = ctx.getImageData(0, 0, img.width, img.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		// red
		data[i] = 255 - data[i];
		// green
		data[i + 1] = 255 - data[i + 1];
		// blue
		data[i + 2] = 255 - data[i + 2];
	}
	return copyImage(imageData);
};

export const unAlpha = (img: HTMLCanvasElement): HTMLCanvasElement => {
	const ctx = img.getContext('2d')!;
	const imageData = ctx.getImageData(0, 0, img.width, img.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		data[i + 3] = 255;
	}
	return copyImage(imageData);
};

export const enhance = (img: HTMLCanvasElement): HTMLCanvasElement => {
	const canvas = createImage(img.width, img.height);
	const ctx = canvas.getContext('2d')!;
	ctx.filter = 'brightness(600%) contrast(400%)';
	ctx.imageSmoothingEnabled = false;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, 0, 0);
	const pixels = getPixels(canvas);
	toDark(pixels);
	const thresholdImage = copyImage(pixels);
	return thresholdImage;
};

export const clearBg = (img: HTMLCanvasElement): HTMLCanvasElement => {
	const ctx = img.getContext('2d')!;
	const imageData = ctx.getImageData(0, 0, img.width, img.height);
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

const pad = (s: string) => {
	if (s.length === 1) {
		s = '0' + s;
	}
	return s;
};

export const hexRGBAtoIntRGB = (hex: string) => {
	const rgb = hex.substring(0, 6);
	return parseInt(rgb, 16);
};

export const rgbaToHex = (r, g, b, a) => {
	let rs = pad(r.toString(16));
	let gs = pad(g.toString(16));
	let bs = pad(b.toString(16));
	let as = pad(a.toString(16));
	const hex = rs + gs + bs + as;
	return hex;
};

const getPos = (w, x, y) => w * y * 4 + 4 * x;
const isBlack = (data, p) => {
	return data[p] === 0 && data[p + 1] === 0 && data[p + 2] === 0;
};
export const drawImageData = (
	src: ImageData,
	dest: ImageData,
	startX: number,
	startY: number,
	color_to_material_table?: { [color: string]: string }
) => {
	let f = {};
	if (color_to_material_table) {
		for (const color in color_to_material_table) {
			f[rgbaToInt(...hexTorgba(color))] = hexTorgba(
				color_to_material_table[color]
			);
		}
	}
	for (let y = 0; y < src.height; y++) {
		for (let x = 0; x < src.width; x++) {
			const srcP = getPos(src.width, x, y);
			if (isBlack(src.data, srcP)) {
				continue;
			}
			if (startX + x >= dest.width || startY + y >= dest.height) {
				continue;
			}
			const destP = getPos(dest.width, startX + x, startY + y);
			if (color_to_material_table) {
				const c = rgbaToInt(
					src.data[srcP + 0],
					src.data[srcP + 1],
					src.data[srcP + 2],
					src.data[srcP + 3]
				);
				if (f[c]) {
					dest.data[destP + 0] = f[c][0];
					dest.data[destP + 1] = f[c][1];
					dest.data[destP + 2] = f[c][2];
					dest.data[destP + 3] = f[c][3];
					continue;
				}
			}
			dest.data[destP + 0] = src.data[srcP + 0];
			dest.data[destP + 1] = src.data[srcP + 1];
			dest.data[destP + 2] = src.data[srcP + 2];
			dest.data[destP + 3] = src.data[srcP + 3];
		}
	}
};
