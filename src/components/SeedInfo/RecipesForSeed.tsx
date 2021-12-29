import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import SeedForm from './SeedForm';
import SeedDataOutput from './SeedDataOutput';

const SeedData = () => {
	const [seed, setSeed] = React.useState<any>('');

	return (
		<div className="px-sm-3 px-2 pb-3 mb-5">
			<h4 className='pt-3'>Seed info</h4>
			<p>Get lots of information about a seed, like perks in holy mountains, fungal shifts, etc.</p>
			<Row>
				<Col xs={12} xl={6}>
					<SeedForm onSubmit={seed => setSeed(seed)} />
				</Col>
			</Row>
			{seed ? <SeedDataOutput seed={seed} /> : null}
		</div>
	);
};

export default SeedData;
