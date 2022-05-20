// This should be storybook,
// but I can't get it to work with all of the WASM stuff that we need.

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import i18n from '../i18n';
import GameInfoProvider from '../services/SeedInfo/infoHandler';
import { IShopType } from '../services/SeedInfo/infoHandler/InfoProviders/Shop';
import useLocalStorage from '../services/useLocalStorage';
import Shop from './SeedInfo/SeedInfoViews/ShopItems';

const ans2 = {
	cards: {
		cards: ['ORBIT_FIREBALLS', 'BUCKSHOT', 'BUCKSHOT', 'BUCKSHOT', 'BUCKSHOT']
	},
	gun: {},
	ui: {}
};

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;

	const [show, setShow] = useState(true);

	console.groupCollapsed('get_gun_data(40, 1, false, false)');
	const gun = infoProvider.providers.wand.provide(
		-225,
		2931,
		250,
		1,
		true,
		false
	);
	// const gun = infoProvider.providers.wand.get_gun_data(200, 11, false, false) as any;
	// console.log(gun);
	// const res = infoProvider.providers.wand.wand_add_random_cards(55, 55, gun, 11);
	gun.gun.cost = 9999;
	console.groupEnd();
	const shop = {
		type: IShopType.wand,
		items: [gun]
	}
	return (
		<div>
			<Shop
				show={show}
				shop={shop as any}
				handleClose={() => setShow(false)}
				isFavorite={(id: string) => false}
			/>
		</div>
	);
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
	const seed = 1871377166;
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
