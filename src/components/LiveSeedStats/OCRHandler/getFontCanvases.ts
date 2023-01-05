import font from '../font.json';
import { createCanvas, getContext, invert, unAlpha } from './imageActions';

export interface IFontCanvases {
	[char: string]: OffscreenCanvas;
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
						const canvas = createCanvas(img.width, img.height);
						const ctx = getContext(canvas);
						ctx.drawImage(img, 0, 0);
						fontCanvases[c] = invert(unAlpha(canvas));
						res();
					};
				})
		)
	);
	return fontCanvases;
};

export default genCanvases;
