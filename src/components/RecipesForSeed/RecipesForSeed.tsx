import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import SeedForm from './SeedForm';
import SeedDataOutput from './SeedDataOutput';

const SeedData = () => {
	const [seed, setSeed] = React.useState<any>('');

	return (
		<Container className="container shadow-lg mb-5">
			<h4>LC and AP ingredients for a seed</h4>
			<Row>
				<Col xs={12} xl={6}>
					<SeedForm onSubmit={seed => setSeed(seed)} />
				</Col>
			</Row>
			{seed ? <SeedDataOutput seed={seed} /> : null}
		</Container>
	);
};

export default SeedData;
