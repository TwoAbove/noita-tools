import React, { useContext } from 'react';
import { Alert, Container, Tabs, Tab, Stack, Form } from 'react-bootstrap';

import SeedInfo from './SeedInfo';
import SearchSeeds from './SearchSeeds';
import LiveSeedStats from './LiveSeedStats';
import Donate from './Donate';
import useLocalStorage from '../services/useLocalStorage';

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

const NeedInputAlert = () => {
	const [show, setShow] = useLocalStorage(
		'show-need-feedback-alert',
		true,
		d => {
			return d === 'true';
		},
		s => {
			return s.toString();
		}
	);

	const handleClose = () => {
		setShow(false);
	};

	return (
		<Container>
			<Alert show={show} variant="info" dismissible onClose={handleClose}>
				<div className="mt-2">
					Thank you for using this tool! <br />
					I want to improve it further, and need your feedback. <br />
					Click{' '}
					<a
						href="https://github.com/TwoAbove/noita-tools/discussions/73"
						target="_blank"
						rel="noreferrer"
					>
						here
					</a>{' '}
					if you have any ideas!
				</div>
			</Alert>
		</Container>
	);
};

const Header = props => {
	// noita-tools.herokuapp.com
	const hostname = window.location.hostname;
	const notNewUrl = !hostname.includes('noitool.com');
	return (
		<Stack direction="horizontal">
			<div className="w-25"></div>
			<Stack className="w-50">
				<h1 className="display-3 m-1 mb-3 text-center">Noitool</h1>
				<h6 className="display-6 m-1 text-center">Noita tools and helpers</h6>
				{notNewUrl && (
					<p className="m-1 text-center">
						Use the new url!{' '}
						<a className="link-primary" href="https://www.noitool.com/">
							https://www.noitool.com/
						</a>{' '}
					</p>
				)}
			</Stack>
			<div className="w-25"></div>
		</Stack>
	);
};

const App: React.FC = () => {
	const [tab, setTab] = useLocalStorage(
		'last-tab',
		'SeedInfo',
		d => {
			return d || 'SeedInfo';
		},
		s => {
			return s;
		}
	);

	const handleTab = key => {
		setTab(key);
	};

	return (
		<SpoilerProvider>
			<div className="App bg-gradient">
				<div className="content shadow-sm bg-body rounded">
					<Header />
					<NeedInputAlert />
					<Container className="mb-5 bg-white rounded">
						<Tabs
							defaultActiveKey={tab}
							onSelect={handleTab}
							id="main-tabs"
							className=""
						>
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
				</div>
				<footer className="footer font-small blue p-1 pt-3">
					<Stack>
						<div className="footer text-center py-2">
							Ideas? Issues? Bugs? Click{' '}
							<a
								target="_blank"
								rel="noreferrer"
								href="https://github.com/TwoAbove/noita-tools/discussions"
							>
								here
							</a>
							!
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
