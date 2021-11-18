import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { parseStringPromise } from 'xml2js';

const imageFile =
	'/home/twoabove/.steam/steam/steamapps/common/Noita/data/fonts/font_pixel_big.png';

// id is acii code, rect_[h|w] rect_[x|y] is position
const fontDataFile =
	'/home/twoabove/.steam/steam/steamapps/common/Noita/data/fonts/font_pixel_big.xml';

const getChar = (n: number) => {
	return String.fromCharCode(n);
};

interface ICharData {
	[char: string]: string;
}

interface IQuadChar {
	$: {
		id: string;
		offset_x: string;
		offset_y: string;
		rect_h: string;
		rect_w: string;
		rect_x: string;
		rect_y: string;
		width: string;
	};
}

(async () => {
	const fontData = (await parseStringPromise(fs.readFileSync(fontDataFile)))
		.FontData;
	const charData = fontData.QuadChar as IQuadChar[];
	const imageData = await Jimp.read(imageFile);
	const data: ICharData = {};

	for (const c of charData) {
		if (!isNaN(+getChar(+c.$.id))) {
			const i = await imageData
				.clone()
				.crop(+c.$.rect_x, +c.$.rect_y, +c.$.rect_w, +c.$.rect_h)
				.autocrop({
					tolerance: 0.5,
					cropOnlyFrames: false,
				}).scale(8, Jimp.RESIZE_NEAREST_NEIGHBOR);
			data[getChar(+c.$.id)] = await i.getBase64Async(Jimp.MIME_PNG);
			// For debug
			fs.writeFileSync(
				path.resolve(__dirname, 'text', `"${getChar(+c.$.id)}".png`),
				await i.getBufferAsync(Jimp.MIME_PNG),
				{ flag: 'w+' }
			);
		}
	}

	// console.log(data);

	fs.writeFileSync(
		'../src/components/LiveSeedStats/font.json',
		JSON.stringify(data, null, 4)
	);
})();

export {};
