import React from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';

import { MaterialPicker } from '../services/Calculator2';

import SeedForm from './SeedForm';
import MaterialList from './MaterialList';

import './App.css';

const App: React.FC = () => {
	const [data, setData] = React.useState();
	return (
		<div className="App">
			<div className="content">
				<Jumbotron>
					<h1 className="display-3 text-center">Noita Helpers</h1>
					<hr />
					<p className="lead text-center">
						Get Lively Concoction and Alchemic Precursor recipes for your seed
					</p>
				</Jumbotron>
				<Container className="container">
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
							{data && (
								<MaterialList seed={data.seed} LC={data.LC} AP={data.AP} />
							)}
						</Col>
					</Row>
				</Container>
			</div>
			<footer className="footer font-small blue">
				<div className="footer-copyright text-center py-2">
					© 2020 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
				</div>
			</footer>
		</div>
	);
};

export default App;
