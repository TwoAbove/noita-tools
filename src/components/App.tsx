import React, { useState, useContext, useEffect } from 'react';
import {
	Alert,
	Container,
	Tabs,
	Tab,
	Stack,
	Form,
	Modal,
	Button
} from 'react-bootstrap';
import DarkModeToggle from 'react-dark-mode-toggle';

import SeedInfo from './SeedInfo';
import SearchSeeds from './SearchSeeds';
import LiveSeedStats from './LiveSeedStats';
import Donate from './Donate';
import useLocalStorage from '../services/useLocalStorage';
// import { db } from "../services/db";
import i18n from '../i18n';

import './App.css';
import { SpoilerProvider, SpoilerContext } from './SpoilerContext';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import {
	AlchemyConfigProvider,
	AlchemyConfigContext
} from './AlchemyConfigContext';

const getFlagEmoji = countryCode =>
	String.fromCodePoint(
		...[...countryCode.toUpperCase()].map(x => 0x1f1a5 + x.charCodeAt())
	);

const flags = {
	de: 'de',
	en: 'us',
	es: 'es',
	fr: 'fr',
	jp: 'jp',
	ko: 'kr',
	pl: 'pl',
	pt: 'pt',
	ru: 'ru',
	'zh-CN': 'cn'
};

const Locale = props => {
	const [l, sl] = useState(i18n.language);

	const setLocale = lng => {
		i18n.changeLanguage(lng);
		sl(lng)
	};

	return (
		<div className="d-flex align-items-center">
			<Form.Select
				onChange={e => {
					setLocale(e.target.value);
				}}
				value={l}
				size="sm"
				aria-label="Locale"
				style={{
					width: '9rem'
				}}
			>
				{Object.keys(flags).map(l => (
					<option value={l} key={l}>
						{getFlagEmoji(flags[l])} {flags[l]}
					</option>
				))}
			</Form.Select>
			<div className="ps-2 ">Locale</div>
		</div>
	);
};

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

const AlchemyConfig = props => {
	const [advancedPerks, setAdvancedPerks] = useContext(AlchemyConfigContext);
	return (
		<Form.Switch
			checked={advancedPerks}
			onChange={e => {
				setAdvancedPerks(e.target.checked);
			}}
			id="alchemy-config-switch"
			label="Show material ID next to name"
		/>
	);
};

const DarkMode = props => {
	const [theme, setTheme] = useContext(ThemeContext);
	return (
		<div>
			<DarkModeToggle
				onChange={checked => {
					setTheme(checked ? 'dark' : 'light');
				}}
				checked={theme === 'dark'}
				size={60}
			/>
			&nbsp; Dark Mode
		</div>
	);
};

const NeedInputAlert = () => {
	const [show, setShow] = useLocalStorage('show-need-feedback-alert', true);

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
						href="https://github.com/TwoAbove/noita-tools/issues"
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

const Settings = props => {
	return (
		<Modal show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Settings</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="pb-3">
					These settings modify how Noitool behaves or displays things.
				</div>
				<Stack gap={3}>
					<Locale />
					<DarkMode />
					<SpoilerChange />
					<AlchemyConfig />
				</Stack>
			</Modal.Body>
		</Modal>
	);
};

const Header = props => {
	const [show, setShow] = useState(false);
	// noita-tools.herokuapp.com
	const hostname = window.location.hostname;
	const notNewUrl = !hostname.includes('noitool.com');
	return (
		<Stack direction="horizontal" className="align-items-stretch">
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
			<div className="w-25 d-flex p-3 justify-content-end align-items-start">
				<Button
					onClick={() => setShow(true)}
					size="lg"
					variant="outline-primary"
				>
					<i className="bi bi-gear"></i>
				</Button>
			</div>
			<Settings show={show} handleClose={() => setShow(false)} />
		</Stack>
	);
};

const App: React.FC = () => {
	const [tab, setTab] = useLocalStorage('last-tab', 'SeedInfo');

	const handleTab = key => {
		setTab(key);
	};

	return (
		<SpoilerProvider>
			<ThemeProvider>
				<AlchemyConfigProvider>
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
								<div className="footer-copyright text-center">
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
								<div className="footer-copyright text-center py-2">
									© 2022 Copyright: <a href="https://seva.dev/">Seva Maltsev</a>
								</div>
							</Stack>
						</footer>
					</div>
				</AlchemyConfigProvider>
			</ThemeProvider>
		</SpoilerProvider>
	);
};

export default App;
