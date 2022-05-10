import React, { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import SeedInfo from './SeedInfo';

import i18n from '../../i18n';
import { db } from '../../services/db';

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

const useGameInfoProvider = (
	seed: string
): [GameInfoProvider, Awaited<ReturnType<GameInfoProvider['provideAll']>>?] => {
	const [data, setData] = useState<
		Awaited<ReturnType<GameInfoProvider['provideAll']>>
	>();

	const [gameInfoProvider] = useState(() => {
		const gameInfoProvider = new GameInfoProvider(
			{ seed: parseInt(seed, 10) },
			i18n
		);
		gameInfoProvider.addEventListener('update', event => {
			// Save config for resetting
			const config = gameInfoProvider.config;
			db.setSeedInfo("" + config.seed, config);
			gameInfoProvider.provideAll().then(data => {
				setData(data);
			});
		});
		return gameInfoProvider;
	});

	useEffect(() => {
		waitToLoad(gameInfoProvider).then(async () => {
			if (seed) {
				const config = await db.seedInfo.get({ seed });
				gameInfoProvider.resetConfig({ ...config?.config, seed: parseInt(seed, 10) });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seed]);

	return [gameInfoProvider, data];
};

const SeedDataOutput = (props: ISeedDataProps) => {
	const { seed } = props;
	const [gameInfoProvider, data] = useGameInfoProvider(seed);
	return (
		<>
			{data ? (
				<Stack>
					{data && `Seed: ${seed}`}
					{data && (
						<SeedInfo
							seed={seed}
							infoProvider={gameInfoProvider!}
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
