import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
	IRule,
	SpellInfoProvider
} from '../../../services/SeedInfo/infoHandler';
import Clickable from '../../Icons/Clickable';
import Icon from '../../Icons/Icon';

interface IStartingSpellProps {
	onUpdateConfig: (config: IRule) => void;
}

const spellOptions = ['LIGHT_BULLET', 'SPITTER', 'RUBBER_BALL', 'BOUNCY_ORB'];

const spells = new SpellInfoProvider({} as any);

const StartingSpell = (props: IStartingSpellProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [startingSpellType, setStartingSpellType] = useState('');

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'startingSpell',
			path: '',
			params: [],
			val: startingSpellType
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startingSpellType]);

	const handleClicked = type => {
		setStartingSpellType(type);
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">
				{spellOptions.map((type, i) => {
					const spell = spells.provide(type);
					return (
						<Col key={type}>
							<Clickable
								className="m-3"
								onClick={() => handleClicked(type)}
								clicked={type === startingSpellType}
							>
								<Icon uri={spell.sprite} alt={spell.id} title={spell.id} />
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default StartingSpell;
