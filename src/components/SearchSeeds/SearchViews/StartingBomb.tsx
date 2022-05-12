import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';

import Clickable from '../../Icons/Clickable';
import Icon from '../../Icons/Icon';
import { SpellInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Spell';

const spellInfoProvider = new SpellInfoProvider({} as any);

interface IStartingBombSpellProps {
	onUpdateConfig: (config: IRule) => void;
}

const spellOptions = ['BOMB', 'DYNAMITE', 'MINE', 'ROCKET', 'GRENADE'];

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

	const [t] = useTranslation('materials');

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">
				{spellOptions.map((type, i) => {
					const spell = spellInfoProvider.provide(type); // spells.provide(type);
					return (
						<Col className="p-0 m-1" xs="auto" key={spell.id}>
							<Clickable
								// className="m-3"
								useHover
								onClick={() => handleClicked(spell.id)}
								clicked={type === startingBombType}
							>
								<Icon
									background
									uri={spell.sprite}
									alt={t(spell.description)}
									title={t(spell.name)}
								/>
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default StartingBombSpell;
