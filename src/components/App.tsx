import React, { useState } from 'react';
import { Container, Tabs, Tab, Stack, Button } from 'react-bootstrap';
import * as wasmCheck from 'wasm-check';

import SeedInfo from './SeedInfo';
import SearchSeeds from './SearchSeeds';
import LiveSeedStats from './LiveSeedStats';
import Donate from './Donate';
import useLocalStorage from '../services/useLocalStorage';
// import { db } from "../services/db";

import './App.css';
import { SpoilerProvider } from './SpoilerContext';
import { ThemeProvider } from './ThemeContext';
import { AlchemyConfigProvider } from './AlchemyConfigContext';

import { Settings } from './Settings';

const Header = () => {
	const [show, setShow] = useState(false);

	// noita-tools.herokuapp.com
	const hostname = window.location.hostname;
	const notNewUrl = !hostname.includes('noitool.com');
	return (
		<Container fluid="sm" className="mb-2 p-0 d-flex justify-content-between">
			<div className="">
				<h3 className="fs-1 fw-bolder mt-2 mb-0 text-center">
					Noitool
				</h3>
				<p className="fs-4 fw-lighter m-1 mt-0 my-1 text-center">
					Noita tools and helpers
				</p>
				{notNewUrl && (
					<p className="mb-2 text-center">
						Use the new url!{' '}
						<a className="link-primary" href="https://www.noitool.com/">
							https://www.noitool.com/
						</a>{' '}
					</p>
				)}
			</div>
			<div className=" d-flex pt-3 justify-content-end align-items-start">
				<Button
					onClick={() => setShow(true)}
					size="lg"
					variant="outline-primary"
				>
					<i className="bi bi-gear"></i>
				</Button>
			</div>
			<Settings show={show} handleClose={() => setShow(false)} />
		</Container>
	);
};

const WasmError = props => {
	return (
		<div className="position-absolute top-50 start-50 translate-middle text-center w-75">
			<p>
				Looks like this browser does not support WASM, which is needed to run
				the generation code.
			</p>
			<p>
				Check{' '}
				<a
					href="https://webassembly.org/roadmap/"
					target="_blank"
					rel="noreferrer"
				>
					this page
				</a>{' '}
				to see which browsers support it.
			</p>
			<p>If you are sure that this message is an error, click below.</p>
			<Button onClick={props.onProceed}>Continue</Button>
		</div>
		// <Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
		// </Container>
	);
};

const Body = () => {
	const [tab, setTab] = useLocalStorage('last-tab', 'SeedInfo');

	const handleTab = key => {
		setTab(key);
	};

	return (
		<Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
			<Tabs activeKey={tab} onSelect={handleTab} id="main-tabs" className="">
				<Tab mountOnEnter eventKey="SeedInfo" title="Seed info">
					<SeedInfo />
				</Tab>
				<Tab mountOnEnter eventKey="SearchSeeds" title="Search For Seed">
					<SearchSeeds />
				</Tab>
				<Tab
					mountOnEnter
					eventKey="LiveSeedStats"
					title="Live game helper (beta)"
				>
					<LiveSeedStats />
				</Tab>
			</Tabs>
		</Container>
	);
};

const Footer = () => {
	return (
		<footer className="footer font-small p-1 pt-3">
			<Stack>
				<div className="footer-copyright text-center">
					<div className="mb-1">
						Help keep servers running! Every dollar helps ❤️
					</div>
					<Donate />
				</div>
				<div className="footer text-center py-1">
					Ideas? Issues? Bugs? Click{' '}
					<a
						target="_blank"
						rel="noreferrer"
						href="https://github.com/TwoAbove/noita-tools/issues/"
					>
						here
					</a>
					! {/* <br /> */}
					Or DM me on Noita's discord:{' '}
					<a
						target="_blank"
						rel="noreferrer"
						href="https://discord.gg/WtdfUsJD"
					>
						TwoAbove#0493
					</a>
				</div>
				{/* https://discord.gg/WtdfUsJD */}
				<div className="footer-copyright text-center py-1">
					© 2022 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
				</div>
			</Stack>
		</footer>
	);
};

const App: React.FC = () => {
	const [hasWasm, setHasWasm] = useState(() => wasmCheck.support());

	return (
		<SpoilerProvider>
			<ThemeProvider>
				<AlchemyConfigProvider>
					<div className="App bg-gradient">
						<div className="content bg-body rounded">
							<Header />
							{hasWasm ? (
								<Body />
							) : (
								<WasmError onProceed={() => setHasWasm(true)} />
							)}
						</div>
						<Footer />
					</div>
				</AlchemyConfigProvider>
			</ThemeProvider>
		</SpoilerProvider>
	);
};

export default App;
