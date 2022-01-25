/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Alchemy from './SeedInfoViews/Alchemy';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import Rain from './SeedInfoViews/Rain';
import Start from './SeedInfoViews/Start';
import Biome from './SeedInfoViews/Biome';
import FungalShifts from './SeedInfoViews/FungalShifts';
import HolyMountain from './SeedInfoViews/HolyMountain';

import { SpoilerContext } from '../SpoilerContext';

interface ISeedInfoProps {
	data: ReturnType<GameInfoProvider['provideAll']>;
	infoProvider: GameInfoProvider; // This should be a context in the future
}

const SeedInfo = (props: ISeedInfoProps) => {
	const { data, infoProvider } = props;
	const [spoil, setSpoiler] = useContext(SpoilerContext);
	return (
			<Row className='m-0'>
				<Col className='p-0' lg={7}>
					<HolyMountain
						infoProvider={infoProvider}
						shop={data.shop}
						perks={data.perks}
					/>
					<Start infoProvider={infoProvider} startingFlask={data.startingFlask} startingSpell={data.startingSpell} startingBombSpell={data.startingBombSpell} />
					{/* <Rain infoProvider={infoProvider} rainData={data.rainType} /> */}
					<Biome infoProvider={infoProvider} biomeData={data.biomeModifiers} />
				</Col>
				<Col className='p-0' lg={5}>
					{spoil && (
						<Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
					)}
					<FungalShifts
						infoProvider={infoProvider}
						fungalData={data.fungalShifts}
					/>
				</Col>
			</Row>
	);
};

export default SeedInfo;
