import React, { useContext } from 'react';
import classnames from 'classnames';
import { Stack, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';
import { FungalInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Fungal';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useMaterialFavorite } from './helpers';

const Flask = () => {
	return <b className="text-info">Flask</b>;
};

interface IShiftProps {
	key: string | number;
	data: ReturnType<FungalInfoProvider['provide']>[number];
	shifted: boolean;
	isFavorite: (id: string) => boolean;
	setShifted: (shifted: boolean) => void;
	getMaterial: (s: string) => any;
}

const Shift = (props: IShiftProps) => {
	const { data, shifted, setShifted, getMaterial, isFavorite } = props;

	const [showId] = useContext(AlchemyConfigContext);

	const From = (props: { materials: string[]; flaskFrom: boolean }) => {
		const { materials } = props;

		const mats = new Map();

		for (const m of materials) {
			const displayName = capitalize(getMaterial(m));
			const arr = mats.get(displayName) || [];
			arr.push(m);
			mats.set(displayName, arr);
		}

		return (
			<Stack>
				{data.flaskFrom && <Flask />}
				{[...mats.keys()].map(displayName => {
					const ids = mats.get(displayName);
					return (
						<div
							key={displayName}
							className={classNames(ids.some(isFavorite) && 'text-info')}
						>
							{displayName} {showId && `(${ids.join(', ')})`}
						</div>
					);
				})}
			</Stack>
		);
	};

	return (
		<tr
			className={classnames([
				// (data.flaskTo || data.flaskFrom) && 'text-body',
				// !(data.flaskTo || data.flaskFrom) && 'text-muted',
				// ''
			])}
		>
			<td className={classNames('col-auto')}>
				<From materials={data.from} flaskFrom={data.flaskFrom} />
			</td>
			<td className={classNames('col-auto')}>
				<Stack>
					{data.flaskTo && <Flask />}
					<div className={classNames(isFavorite(data.to) && 'text-info')}>
						{capitalize(getMaterial(data.to))} {showId && `(${data.to})`}
					</div>
				</Stack>
			</td>
			<td className="col-auto">
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
		<table className="table table-sm align-middle table-responsive">
			<tbody>
				{fungalData.map((data, i) => {
					return (
						<Shift
							key={i + t('$current_language', { ns: 'materials' })}
							data={data}
							isFavorite={isFavorite}
							shifted={!!infoProvider.config.fungalShifts[i]}
							setShifted={handleSetShifted(i)}
							getMaterial={s => infoProvider.providers.material.translate(s)}
						/>
					);
				})}
			</tbody>
		</table>
	);
};

export default FungalShifts;
