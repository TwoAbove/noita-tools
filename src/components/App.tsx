import React from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';

import RecipesForSeed from './RecipesForSeed/RecipesForSeed';
import SeedFromRecipes from './SeedFromRecipes/SeedFromRecipes';
import Donate from './Donate';

import './App.css';

const App: React.FC = () => {
	return (
		<div className="App">
			<div className="content">
				<Jumbotron>
					<h1 className="display-3 text-center">Noita Helpers</h1>
					<hr />
					<p className="lead text-center">
						Now updated for 1.0!
					</p>
					<hr />
					<p className="lead text-center">
						Get Lively Concoction and Alchemic Precursor recipes for your seed
					</p>
					<p className="lead text-center">
						Get a seed from desired Lively Concoction and Alchemic Precursor
						ingredients
					</p>
				</Jumbotron>
				<Container className="shadow-lg p-3 mb-5 bg-white rounded">
					<RecipesForSeed />
					<SeedFromRecipes />
				</Container>
			</div>
			<footer className="footer font-small blue">
				<div className="footer text-center py-2">Issues? Create an issue <a href="https://github.com/TwoAbove/noita-tools/issues/new/choose">here</a> </div>
				<div className="footer-copyright text-center py-2">
					Donate to get this tool its own domain name!
				</div>
				<Donate />
				<div className="footer-copyright text-center py-2">
					© 2021 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
				</div>
			</footer>
		</div>
	);
};

export default App;
