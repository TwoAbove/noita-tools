import { useContext } from 'react';
import { Stack, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';
import { FungalInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Fungal';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import { useTranslation } from 'react-i18next';
import { useMaterialFavorite } from './helpers';
import { MaterialInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Material';

enum Direction {
	From,
	To
}

const Flask = () => {
	return <b className="text-info">Flask</b>;
};

interface IFungalMaterialProps {
	materials: Map<string, string>
	direction: Direction
	isFlask: boolean
	isFavorite // TODO: add type 
	showId // TODO: add type 
}

const FungalMaterial = (props: IFungalMaterialProps) => {
	/*
	Var 'props.materials' may contain multiple materials with the same display name.
	This is because some materials like 'Flammable Gas' have static variants that are
	pre-rendered in a scene. Static materials have their own material ID.

	These materials should not be displayed twice.

	To solve this, materials will be sorted in a new `Map` where the key is the material
	name acts as the key and the material ids are stored in the value as an array.
	*/

	const materialsByName = new Map()
	props.materials.forEach((name, id) => {
		const ids = materialsByName.get(name) ?? []
		ids.push(id)
		materialsByName.set(name, ids)
	});

	// The logic that returns a JSX component requires an `Array`
	const materialsByNameArray = Array.from(materialsByName)

	return(
		<Stack>
			{props.isFlask && <Flask />}
			{materialsByNameArray.map(([name, ids]) => {
				return(
					<div key={`${name}-a`}>
						<div key={`${name}-b`} className={ids.some(props.isFavorite) ? 'text-info' : ''}>
							{capitalize(name)}
							{' '}
							{props.showId && `(${ids.join(', ')})`}
						</div>
					</div>
				)
			})}
		</Stack>
	)
}

interface IShiftProps {
	key: string | number;
	data: ReturnType<FungalInfoProvider['provide']>[number];
	shifted: boolean;
	isFavorite: (id: string) => boolean;
	setShifted: (shifted: boolean) => void;
	materialProvider: MaterialInfoProvider;
	getMaterial: (s: string) => any;
}

const Shift = (props: IShiftProps) => {
	const { data, shifted, setShifted, getMaterial, isFavorite, materialProvider } = props;
	const [showId] = useContext(AlchemyConfigContext);

	// TODO: More uniform if data.from and data.to is always an array?
	const from: Array<string> = [data.from].flat()
	const to: Array<string> = [data.to].flat()
	// TODO: Maybe have getMaterial return already capitalized?
	const fromMaterials = new Map(from.map(id => { return [ id, materialProvider.translate(id) ]}));
	const toMaterials = new Map(to.map(id => { return [ id, materialProvider.translate(id) ]}));

	return (
		<tr>
			<td className="align-middle">
				<FungalMaterial
					materials={fromMaterials}
					direction={Direction.From}
					isFlask={data.flaskFrom}
					isFavorite={isFavorite}
					showId={showId}
				/>
			</td>
			<td className="align-middle">
			<FungalMaterial
					materials={toMaterials}
					direction={Direction.To}
					isFlask={data.flaskTo}
					isFavorite={isFavorite}
					showId={showId}
				/>
			</td>
			<td>
				<OverlayTrigger
					placement="right"
					key="right"
					overlay={<Tooltip id={`tooltip-right`}>Shifted</Tooltip>}
				>
					<Form.Check
						checked={shifted}
						onChange={e => {
							setShifted(e.target.checked);
						}}
						type="checkbox"
						id={`shifted`}
						// label={`shifted`}
						enterKeyHint="done"
					/>
				</OverlayTrigger>
			</td>
		</tr>
	);
};

interface IFungalShiftsProps {
	fungalData: ReturnType<FungalInfoProvider['provide']>;
	infoProvider: GameInfoProvider;
}

const FungalShifts = (props: IFungalShiftsProps) => {
	const { fungalData, infoProvider } = props;
	const [t] = useTranslation();

	const { isFavorite } = useMaterialFavorite();

	const handleSetShifted = (i: number) => (shifted: boolean) => {
		const currentShifted = [...infoProvider.config.fungalShifts];
		currentShifted[i] = shifted;
		infoProvider.updateConfig({
			fungalShifts: currentShifted
		});
	};

	return (
		<table className="table table-sm table-responsive">
			<tbody>
				{fungalData.map((data, i) => {
					return (
						<Shift
							key={i + t('$current_language', { ns: 'materials' })}
							data={data}
							isFavorite={isFavorite}
							shifted={!!infoProvider.config.fungalShifts[i]}
							setShifted={handleSetShifted(i)}
							materialProvider={infoProvider.providers.material}
							getMaterial={s => infoProvider.providers.material.translate(s)}
						/>
					);
				})}
			</tbody>
		</table>
	);
};

export default FungalShifts;
