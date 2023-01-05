import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import Clickable from '../../Icons/Clickable';
import { capitalize } from '../../../services/helpers';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';

interface IMapSearchProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

const MapSearch: FC<IMapSearchProps> = ({ onUpdateConfig, config }) => {
	const { val: startingFlaskType } = config;

	const setStartingFlaskType = newConfig => {
		onUpdateConfig({
			type: 'map',
			path: '',
			params: [],
			val: newConfig
		});
	};

	const handleClicked = type => {
		setStartingFlaskType(type);
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">Enabled</Row>
		</Container>
	);
};

export default MapSearch;
