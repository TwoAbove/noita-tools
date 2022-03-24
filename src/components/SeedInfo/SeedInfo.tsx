/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Alchemy from './SeedInfoViews/Alchemy';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';

import Map from './SeedInfoViews/Map';
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
		<Row className="m-0">
			<Col className="p-0" lg={7}>
				<Row xs="auto">
					<Col className="col-12">
						<Map infoProvider={infoProvider} />
					</Col>
					<Col className="col-12">
						<HolyMountain
							infoProvider={infoProvider}
							shop={data.shop}
							perks={data.perks}
						/>
					</Col>
					<Col>
						<Start
							infoProvider={infoProvider}
							startingFlask={data.startingFlask}
							startingSpell={data.startingSpell}
							startingBombSpell={data.startingBombSpell}
						/>
					</Col>
					<Col>
						<Rain infoProvider={infoProvider} rainData={data.rainType} />
					</Col>
					{spoil && (
						<Col>
							<Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
						</Col>
					)}
					<Col>
						<Biome
							infoProvider={infoProvider}
							biomeData={data.biomeModifiers}
						/>
					</Col>
				</Row>
			</Col>
			<Col className="p-0" lg={5}>
				<FungalShifts
					infoProvider={infoProvider}
					fungalData={data.fungalShifts}
				/>
			</Col>
		</Row>
	);
};

export default SeedInfo;
