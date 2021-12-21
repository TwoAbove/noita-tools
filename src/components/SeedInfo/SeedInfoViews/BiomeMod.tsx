import { capitalize, Objectify } from '../../../services/helpers';

import biomeModifiers from '../../../services/SeedInfo/data/obj/biome_modifiers.json';
import { BiomeInfoProvider } from '../../../services/SeedInfo/infoHandler';

interface IBiomeModifierProps {
	biome: string;
	modifier: Objectify<typeof biomeModifiers>[string] | string;
	onClick?: (e) => void;
}

const biomeInfoProvider = new BiomeInfoProvider({} as any);

const BiomeModifier = (props: IBiomeModifierProps) => {
	const { biome, modifier, onClick } = props;
	let modifierObject: Objectify<typeof biomeModifiers>[string];
	if (typeof modifier === 'string') {
		modifierObject = biomeModifiers[modifier];
	} else {
		modifierObject = modifier;
	}
	return (
		<div className="d-flex flex-column" onClick={onClick}>
			<div className="mx-auto" style={{}}>
				{biome && <span>{capitalize(biomeInfoProvider.translate(biome))}</span>}
			</div>

			<div
				className="position-relative text-center mx-auto"
				style={{
					height: '5rem',
					width: '15rem'
				}}
			>
				<div
					className="img-fluid position-relative top-50 start-50 translate-middle"
					style={{
						height: '5rem',
						width: '15rem',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
						backgroundImage: `url('data:image/png;base64,${modifierObject.ui_decoration_file}')`,
						backgroundPositionX: '50%',
						imageRendering: 'pixelated'
					}}
				></div>
				<div
					className="position-absolute top-50 start-50 translate-middle"
					style={{}}
				>
					<span
						style={{
							zIndex: 1
						}}
					>
						{capitalize(modifierObject.id.replace(/_/g, ' '))}
					</span>
				</div>
			</div>
		</div>
	);
};

export default BiomeModifier;
