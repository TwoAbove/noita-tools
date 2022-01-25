import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { MaterialInfoProvider } from '../../../services/SeedInfo/infoHandler/InfoProviders/Material';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';

import Clickable from '../../Icons/Clickable';

interface IRainProps {
	onUpdateConfig: (config: IRule) => void;
}

const material = new MaterialInfoProvider({} as any);

const rainOptions = ["", "water", "blood", "acid", "slime"]

const Rain = (props: IRainProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [rainMaterial, setRainType] = useState('');

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'rain',
			path: '',
			params: [],
			val: {
				material: rainMaterial
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rainMaterial]);

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
								<div>
									{type ? material.translate(type) : "Any"}
								</div>
							</Clickable>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default Rain;
