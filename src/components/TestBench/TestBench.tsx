// This should be storybook,
// but I can't get it to work with all of the WASM stuff that we need.
import { useState, useEffect } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import useLocalStorage from '../../services/useLocalStorage';
import Icon from '../Icons/Icon';
import { useGameInfoProvider } from '../SeedInfo/SeedDataOutput';
import MapComponent from '../SeedInfo/SeedInfoViews/Map';

const spells = new SpellInfoProvider({} as any);

const a = 20;
// const arr = [Array(a).fill('').map((_, x) => {
// 		return { x: 0, y: (x - a/2) }
// })];
const arr = Array(a).fill('').map((_, x) => {
	return Array(a).fill('').map((_, y) => {
		return { x: x - a/2 + 1, y: y - a/2 + 1 }
	})
});

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;
	const [t] = useTranslation();
	return <></>
	// const getAlwaysCast = (i, l, level, worldOffset, xo, yo) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffset, xo, yo)
	// return (
	// 	<Stack gap={1}>
	// 		{arr.map((a, i) => {
	// 			return (<Stack key={i} direction='horizontal' gap={1}>{a.map((pos, j) => {
	// 				const itemId = infoProvider.providers.alwaysCast.provide(0, 0, 3, 0, pos.x, pos.y);
	// 				const item = spells.provide(itemId);
	// 				return (
	// 					<Icon
	// 						key={`${itemId} ${pos.x} ${pos.y}`}
	// 						uri={item.sprite}
	// 						title={`${itemId} ${pos.x} ${pos.y}`}
	// 						background
	// 					/>
	// 				)
	// 			})}
	// 			</Stack>)
	// 		})}
	// 	</Stack>
	// )
	// return (
	// 	<Stack gap={3}>
	// 		{
	// 			Array(7).fill('').map((_, level) => {
	// 				return (
	// 					<Stack key={level} direction='horizontal'>{
	// 						Array(3).fill('').map((_, i) => {
	// 							const itemId = getAlwaysCast(i, 3, level, 0, 0, 0);
	// 							const item = spells.provide(itemId);
	// 							return (
	// 								<Icon
	// 									key={`${itemId}-${i}`}
	// 									uri={item.sprite}
	// 									title={t(item.name)}
	// 									background
	// 								/>
	// 							)
	// 						})
	// 					}</Stack>
	// 				)
	// 			})
	// 		}
	// 	</Stack>
	// )
	// return <MapComponent infoProvider={infoProvider} seed={infoProvider.config.seed.toString()} />
};

const waitToLoad = (gameInfoProvider): Promise<void> =>
	new Promise(async res => {
		if (!gameInfoProvider) {
			return res();
		}
		while (!gameInfoProvider.ready) {
			await new Promise(r => setTimeout(r, 50));
		}
		return res();
	});

const TestBench = () => {
	const seed = "5085";
	// const seed = 1976471607;
	const [unlockedSpells] = useLocalStorage(
		'unlocked-spells',
		Array(393).fill(true)
	);
	const [gameInfoProvider] = useGameInfoProvider(seed, unlockedSpells);

	return (
		<Container>
			{!gameInfoProvider ? (
				<div>loading...</div>
			) : (
				<GameInfoProviderView infoProvider={gameInfoProvider} />
			)}
		</Container>
	);
};

export default TestBench;
