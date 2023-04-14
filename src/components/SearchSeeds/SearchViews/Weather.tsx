import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { MaterialInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Material';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';

import Clickable from '../../Icons/Clickable';

import i18n from '../../../i18n';

interface IWeatherProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

const material = new MaterialInfoProvider(i18n);

const rainOptions = ['', 'water', 'blood', 'acid', 'slime'];

const Weather: FC<IWeatherProps> = ({ onUpdateConfig, config }) => {
	const { rain_material: rainMaterial } = config.val;

	const setRainType = newConfig => {
		onUpdateConfig({
			type: 'weather',
			path: '',
			params: [],
			val: {
				rain_material: newConfig
			}
		});
	};

	const handleClicked = type => {
		setRainType(type);
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">
				{rainOptions.map((type, i) => {
					return (
						<Col key={i}>
							<Clickable
								className="m-3"
								onClick={() => handleClicked(type)}
								clicked={type === rainMaterial}
							>
								<div>{type ? material.translate(type) : 'Any'}</div>
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default Weather;
