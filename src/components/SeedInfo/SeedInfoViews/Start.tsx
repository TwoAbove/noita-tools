import React from 'react';
import { Stack } from 'react-bootstrap';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import { StartingBombSpellInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/StartingBomb';
import { StartingFlaskInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/StartingFlask';
import { StartingSpellInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/StartingSpell';

import Icon from '../../Icons/Icon';
import { StaticPotion } from './Potion';

interface IStartProps {
	startingFlask: ReturnType<StartingFlaskInfoProvider['provide']>;
	startingSpell: ReturnType<StartingSpellInfoProvider['provide']>;
	startingBombSpell: ReturnType<StartingBombSpellInfoProvider['provide']>;
}

const spells = new SpellInfoProvider({} as any);

const Start = (props: IStartProps) => {
	const {
		startingFlask,
		startingSpell,
		startingBombSpell,
	} = props;
	const startingSpellSpell = spells.provide(startingSpell.toUpperCase());
	const startingBombSpellSpell = spells.provide(
		startingBombSpell.toUpperCase()
	);
	return (
		<div className="d-flex justify-content-between align-items-center">
			<div className="m-3">Starting setup:</div>
			<Stack className="justify-content-center" direction="horizontal" gap={3}>
				<Icon uri={startingSpellSpell.sprite} />
				<Icon uri={startingBombSpellSpell.sprite} />
				<StaticPotion material={startingFlask} />
			</Stack>
			<div className="flex-grow-1"></div>
		</div>
	);
};

export default Start;
