import React, { useContext } from 'react';
import classnames from 'classnames';
import { Stack, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';
import { FungalInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Fungal';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import { useTranslation } from 'react-i18next';

const Flask = () => {
	return <b className="text-info">Flask</b>;
};

interface IShiftProps {
	key: string | number;
	data: ReturnType<FungalInfoProvider['provide']>[number];
	shifted: boolean;
	setShifted: (shifted: boolean) => void;
	getMaterial: (s: string) => any;
}

const Shift = (props: IShiftProps) => {
	const { data, getMaterial, shifted, setShifted } = props;

	const [showId] = useContext(AlchemyConfigContext);
	return (
		<tr
			className={classnames([
				// (data.flaskTo || data.flaskFrom) && 'text-body',
				// !(data.flaskTo || data.flaskFrom) && 'text-muted',
				// ''
			])}
		>
			<td className="col-auto">
				<Stack>
					{data.flaskFrom && <Flask />}
					{data.from.map(s => (
						<div key={s}>
							{capitalize(getMaterial(s))} {showId && `(${s})`}
						</div>
					))}
				</Stack>
			</td>
			<td className="col-auto">
				<Stack>
					{data.flaskTo && <Flask />}
					<div>
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
