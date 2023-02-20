import { uniqueId } from 'lodash';
import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import { RuleType } from '../../services/SeedInfo/infoHandler/IRule';
import { SeedSearcher } from '../../services/seedSearcher';
import SeedSolver from '../../services/seedSolverHandler';
import useLocalStorage from '../../services/useLocalStorage';
import Icon from '../Icons/Icon';
import Spell from '../Icons/Spell';
import { useGameInfoProvider } from '../SeedInfo/SeedDataOutput';
import MapComponent from '../SeedInfo/SeedInfoViews/Map';

const rules = {
	coalmine: {
		pos: {
			x: 34,
			y: 15
		},
		searchType: 'and',
		search: ['data/biome_impl/coalmine/receptacle_oil.png'],
		funcs: ['load_pixel_scene2']
	},
	excavationSite: {
		pos: {
			x: 34,
			y: 17
		},
		searchType: 'and',
		search: [
			'data/biome_impl/excavationsite/meditation_cube.png',
			'data/biome_impl/excavationsite/receptacle_steam.png'
		],
		funcs: ['spawn_meditation_cube', 'load_pixel_scene4_alt']
	},
	snowCastle: {
		pos: {
			x: 34,
			y: 25
		},
		searchType: 'or',
		search: [
			'data/biome_impl/snowcastle/kitchen.png',
			'data/biome_impl/snowcastle/sauna.png'
		],
		funcs: ['load_pixel_scene2']
	},
	snowCave: {
		pos: {
			x: 34,
			y: 21
		},
		searchType: 'and',
		search: [
			'data/biome_impl/snowcave/receptacle_water.png',
			'data/biome_impl/snowcave/buried_eye.png'
		],
		funcs: ['load_pixel_scene', 'load_pixel_scene3']
	},
	vault: {
		pos: {
			x: 34,
			y: 31
		},
		searchType: 'and',
		search: ['data/biome_impl/vault/lab_puzzle.png'],
		funcs: ['load_pixel_scene2']
	}
};

const compute = async (infoProvider: GameInfoProvider) => {
	await new Promise(res => setTimeout(res, 1000));
	const seedSolver = new SeedSolver(4, false);
	// 	const seedSearcher = new SeedSearcher(infoProvider);
	// await seedSearcher.update({
	// 	findAll: true
	// });

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find coalmine 5_000');
	// await seedSearcher.update({
	// 	rules: {
	// 		id: uniqueId(),
	// 		type: RuleType.AND,
	// 		rules: [
	// 			{
	// 				id: uniqueId(),
	// 				type: 'map',
	// 				val: { coalmine: rules.coalmine }
	// 			}
	// 		],
	// 		selectedRule: 'search'
	// 	}
	// } as any);
	// console.log(seedSearcher.findSync(1, 5_000).length);
	// console.profileEnd('find coalmine 5_000');

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find excavationSite 5_000');
	// await seedSearcher.update({
	// 	rules: {
	// 		id: uniqueId(),
	// 		type: RuleType.AND,
	// 		rules: [
	// 			{
	// 				id: uniqueId(),
	// 				type: 'map',
	// 				val: { excavationSite: rules.excavationSite }
	// 			}
	// 		],
	// 		selectedRule: 'search'
	// 	}
	// } as any);
	// console.log(seedSearcher.findSync(1, 5_000).length);
	// console.profileEnd('find excavationSite 5_000');

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find snowCave 5_000');
	// await seedSearcher.update({
	// 	rules: {
	// 		id: uniqueId(),
	// 		type: RuleType.AND,
	// 		rules: [
	// 			{
	// 				id: uniqueId(),
	// 				type: 'map',
	// 				val: { snowCave: rules.snowCave }
	// 			}
	// 		],
	// 		selectedRule: 'search'
	// 	}
	// } as any);
	// console.log(seedSearcher.findSync(1, 5_000).length);
	// console.profileEnd('find snowCave 5_000');

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find snowCastle 5_000');
	// await seedSearcher.update({
	// 	rules: {
	// 		id: uniqueId(),
	// 		type: RuleType.AND,
	// 		rules: [
	// 			{
	// 				id: uniqueId(),
	// 				type: 'map',
	// 				val: { snowCastle: rules.snowCastle }
	// 			}
	// 		],
	// 		selectedRule: 'search'
	// 	}
	// } as any);
	// console.log(seedSearcher.findSync(1, 5_000).length);
	// console.profileEnd('find snowCastle 5_000');

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find vault 5_000');
	// await seedSearcher.update({
	// 	rules: {
	// 		id: uniqueId(),
	// 		type: RuleType.AND,
	// 		rules: [
	// 			{
	// 				id: uniqueId(),
	// 				type: 'map',
	// 				val: { vault: rules.vault }
	// 			}
	// 		],
	// 		selectedRule: 'search'
	// 	}
	// } as any);
	// console.log(seedSearcher.findSync(1, 5_000).length);
	// console.profileEnd('find vault 5_000');

	// await new Promise(res => setTimeout(res, 100));
	// console.log('starting profiling');
	// console.profile('find all');
	// await seedSearcher.update({ rules: testConfig } as any);
	// console.log(seedSearcher.findSync(1, 5000).length);
	// console.profileEnd('find all');
	let res;
	console.log('starting');
	console.profile('find all 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						excavationSite: rules.excavationSite,
						snowCastle: rules.snowCastle,
						coalmine: rules.coalmine,
						snowCave: rules.snowCave,
						vault: rules.vault
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find all 5000');
	return;
	console.profile('find excavationSite 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						excavationSite: rules.excavationSite
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find excavationSite 5000');

	console.log('starting');
	console.profile('find snowCave 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						snowCave: rules.snowCave
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find snowCave 5000');

	console.log('starting');
	console.profile('find vault 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						vault: rules.vault
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find vault 5000');

	console.log('starting');
	console.profile('find snowCastle 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						snowCastle: rules.snowCastle
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find snowCastle 5000');

	console.log('starting');
	console.profile('find coalmine 5000');
	res = await seedSolver.searchChunk(
		1,
		5000,
		{
			id: uniqueId(),
			type: RuleType.AND,
			rules: [
				{
					id: uniqueId(),
					type: 'map',
					val: {
						coalmine: rules.coalmine
					}
				}
			],
			selectedRule: 'search'
		} as any,
		progress => {
			// console.log(progress);
		}
	);
	console.log('done');
	console.log(res);
	console.profileEnd('find coalmine 5000');
};

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;

	const [worldOffset, setworldOffset] = useState(0);
	const [xOffset, setxOffset] = useState(0);
	const [yOffset, setyOffset] = useState(0);
	const [iter, setiter] = useState(1);
	return (
		<div>
			<Form.Control
				type="number"
				value={worldOffset}
				onChange={e => setworldOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="worldOffset"
			/>
			<Form.Control
				type="number"
				value={xOffset}
				onChange={e => setxOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="xOffset"
			/>
			<Form.Control
				type="number"
				value={yOffset}
				onChange={e => setyOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="yOffset"
			/>
			<Form.Control
				type="number"
				value={iter}
				onChange={e => setiter(parseInt(e.target.value, 10) || 0)}
				placeholder="iter"
			/>
			<Button onClick={() => compute(infoProvider)}>Test</Button>
			{/* <MapComponent
				xOffset={xOffset}
				yOffset={yOffset}
				iter={iter}
				worldOffset={worldOffset}
				infoProvider={infoProvider}
				seed={infoProvider.config.seed.toString()}
			/> */}
		</div>
	);
};

const TestBench = () => {
	// const seed = '1674055821';
	const seed = '410';
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
