// This should be storybook,
// but I can't get it to work with all of the WASM stuff that we need.
import { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import useLocalStorage from '../../services/useLocalStorage';
import Icon from '../Icons/Icon';
import Spell from '../Icons/Spell';
import { useGameInfoProvider } from '../SeedInfo/SeedDataOutput';
import MapComponent from '../SeedInfo/SeedInfoViews/Map';

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;

	const [worldOffset, setworldOffset] = useState(0);
	const [xOffset, setxOffset] = useState(0);
	const [yOffset, setyOffset] = useState(0);
	const [iter, setiter] = useState(0);

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
			<MapComponent
				xOffset={xOffset}
				yOffset={yOffset}
				iter={iter}
				worldOffset={worldOffset}
				infoProvider={infoProvider}
				seed={infoProvider.config.seed.toString()}
			/>
		</div>
	);
};

const TestBench = () => {
	const seed = '1674055821';
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
