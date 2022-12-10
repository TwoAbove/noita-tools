import { FC, useContext, useMemo } from 'react';
import { hexTorgba, rgbToHsl } from '../../../services/SeedInfo/infoHandler/InfoProviders/Map/helpers';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import Icon from '../../Icons/Icon';
import { GameInfoContext } from '../SeedDataOutput';
import { FungalMaterial } from './FungalShifts';
import { useMaterialFavorite } from './helpers';

const pouchImage =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMUlEQVR4AbXBMWrcQBSA4X/ElkY2ClNM4z4nSB2iAwQ1uYOOoEadLiDQHXIBVTKujMgJ9giveMTsDtulmGhglAxmHadIvo//buybMPZNIDP2TSA58AZRTzT2TWAj6hH17AreMEyLYSPq2Q3TYkgMf/Dp45dA8uH9d6JhWgwZwyu6tg7Oloh6om/Hd+weHr8akgNXjH0TSJwtiT7bH4h6oodHfil4YeybwCucLXmpIDP2TSDzdLznmq6tA0lB0rV1IDOvFefThafjPTlnS3IFV8xrxe3dDbt5rdiJeqKurQObgk3X1sHZElHPvFZE59OF27sbzqcL0bxWiHqcLckdSEQ9zpY4+8xvz0SiHmdLREHUkyvIiHoiUU8k6hH1RKKe3DAtho0h6do68JeGaTH8Kz8BRGh5qhpBJOMAAAAASUVORK5CYII=';

const colorMatrix = (hex) => {
	const [r, g, b] = hexTorgba(hex);

	return [
		() => <svg viewBox="0 0 16 16" width="0" height="0" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id={hex} colorInterpolationFilters="sRGB">
					<feColorMatrix type="matrix"
						values={`	1 0 0 0 ${(r / 255) * 0.33}
              		 		0 1 0 0 ${(g / 255) * 0.33}
                			0 0 1 0 ${(b / 255) * 0.33}
                			0 0 0 1 0`} />
				</filter>
			</defs>
		</svg>,
		hex
	];
};

interface IPowderStashProps {
	x: number;
	y: number;
}

const PowderStash: FC<IPowderStashProps> = ({ x, y }) => {
	const { gameInfoProvider } = useContext(GameInfoContext);

	const powder = useMemo(
		() => gameInfoProvider!.providers.powderStash.provide(x, y),
		[gameInfoProvider, x, y]
	);

	const material = gameInfoProvider!.providers.material.provide(powder);
	const [Matrix, id] = colorMatrix(material.color);

	return (
		<div className="d-flex flex-column justify-content-center align-items-center">
			<Matrix />
			<Icon uri={pouchImage} style={{
				filter: `url(#${id})`
			}} />
			<FungalMaterial showColor={false} id={powder} />
		</div>
	);
};

export default PowderStash;
