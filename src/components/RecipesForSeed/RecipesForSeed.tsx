import React from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';

import { MaterialPicker } from '../../services/Calculator2';

import SeedForm from './SeedForm';
import MaterialList from './MaterialList';

const RecipesForSeed = () => {
	const [data, setData] = React.useState<any>();

	return (
		<Container className="container shadow-sm mb-5">
			<h4>LC and AP ingredients for a seed</h4>
			<Row>
				<Col xs={12} sm={6}>
					<SeedForm
						onSubmit={seed =>
							setData(MaterialPicker.PickForSeed(parseInt(seed, 10)))
						}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={12} sm={6}>
					{data && `Seed: ${data.seed}`}
					{data && <MaterialList LC={data.LC} AP={data.AP} />}
				</Col>
			</Row>
		</Container>
	);
};

export default RecipesForSeed;
