import React from 'react';
import { Container, Row, Col, Stack } from 'react-bootstrap';

import SeedForm from './SeedForm';
import SeedDataOutput from './SeedDataOutput';

const SeedData = () => {
	const [seed, setSeed] = React.useState<any>('');

	return (
		<div className="px-sm-3 px-2 pb-3 mb-5">
			<h4 className='pt-3'>Seed info</h4>
			<p>Get lots of information about a seed, like perks in holy mountains, fungal shifts, etc.</p>
			<Stack>
					<SeedForm onSubmit={seed => setSeed(seed)} />
			</Stack>
			{seed ? <SeedDataOutput seed={seed} /> : null}
		</div>
	);
};

export default SeedData;
