// This should be storybook,
// but I can't get it to work with all of the WASM stuff that we need.

import { useState, useEffect } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import i18n from '../i18n';
import GameInfoProvider from '../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../services/SeedInfo/infoHandler/InfoProviders/Spell';
import useLocalStorage from '../services/useLocalStorage';
import Icon from './Icons/Icon';
import MapComponent from './SeedInfo/SeedInfoViews/Map';

const spells = new SpellInfoProvider({} as any);

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;
	const [t] = useTranslation();

	const getAlwaysCast = (i, l, level, worldOffset) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffset)
	return (
		<Stack gap={3}>
			{Array(7).fill('').map((_, level) => {
				return (
					<Stack key={level} direction='horizontal'>{
						Array(3).fill('').map((_, i) => {
							const itemId = getAlwaysCast(i, 3, level, 0);
							const item = spells.provide(itemId);
							return (
								<Icon
								key={`${itemId}-${i}`}
									uri={item.sprite}
									title={t(item.name)}
									background
								/>
							)
						})
					}</Stack>
				)
			})}
		</Stack>
	)
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
	const seed = 266197553;
	// const seed = 1976471607;
	const [unlockedSpells] = useLocalStorage(
		'unlocked-spells',
		Array(393).fill(true)
	);
	const [
		gameInfoProvider,
		setGameInfoProvider
	] = useState<GameInfoProvider | null>(null);
	const [data, setData] = useState<
		Awaited<ReturnType<GameInfoProvider['provideAll']>>
	>();

	useEffect(() => {
		setData(undefined);
		const newGameInfoProvider = new GameInfoProvider({ seed }, i18n);
		newGameInfoProvider.onRandomLoad(() => {
			newGameInfoProvider.randoms.SetWorldSeed(seed);
			newGameInfoProvider.randoms.SetUnlockedSpells(unlockedSpells);
		});
		waitToLoad(newGameInfoProvider).then(() => {
			setGameInfoProvider(newGameInfoProvider);
		});
	}, [unlockedSpells, seed]);

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
