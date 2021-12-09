import React from 'react';
import { Stack } from 'react-bootstrap';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import {
	StartingBombSpellInfoProvider,
	StartingFlaskInfoProvider,
	StartingSpellInfoProvider
} from '../../../services/SeedInfo/infoHandler';
import Icon from '../../Icons/Icon';

interface IStartProps {
	startingFlask: ReturnType<StartingFlaskInfoProvider['provide']>;
	startingSpell: ReturnType<StartingSpellInfoProvider['provide']>;
	startingBombSpell: ReturnType<StartingBombSpellInfoProvider['provide']>;

	infoProvider: GameInfoProvider;
}

const Start = (props: IStartProps) => {
	const {
		startingFlask,
		startingSpell,
		startingBombSpell,
		infoProvider
	} = props;
	return (
		<div className="d-flex justify-content-between align-items-center">
			<div className="m-3">Starting setup:</div>
			<Stack className="justify-content-center" direction="horizontal" gap={3}>
				<Icon
					uri={
						infoProvider.providers.spells.provide(startingSpell.toUpperCase())
							.sprite
					}
				/>
				<Icon
					uri={
						infoProvider.providers.spells.provide(
							startingBombSpell.toUpperCase()
						).sprite
					}
				/>
				<div>{infoProvider.providers.material.translate(startingFlask)}</div>
			</Stack>
			<div className="flex-grow-1"></div>
		</div>
	);
};

export default Start;
