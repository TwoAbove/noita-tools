import Texture from './texture';

import {
	imageFromBase64,
	imageToBase64
} from '../../LiveSeedStats/OCRHandler/imageActions';
import { hexTorgba } from '../../../services/SeedInfo/infoHandler/InfoProviders/Map/helpers';

const NoitaTexture = async (color: string, texture: string) => {
	const textureImage = await imageFromBase64(texture);
	const imageData = new ImageData(textureImage.width, textureImage.height);

	const [a, r, g, b] = hexTorgba(color);
	for (let y = 0; y < imageData.height; y += 1) {
		for (let x = 0; x < imageData.width; x += 1) {
			const pos = imageData.width * y * 4 + x * 4;
			if (textureImage.data[pos + 0]) {
				// Alpha is non-null
				imageData.data[pos + 0] = r;
				imageData.data[pos + 1] = g;
				imageData.data[pos + 2] = b;
				imageData.data[pos + 3] = a;
			} else {
				imageData.data[pos + 0] = 0;
				imageData.data[pos + 1] = 0;
				imageData.data[pos + 2] = 0;
				imageData.data[pos + 3] = 0;
			}
		}
	}
	const image = await imageToBase64(imageData);
	const tx = new Texture(image, { normal: texture, ambient: 1, shininess: 0.5 });
	await tx.loaded;

	return tx.moveLight({ x: textureImage.width, y: textureImage.height, z: 0.25 })!.toDataURL();
};

export default NoitaTexture;
