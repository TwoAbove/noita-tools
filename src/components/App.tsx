import React from 'react';
import {
	Container,
	Tabs,
	Tab
} from 'react-bootstrap';

import RecipesForSeed from './RecipesForSeed/RecipesForSeed';
import SeedFromRecipes from './SeedFromRecipes/SeedFromRecipes';
import LiveSeedStats from './LiveSeedStats/LiveSeedStats';
import Donate from './Donate';

import './App.css';

const App: React.FC = () => {
	return (
		<div className="App bg-gradient">
			<div className="content shadow-sm bg-body rounded">
				<div>
					<h1 className="display-3 m-1 mb-3 text-center">Noitool</h1>
					<h6 className="display-6 m-1 text-center">Noita tools and helpers</h6>
					{/* <hr />
					<p className="lead text-center">
						Get seed information
					</p>
					<p className="lead text-center">
						Find a seed
						{/* Get a seed from desired Lively Concoction and Alchemic Precursor ingredients */}
					{/* </p> */}
					{/* <hr /> */}
				</div>
				<Container className="mb-5 bg-white rounded">
					<Tabs
						defaultActiveKey="RecipesForSeed"
						id="main-tabs"
						className=""
					>
						<Tab
							mountOnEnter
							eventKey="RecipesForSeed"
							title="Recipes For Seed"
						>
							<RecipesForSeed />
						</Tab>
						<Tab
							mountOnEnter
							eventKey="SeedFromRecipes"
							title="Search For Seed"
						>
							<SeedFromRecipes />
						</Tab>
						<Tab mountOnEnter eventKey="LiveSeedStats" title="Live game helper">
							<LiveSeedStats />
						</Tab>
					</Tabs>
				</Container>
			</div>
			<footer className="footer font-small blue p-1 pt-3">
				<div className="footer text-center py-2">
					Ideas? Issues? Click{' '}
					<a href="https://github.com/TwoAbove/noita-tools/issues/new/choose">
						here
					</a>{' '}
				</div>
				<div className="footer-copyright text-center py-2">
					Like this tool? Buy me a coffee!
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
