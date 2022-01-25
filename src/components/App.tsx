import React, { useContext } from 'react';
import { Alert, Container, Tabs, Tab, Stack, Form } from 'react-bootstrap';
import DarkModeToggle from 'react-dark-mode-toggle';

import SeedInfo from './SeedInfo';
import SearchSeeds from './SearchSeeds';
import LiveSeedStats from './LiveSeedStats';
import Donate from './Donate';
import useLocalStorage from '../services/useLocalStorage';

import './App.css';
import { SpoilerProvider, SpoilerContext } from './SpoilerContext';
import { ThemeProvider, ThemeContext } from './ThemeContext';

const SpoilerChange = props => {
	const [spoil, setSpoiler] = useContext(SpoilerContext);
	return (
		<Form.Switch
			checked={spoil}
			onChange={e => {
				setSpoiler(e.target.checked);
			}}
			id="custom-switch"
			label="Enable alchemy spoilers"
		/>
	);
};

const DarkMode = props => {
	const [theme, setTheme] = useContext(ThemeContext);
	return (
		<DarkModeToggle
			onChange={checked => {
				setTheme(checked ? 'dark' : 'light');
			}}
			checked={theme === 'dark'}
			size={60}
		/>
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
				<h1 className="display-3 fw-bolder m-1 my-3 text-center">Noitool</h1>
				<h6 className="display-6 fw-lighter m-1 text-center">
					Noita tools and helpers
				</h6>
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
			<ThemeProvider>
				<div className="App bg-gradient">
					<div className="content bg-body rounded">
						<Header />
						<NeedInputAlert />
						<Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
							<Tabs
								defaultActiveKey={tab}
								onSelect={handleTab}
								id="main-tabs"
								className=""
							>
								<Tab mountOnEnter eventKey="SeedInfo" title="Seed info">
									<SeedInfo />
								</Tab>
								<Tab
									mountOnEnter
									eventKey="SearchSeeds"
									title="Search For Seed"
								>
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
					<footer className="footer font-small p-1 pt-3">
						<Stack>
							<div className="footer-copyright text-center py-2">
								<div className="mb-1">
									Help keep servers running! Every dollar helps ❤️
								</div>
								<Donate />
							</div>
							<div className="footer text-center py-2">
								Ideas? Issues? Bugs? Click{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://github.com/TwoAbove/noita-tools/issues/"
								>
									here
								</a>
								!
							</div>
							<div className="mx-auto d-flex justify-content-center">
								<div className="">
									<SpoilerChange />
								</div>
							</div>
							<div className="mx-auto d-flex justify-content-center">
								<div className="ms-3">
									<DarkMode />
								</div>
							</div>
							<div className="footer-copyright text-center py-2">
								© 2022 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
							</div>
						</Stack>
					</footer>
				</div>
			</ThemeProvider>
		</SpoilerProvider>
	);
};

export default App;
