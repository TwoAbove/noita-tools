import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
	IRule,
	MaterialInfoProvider
} from '../../../services/SeedInfo/infoHandler';
import Clickable from '../../Icons/Clickable';
import { capitalize } from '../../../services/helpers';

interface IStartingFlaskProps {
	onUpdateConfig: (config: IRule) => void;
}

const flaskOptions = [
	'',
	'mud',
	'water_swamp',
	'water_salt',
	'swamp',
	'snow',
	'water',
	'blood',
	'acid',
	'magic_liquid_polymorph',
	'magic_liquid_random_polymorph',
	'magic_liquid_berserk',
	'magic_liquid_charm',
	'magic_liquid_movement_faster',
	'urine',
	'gold',
	'slime',
	'gunpowder_unstable'
];
const material = new MaterialInfoProvider({} as any);

const StartingFlask = (props: IStartingFlaskProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [startingFlaskType, setStartingFlaskType] = useState('');

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'startingFlask',
			path: '',
			params: [],
			val: startingFlaskType
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startingFlaskType]);

	const handleClicked = type => {
		setStartingFlaskType(type);
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">
				{flaskOptions.map((type, i) => {
					return (
						<Col key={type}>
							<Clickable
								onClick={() => handleClicked(type)}
								clicked={type === startingFlaskType}
							>
								<div className="m-3">
									{type
										? capitalize(material.provide(type).translated_name)
										: 'Any'}
								</div>
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default StartingFlask;
