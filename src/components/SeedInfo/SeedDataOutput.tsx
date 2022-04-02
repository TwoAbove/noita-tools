import React, { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import SeedInfo from './SeedInfo';

import i18n from '../../i18n';

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

const SeedDataOutput = (props: ISeedDataProps) => {
	const { seed } = props;
	const [data, setData] = useState<
		Awaited<ReturnType<GameInfoProvider['provideAll']>>
	>();
	const [gameInfoProvider] = useState(
		() => new GameInfoProvider({ seed: parseInt(seed, 10) }, i18n)
	);

	const updateData = async () => {
		const data = await gameInfoProvider.provideAll();
		setData(data);
	};

	useEffect(() => {
		waitToLoad(gameInfoProvider).then(async () => {
			const data = await gameInfoProvider.provideAll();
			setData(data);
			gameInfoProvider.addEventListener('update', event => {
				updateData();
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameInfoProvider]);

	useEffect(() => {
		if (gameInfoProvider.ready && seed) {
			gameInfoProvider.resetConfig({ seed: parseInt(seed, 10) });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seed]);

	return (
		<>
			{data ? (
				<Stack>
					{data && `Seed: ${seed}`}
					{data && <SeedInfo seed={seed} infoProvider={gameInfoProvider!} data={data} />}
				</Stack>
			) : (
				<p>Loading</p>
			)}
		</>
	);
};

export default SeedDataOutput;
