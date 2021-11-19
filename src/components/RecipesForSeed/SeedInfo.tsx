/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Alchemy from './SeedInfoViews/Alchemy';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import Rain from './SeedInfoViews/Rain';
import Biome from './SeedInfoViews/Biome';
import FungalShifts from './SeedInfoViews/FungalShifts';
import Perks from './SeedInfoViews/Perks';

import { SpoilerContext } from '../SpoilerContext';

interface ISeedInfoProps {
	data: ReturnType<GameInfoProvider['provideAll']>;
	infoProvider: GameInfoProvider; // This should be a context in the future
}

const SeedInfo = (props: ISeedInfoProps) => {
	const { data, infoProvider } = props;
	const [spoil, setSpoiler] = useContext(SpoilerContext);

	return (
		<div>
			<Row>
				<Col lg={7}>
					<Perks infoProvider={infoProvider} perks={data.perks} />
					{/* <Rain infoProvider={infoProvider} rainData={data.rainType} /> */}
					<Biome infoProvider={infoProvider} biomeData={data.biomeModifiers} />
				</Col>
				<Col lg={5}>
					{spoil && (
						<Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
					)}
					<FungalShifts
						infoProvider={infoProvider}
						fungalData={data.fungalShifts}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default SeedInfo;
