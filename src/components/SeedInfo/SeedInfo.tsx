/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Alchemy from './SeedInfoViews/Alchemy';

import GameInfoProvider from '../../services/SeedInfo/infoHandler';

// import Map from './SeedInfoViews/Map';
import Rain from './SeedInfoViews/Rain';
import Start from './SeedInfoViews/Start';
import Biome from './SeedInfoViews/Biome';
import Watercave from './SeedInfoViews/Watercave';
import FungalShifts from './SeedInfoViews/FungalShifts';
import HolyMountain from './SeedInfoViews/HolyMountain';

import { db } from '../../services/db';
import { useLiveQuery } from 'dexie-react-hooks';

const WithShow = (props: {
	id: string;
	children: React.ReactNode;
}): JSX.Element => {
	const config = useLiveQuery(() =>
		db.configItems.get({ key: `panel-${props.id}-config` })
	);
	const hasConfig = !!config;

	if (hasConfig && !config.val) {
		return <div></div>;
	}

	return props.children as any;
};

interface ISeedInfoProps {
	seed: string;
	data: Awaited<ReturnType<GameInfoProvider['provideAll']>>;
	infoProvider: GameInfoProvider; // This should be a context in the future
}

const SeedInfo = (props: ISeedInfoProps) => {
	const { data, infoProvider, seed } = props;

	return (
		<Row className="m-0">
			<Col className="p-0" lg={7}>
				{/* <Row xs="auto">
						<Map seed={seed} infoProvider={infoProvider} />
				</Row> */}
				<Row xs="auto">
					<Col className="col-12">
						<WithShow id="holy-mountain">
							<HolyMountain
								infoProvider={infoProvider}
								shop={data.shop}
								perks={data.perks}
								perkDeck={data.perkDeck}
							/>
						</WithShow>
					</Col>
					<Col>
						<WithShow id="start">
							<Start
								infoProvider={infoProvider}
								startingFlask={data.startingFlask}
								startingSpell={data.startingSpell}
								startingBombSpell={data.startingBombSpell}
							/>
						</WithShow>
					</Col>
					<Col>
						<WithShow id="rain">
							<Rain infoProvider={infoProvider} rainData={data.rainType} />
						</WithShow>
					</Col>
					<Col>
						<WithShow id="alchemy">
							<Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
						</WithShow>
					</Col>
					<Col>
						<WithShow id="biome">
							<Biome
								infoProvider={infoProvider}
								biomeData={data.biomeModifiers}
							/>
						</WithShow>
					</Col>
					<Col>
						<WithShow id="watercave">
							<Watercave
								infoProvider={infoProvider}
								waterCave={data.waterCave}
							/>
						</WithShow>
					</Col>
				</Row>
			</Col>
			<Col className="p-0" lg={5}>
				<WithShow id="fungal">
					<FungalShifts
						infoProvider={infoProvider}
						fungalData={data.fungalShifts}
					/>
				</WithShow>
			</Col>
		</Row>
	);
};

export default SeedInfo;
