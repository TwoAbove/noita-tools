import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
	IRule,
	SpellInfoProvider
} from '../../../services/SeedInfo/infoHandler';
import Clickable from '../../Icons/Clickable';
import Icon from '../../Icons/Icon';

interface IStartingBombSpellProps {
	onUpdateConfig: (config: IRule) => void;
}

const spellOptions = ['BOMB', 'DYNAMITE', 'MINE', 'ROCKET', 'GRENADE'];

const spells = new SpellInfoProvider({} as any);

const StartingBombSpell = (props: IStartingBombSpellProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [startingBombType, setStartingBombSpellType] = useState('');

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'startingBombSpell',
			path: '',
			params: [],
			val: startingBombType
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startingBombType]);

	const handleClicked = type => {
		setStartingBombSpellType(type);
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">
				{spellOptions.map((type, i) => {
					return (
						<Col key={type}>
							<Clickable
								className="m-3"
								onClick={() => handleClicked(type)}
								clicked={type === startingBombType}
							>
								<Icon uri={spells.provide(type).sprite} />
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default StartingBombSpell;
