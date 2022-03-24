export const createImage = (w, h) => {
	const can = document.createElement('canvas');
	can.width = w;
	can.height = h;
	const ctx = can.getContext('2d')!;
	ctx.imageSmoothingEnabled = false;
	return can;
};

export const imageFromBase64 = async (blob, w, h): Promise<ImageData> => {
	const can = createImage(w, h);
	const ctx = can.getContext("2d")!;
	const image = new Image();
	image.src = blob;
	return new Promise((res) => {
		image.onload = () => {
			ctx.drawImage(image, 0, 0);
			const imageData = ctx.getImageData(0, 0, 300, 311);
			res(imageData);
		}
	})
}

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

export const scale = (img, scale): HTMLCanvasElement => {
	const canvas = createImage(img.width * scale, img.height * scale);
	const ctx = canvas.getContext('2d')!;

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas;
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

export const crop = (
	img,
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
