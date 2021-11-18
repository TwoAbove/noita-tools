import font from '../font.json';

export interface IFontCanvases {
	[char: string]: HTMLCanvasElement;
}

const genCanvases = async (): Promise<IFontCanvases> => {
	const fontCanvases: IFontCanvases = {};
	await Promise.all(
		Object.entries(font).map(
			([c, data]) =>
				new Promise<void>(res => {
					const img = new Image();
					img.src = data;
					img.onload = () => {
						const canvas = document.createElement('canvas');
						canvas.width = img.width;
						canvas.height = img.height;
						const ctx = canvas.getContext('2d')!;
						ctx.imageSmoothingEnabled = false;
						ctx.drawImage(img, 0, 0);

						// const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						// console.log(c, imageData.data);

						fontCanvases[c] = canvas;
						res();
					};
				})
		)
	);
	return fontCanvases;
};

export default genCanvases;
