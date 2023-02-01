import { CanvasKit, EmulatedCanvas2D } from "canvaskit-wasm";
import { IRandom } from "../SeedInfo/random";


const load = (skia: CanvasKit) => {

	const { MakeCanvas } = skia;

	class Canvas {
		canvas: EmulatedCanvas2D;

		constructor(public width, public height) {
			this.canvas = MakeCanvas(width, height);
		}

		getContext(type): CanvasRenderingContext2D {
			return this.canvas.getContext('2d')!;
		}
	}
	const getContext = (
		canvas: Canvas,
	): CanvasRenderingContext2D => {
		return canvas.getContext('2d')! as CanvasRenderingContext2D;
	};

	const createCanvas = (w, h): Canvas => {
		const can = new Canvas(w, h); // document.createElement('canvas');
		// can.width = w;
		// can.height = h;
		const ctx = getContext(can) as any;
		ctx.msImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		return can;
	};

	const imageFromBase64 = async (dataUri: string): Promise<ImageData> => {
		// const { data, width, height } = decode(blob);
		// return new ImageData(new Uint8ClampedArray(data), width, height);

		// return new Promise(res => {
		// 	getPixelsFromString(blob, (err, pixels) => {
		// 		savePixels(pixels, 'image/png').then(arr => {
		// 			res(new ImageData(new Uint8ClampedArray(arr), pixels.shape[0], pixels.shape[1]));
		// 		}).catch(e => console.error(e));
		// 	});
		// });

		return new Promise(res => {
			const img = new Image();
			img.onload = () => {
				const can = createCanvas(img.width, img.height);
				const ctx = getContext(can);
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, img.width, img.height);
				res(imageData);
			}
			img.src = dataUri;
		});



		// const btmp = await createImageBitmap(await (await fetch(dataUri.toString())).blob());


		// ctx.drawImage(btmp, 0, 0);
		// const imageData = getContext(can).getImageData(0, 0, btmp.width, btmp.height);

		// return imageData;
	};

	const imageToBase64 = async (
		img: ImageData | ImageBitmap
	): Promise<string> => {
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

	const copyImage = img => {
		const image = createCanvas(img.width, img.height);
		const ctx = getContext(image);
		if (img instanceof ImageData) {
			ctx.putImageData(img, 0, 0);
		} else {
			ctx.drawImage(img, 0, 0, img.width, img.height);
		}
		return image;
	};

	const getPixels = (img: any): ImageData => {
		const ctx = img.getContext('2d')!;
		return ctx.getImageData(0, 0, img.width, img.height);
	};

	const threshold = (
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

	const toDark = (pixels: ImageData, dark = [0, 0, 0]) => {
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

	const scale = (cv: any, scale: number): Canvas => {
		const canvas = createCanvas(cv.width * scale, cv.height * scale) as any;
		const ctx = getContext(canvas);

		ctx.drawImage(cv, 0, 0, canvas.width, canvas.height);
		return canvas;
	};

	const scaleImageData = (img: ImageData, s: number): Canvas => {
		const cv = createCanvas(img.width, img.height);
		const cx = getContext(cv);
		cx.putImageData(img, 0, 0);

		return scale(cv, s)
	};

	const stretch = (img, width, height): Canvas => {
		const canvas = createCanvas(width, height);
		const ctx = getContext(canvas);
		ctx.drawImage(img, 0, 0, width, height);
		// canvas.style.transform =`scale(${img.width / width},${img.height / height})`;

		return canvas;
	};

	const g = (c: any): Uint8ClampedArray =>
		getContext(c).getImageData(0, 0, c.width, c.height)!.data;

	const diff = (img1: Canvas, img2: Canvas): number => {
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

	const cropImageData = (
		img: ImageData,
		cropX: number,
		cropY: number,
		cropWidth: number,
		cropHeight: number
	): ImageData => {
		const c = copyImage(img);
		const res = crop(c, cropX, cropY, cropWidth, cropHeight) as any;
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

	const crop = (
		cv: any,
		cropX: number,
		cropY: number,
		cropWidth: number,
		cropHeight: number
	): Canvas => {
		const canvas = createCanvas(cropWidth, cropHeight);
		const ctx = getContext(canvas);
		ctx.drawImage(
			cv,
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

	const invert = (cv: any): Canvas => {
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

	const unAlpha = (cv: any): Canvas => {
		const ctx = getContext(cv);
		const imageData = ctx.getImageData(0, 0, cv.width, cv.height);
		const data = imageData.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i + 3] = 255;
		}
		return cv;
	};

	const enhance = (cv: any): Canvas => {
		const canvas = createCanvas(cv.width, cv.height);
		const ctx = getContext(canvas);
		ctx.filter = 'brightness(600%) contrast(400%)';
		ctx.imageSmoothingEnabled = false;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(cv, 0, 0);
		const pixels = getPixels(canvas);
		toDark(pixels);
		const thresholdImage = copyImage(pixels);
		return thresholdImage;
	};

	const clearBg = (cv: any): Canvas => {
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

	// [r, g, b, a, r, g, b, a...] => [r, g, b, r, g, b...]
	const rgba2rgb = (src: any, dest: any) => {
		let j = 0;
		for (let i = 0; i < src.length; i++) {
			if (i && (i + 1) % 4 === 0) continue;
			dest[j] = src[i];
			j++;
		}
	};

	// [r, g, b, r, g, b...] => [r, g, b, a, r, g, b, a...]
	const rgb2rgba = (src: any, dest: any) => {
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

	const hexRGBAtoIntRGB = (hex: string) => {
		const rgb = hex.substring(0, 6);
		return parseInt(rgb, 16);
	};

	//  const rgbaToHex = (r, g, b, a) => {
	// 	let rs = pad(r.toString(16));
	// 	let gs = pad(g.toString(16));
	// 	let bs = pad(b.toString(16));
	// 	let as = pad(a.toString(16));
	// 	const hex = rs + gs + bs + as;
	// 	return hex;
	// };

	const rgbaToHex = (r, g, b, a) => {
		const hex = rgbaToInt(r, g, b, a).toString(16);
		if (hex.length === 8) {
			return hex;
		}
		return '0' + hex;
	};

	const getPos = (w, x, y) => w * y * 4 + 4 * x;
	const isBlack = (data, p) => {
		return data[p] === 0 && data[p + 1] === 0 && data[p + 2] === 0;
	};
	const drawImageData = (
		src: ImageData,
		dest: Canvas,
		startX: number,
		startY: number,
		color_to_material_table?: { [color: string]: string }
	) => {
		const img = new ImageData(src.data, src.width, src.height);

		let f = {};
		if (color_to_material_table) {
			for (const color in color_to_material_table) {
				f[rgbaToInt(...hexTorgba(color))] = hexTorgba(
					color_to_material_table[color]
				);
			}
		}

		if (color_to_material_table) {
			for (let p = 0; p < src.data.length; p += 4) {
				const c = rgbaToInt(
					src.data[p + 0],
					src.data[p + 1],
					src.data[p + 2],
					src.data[p + 3]
				);
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
		ctx.drawImage(tmp as any, startX, startY);
	};

	const printImage = (image: ImageData) => {
		const cv = createCanvas(image.width, image.height);
		const cx = getContext(cv);
		cx.putImageData(image, 0, 0);
		cv[
			cv['convertToBlob']
				? 'convertToBlob' // specs
				: 'toBlob' // current Firefox
		]().then(blob => {
			const fr = new FileReader();
			fr.readAsDataURL(blob);

			fr.addEventListener(
				'load',
				() => {
					// convert image file to base64 string
					const dataURL = fr.result;
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

	const getColor = (map: ImageData, x: number, y: number) => {
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

	const somePixelsSync = (
		image: ImageData,
		step: number,
		cb: (x: number, y: number, color: number) => boolean
	) => {
		let img: ImageData;
		if (!((image as any).data)) {
			img = getPixels(image);
		} else {
			img = image as ImageData;
		}

		for (let y = 0; y < image.height; y += step) {
			for (let x = 0; x < image.width; x += step) {
				const pos = image.width * y * 4 + x * 4;
				const r = image.data[pos + 0];
				const g = image.data[pos + 1];
				const b = image.data[pos + 2];
				const a = image.data[pos + 3];
				const color = rgbaToInt(r, g, b, a);
				if (cb(x, y, color)) {
					return true;
				}
			}
		}
		return false;
	}

	const somePixels = async (
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
	}

	const iteratePixels = (
		image: ImageData,
		step: number,
		cb: (x: number, y: number, color: number) => void
	) => {
		let img: ImageData;
		if (!((image as any).data)) {
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
				cb(x, y, color);
			}
		}
	};

	const rgbaToInt = (r: number, g: number, b: number, a: number) =>
		((r << 24) >>> 0) + (g << 16) + (b << 8) + a;

	const hexTorgba = (h: string): [r: number, g: number, b: number, a: number] => {
		const hh = parseInt(h, 16);
		const r = (hh >> 24) & 0xff;
		const g = (hh >> 16) & 0xff;
		const b = (hh >> 8) & 0xff;
		const a = hh & 0xff;
		return [r, g, b, a];
	};

	const imageFromHexArray = (
		hexArray: string[],
		w: number,
		h: number
	): ImageData => {
		const arr = hexArray.flatMap(hexTorgba);
		return new ImageData(new Uint8ClampedArray(arr), w, h);
	};

	const getGlobalPos = (x: number, y: number, px: number, py: number) => {
		if (y === 14) {
			py -= 10;
		}
		const gx = Math.floor(((x - 35) * 512) / 10) * 10 + px - 5;
		const gy = Math.floor(((y - 14) * 512) / 10) * 10 + py - 3;
		return { gx, gy };
	};

	const getLocalPos = (x: number, y: number, gx: number, gy: number) => {
		const px = gx - Math.floor(((x - 35) * 512) / 10) * 10 + 5;
		let py = gy - Math.floor(((y - 14) * 512) / 10) * 10 + 3;
		if (y === 14) {
			py += 10;
		}
		return { px, py };
	};

	const rgbToHsl = (_r, _g, _b): [h: number, s: number, l: number] => {
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

		return [h, s, l];
	}

	const GenerateMap = (
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
		const tileData = new Uint8ClampedArray(
			randoms.Module.HEAPU8.buffer,
			tilesDataPtr,
			4 * tiles_w * tiles_h
		);
		tileData.set(wang.data);

		// rgba2rgb(wang.data, tileData);

		const randomMaterialsPtr = randoms.Module._malloc(
			randomMaterials.length * 4
		);
		// 32-bit (uint)
		const randomMatData = new Uint32Array(
			randoms.Module.HEAPU32.buffer,
			randomMaterialsPtr,
			randomMaterials.length * 4
		);
		randomMatData.set(randomMaterials);

		const resultPtr = randoms.Module._malloc(4 * map_w * map_h);
		const result = new Uint8ClampedArray(
			randoms.Module.HEAPU8.buffer,
			resultPtr,
			4 * map_w * map_h
		);

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

		const resImgData = new ImageData(result, map_w, map_h);
		// rgb2rgba(result, resImgData.data);

		randoms.Module._free(randomMaterialsPtr);
		randoms.Module._free(tilesDataPtr);
		randoms.Module._free(resultPtr);

		return resImgData;
	}

	const GetPathMap = (
		randoms: IRandom,
		map: ImageData,
		map_w: number,
		map_h: number,
		xOffset: number,
		yOffset: number
	): ImageData => {
		const mapDataPtr = randoms.Module._malloc(4 * map_w * map_h);
		// 8-bit (char)
		const mapData = new Uint8ClampedArray(
			randoms.Module.HEAPU8.buffer,
			mapDataPtr,
			4 * map_w * map_h
		);
		mapData.set(map.data);
		// rgba2rgb(map.data, mapData);

		const resultPtr = randoms.Module._malloc(4 * map_w * map_h);
		const result = new Uint8ClampedArray(
			randoms.Module.HEAPU8.buffer,
			resultPtr,
			4 * map_w * map_h
		);

		randoms.Module.GeneratePathMap(
			mapDataPtr,
			map_w,
			map_h,
			resultPtr,
			xOffset,
			yOffset
		);

		const resImgData = new ImageData(result, map_w, map_h);
		// resImgData.data.set(result);
		// rgb2rgba(result, resImgData.data);

		randoms.Module._free(mapDataPtr);
		randoms.Module._free(resultPtr);

		return resImgData;
	}

	return {
		getContext,
		createCanvas,
		imageFromBase64,
		imageToBase64,
		copyImage,
		getPixels,
		threshold,
		toDark,
		scale,
		scaleImageData,
		stretch,
		g,
		diff,
		cropImageData,
		crop,
		invert,
		unAlpha,
		enhance,
		clearBg,
		rgba2rgb,
		rgb2rgba,
		pad,
		hexRGBAtoIntRGB,
		rgbaToHex,
		getPos,
		isBlack,
		drawImageData,
		printImage,
		getColor,
		somePixelsSync,
		somePixels,
		iteratePixels,
		rgbaToInt,
		hexTorgba,
		imageFromHexArray,
		getGlobalPos,
		getLocalPos,
		rgbToHsl,
		GenerateMap,
		GetPathMap,
	}
}

export default load;
