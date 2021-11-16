import React, { useContext } from 'react';
import { Container, Tabs, Tab, Stack, Form } from 'react-bootstrap';

import RecipesForSeed from './RecipesForSeed/RecipesForSeed';
import SeedFromRecipes from './SeedFromRecipes/SeedFromRecipes';
import Donate from './Donate';

import './App.css';
import { SpoilerProvider, SpoilerContext } from './SpoilerContext';

const SpoilerChange = props => {
	const [spoil, setSpoiler] = useContext(SpoilerContext);
	return (
		<div>
			<Form.Switch
				checked={spoil}
				onChange={e => {
					setSpoiler(e.target.checked);
				}}
				id="custom-switch"
				label="Enable alchemy spoilers"
			/>
		</div>
	);
};

const Header = props => {
	return (
		<Stack direction="horizontal">
			<div className="w-25"></div>
			<Stack className="w-50">
				<h1 className="display-3 m-1 mb-3 text-center">Noitool</h1>
				<h6 className="display-6 m-1 text-center">Noita tools and helpers</h6>
			</Stack>
			<div className="w-25"></div>
		</Stack>
	);
};

const App: React.FC = () => {
	return (
		<SpoilerProvider>
			<div className="App bg-gradient">
				<div className="content shadow-sm bg-body rounded">
					<Header />
					<Container className="mb-5 bg-white rounded">
						<Tabs defaultActiveKey="RecipesForSeed" id="main-tabs" className="">
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
							<Tab
								mountOnEnter
								eventKey="LiveSeedStats"
								title="Live game helper"
							>
								<LiveSeedStats />
							</Tab>
						</Tabs>
					</Container>
				</div>
				<footer className="footer font-small blue p-1 pt-3">
					<Stack>
						<div className="footer text-center py-2">
							Ideas? Issues? Click{' '}
							<a href="https://github.com/TwoAbove/noita-tools/issues/new/choose">
								here
							</a>{' '}
						</div>
						<div className="footer-copyright text-center py-2">
							Like this tool? Buy me a coffee!
							<Donate />
						</div>
						<div className="mx-auto">
							<SpoilerChange />
						</div>
						<div className="footer-copyright text-center py-2">
							© 2021 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
						</div>
					</Stack>
				</footer>
			</div>
		</SpoilerProvider>
	);
};

export default App;
