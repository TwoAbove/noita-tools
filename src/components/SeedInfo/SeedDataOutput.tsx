import React, { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import SeedInfo from './SeedInfo';

import i18n from '../../i18n';
import { db } from '../../services/db';
import useLocalStorage from '../../services/useLocalStorage';

interface ISeedDataProps {
	seed: string;
}

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

export const createGameInfoProvider = (seed: string, unlockedSpells: boolean[], setData) => {
	const gameInfoProvider = new GameInfoProvider(
		{ seed: parseInt(seed, 10) },
		i18n
	);
	gameInfoProvider.onRandomLoad(() => {
		gameInfoProvider.randoms.SetUnlockedSpells(unlockedSpells);
		gameInfoProvider.provideAll().then(data => {
			setData(data);
		});
		gameInfoProvider.addEventListener('update', event => {
			// Save config for resetting
			const config = gameInfoProvider.config;
			db.setSeedInfo("" + config.seed, config);
			gameInfoProvider.provideAll().then(data => {
				setData(data);
			});
		});
		gameInfoProvider.addEventListener('reset', event => {
			gameInfoProvider.provideAll().then(data => {
				setData(data);
			});
		});
	});
	return gameInfoProvider;
}

export const useGameInfoProvider = (
	seed: string,
	unlockedSpells: boolean[]
): [GameInfoProvider?, Awaited<ReturnType<GameInfoProvider['provideAll']>>?] => {
	const [data, setData] = useState<
		Awaited<ReturnType<GameInfoProvider['provideAll']>>
	>();

	const [gameInfoProvider, setGameInfoProvider] = useState<GameInfoProvider | undefined>();

	useEffect(() => {
		(async () => {
			setData(undefined);
			setGameInfoProvider(undefined);
			const config = await db.getSeedInfo(seed);
			const newGameInfoProvider = createGameInfoProvider(seed, unlockedSpells, setData);
			waitToLoad(newGameInfoProvider).then(() => {
				newGameInfoProvider.resetConfig({ ...config?.config, seed: parseInt(seed, 10) });
				setGameInfoProvider(newGameInfoProvider);
			});
		})()
	}, [seed, unlockedSpells])

	return [gameInfoProvider, data];
};

const SeedDataOutput = (props: ISeedDataProps) => {
	const { seed } = props;
	const [unlockedSpells] = useLocalStorage<boolean[]>('unlocked-spells', Array(393).fill(true));
	const [gameInfoProvider, data] = useGameInfoProvider(seed, unlockedSpells);
	return (
		<>
			{gameInfoProvider && data ? (
				<Stack>
					{data && `Seed: ${seed}`}
					{data && (
						<SeedInfo
							seed={seed}
							infoProvider={gameInfoProvider}
							data={data}
						/>
					)}
				</Stack>
			) : (
				<p>Loading</p>
			)}
		</>
	);
};

export default SeedDataOutput;
