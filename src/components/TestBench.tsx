// This should be storybook,
// but I can't get it to work with all of the WASM stuff that we need.

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import i18n from '../i18n';
import GameInfoProvider from '../services/SeedInfo/infoHandler';
import useLocalStorage from '../services/useLocalStorage';
import MapComponent from './SeedInfo/SeedInfoViews/Map';

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;
	return <MapComponent infoProvider={infoProvider} seed={infoProvider.config.seed.toString()} />
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
	const seed = 1976471607;
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
