import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from '../../../services/helpers';
import { hexTorgba, rgbToHsl } from '../../../services/imageActions/webImageActions';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import Icon from '../../Icons/Icon';
import { GameInfoContext } from '../SeedDataOutput';
import { FungalMaterial } from './FungalShifts';
import { useMaterialFavorite } from './helpers';

const potionImage =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4klEQVR4Ac3BsY3CQBBA0T/g3OFGux0wkVMaGQpxChkUQOzMJbgBd7Al4ELmDomVVpZBZHfv8eeEDX3fO79SSqgqxfF4FHdHRCiEirtTnE4njzFSXK9X4UVEKBreiDGSUkJVyTnzzo4vqCrvNFREhKLve1SVQkR4mueZ2p4NZuaHw4EQAkXXdedpmi7DMFDbs2JmHmOkbVtCCBQhBLquO0/TdKGyo2Jmzgeqyv1+dyo7Psg5U8s5s9awYVkWnlJK5JypPR4PasKKmTkvMUbWbrebUBEqZsY4jpiZs2EcR+Hf+QGdHkNFg+Qw2wAAAABJRU5ErkJggg==';

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

interface IPotionRandomMaterialProps {
	x: number;
	y: number;
}

const PotionRandomMaterial: FC<IPotionRandomMaterialProps> = ({ x, y }) => {
	const { gameInfoProvider } = useContext(GameInfoContext);

	const [t] = useTranslation('materials');

	const potion = useMemo(
		() => gameInfoProvider!.providers.potionRandomMaterial.provide(x, y),
		[gameInfoProvider, x, y]
	);

	const materialName =  gameInfoProvider!.providers.material.translate(potion);
	const material = gameInfoProvider!.providers.material.provide(potion);
	const [Matrix, id] = colorMatrix(material.color);
	return (
		<div className="d-flex font-size-sm flex-column justify-content-center align-items-center">
			<Matrix />
			<Icon size='2rem' uri={potionImage} style={{
				filter: `url(#${id})`
			}}
				title={t('$item_potion_with_material').replace('$0', capitalize(materialName))}
			/>
			<FungalMaterial showColor={false} id={potion} />
		</div>
	);
};

export default PotionRandomMaterial;
