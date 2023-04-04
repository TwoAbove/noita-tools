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

const perf = async (infoProvider: GameInfoProvider) => {
	infoProvider.randoms.SetWorldSeed(299840293);
	const ans = {
		coalmine: infoProvider.providers.map.provide(34, 15, 299840293)!
			.interestPoints,
		excavationSite: infoProvider.providers.map.provide(34, 17, 299840293)!
			.interestPoints,
		snowCave: infoProvider.providers.map.provide(34, 20, 299840293)!
			.interestPoints,
		snowcastle: infoProvider.providers.map.provide(34, 24, 299840293)!
			.interestPoints,
		vault: infoProvider.providers.map.provide(34, 31, 299840293)!.interestPoints
	};
	console.log(ans);
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
				value={infoProvider.config.seed}
				onChange={e =>
					infoProvider.updateConfig({ seed: parseInt(e.target.value, 10) })
				}
				placeholder="world seed"
			/>
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
			<Button onClick={() => perf(infoProvider)}>Test</Button>
			<MapComponent
				mapPart="MainPath"
				worldOffset={worldOffset}
				infoProvider={infoProvider}
			/>
		</div>
	);
};

const TestBench = () => {
	// const seed = '1674055821';
	const seed = '299840293';
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
