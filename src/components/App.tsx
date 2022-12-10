import React, { FC, useState, Suspense, useEffect } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import { lazy } from '@loadable/component';

import Donate from './Donate';

import './App.css';
import { ThemeProvider } from './ThemeContext';
import { AlchemyConfigProvider } from './AlchemyConfigContext';

import LoadingComponent from './LoadingComponent';
import { db } from '../services/db';
import classNames from 'classnames';
import SyncHandler from './Settings/SyncHandler';
import { BrowserRouter } from 'react-router-dom';
import DBError from './DBError';

const Settings = lazy(() => import('./Settings'));
const LazySettings = props => {
	const [show, setShow] = useState(false);

	return (
		<Suspense fallback={<LoadingComponent />}>
			<Button onClick={() => setShow(true)} size="lg" variant="outline-primary">
				<i className="bi bi-gear"></i>
			</Button>
			<Settings show={show} handleClose={() => setShow(false)} />
		</Suspense>
	);
};

const Header = () => {
	// noita-tools.herokuapp.com
	const host = window.location.host;
	const notNewUrl = !host.includes('noitool.com');
	return (
		<Container fluid="sm" className="mb-2 p-0 d-flex justify-content-between">
			<div className="">
				<h3 className="fs-1 fw-bolder mt-2 mb-0 text-center">Noitool</h3>
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
				<LazySettings />
			</div>
		</Container>
	);
};

const WasmError = props => {
	return (
		<div className="position-absolute top-50 start-50 translate-middle text-center w-75">
			<p>
				Looks like this browser does not support WebAssembly, which is needed to
				run the generation code.
			</p>
			<p>
				This might be due to several things. Some browser security
				configurations turn WebAssembly off. Some browsers do not support it.{' '}
				<br />
				One common issue is with Edge with enhanced security configuration
				turning off WebAssembly.
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


const Body = lazy(() => import('./Body'));
const LazyBody = props => {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<Body {...props} />
		</Suspense>
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
					Noitool <code>{process.env.REACT_APP_VERSION} </code>© 2022{' '}
					<a href="https://seva.dev/">Seva Maltsev</a>
				</div>
			</Stack>
		</footer>
	);
};

interface IDBErrorHandlerProps {
	children?: React.ReactNode;
}
const DBErrorHandler: FC<IDBErrorHandlerProps> = props => {
	const [hasDBError, setHasDBError] = useState<Error | boolean>(false);

	useEffect(() => {
		db.errorOnOpen
			.then(e => {
				setHasDBError(e);
			})
			.finally(() => {});
	}, []);

	let toShow = <>{props.children}</>;

	if (hasDBError) {
		toShow = (
			<DBError error={hasDBError} onProceed={() => setHasDBError(false)} />
		);
	}

	return toShow;
};

const App: FC = () => {
	const [hasWasm, setHasWasm] = useState(() => {
		try {
			// https://github.com/MaxGraey/wasm-check/issues/5
			// return wasmCheck.support()
			return typeof WebAssembly === 'object';
		} catch (e) {
			console.error(e);
			return false;
		}
	});

	let toShow = <LazyBody />;

	if (!hasWasm) {
		toShow = <WasmError onProceed={() => setHasWasm(true)} />;
	}

	return (
		<DBErrorHandler>
			<div className="App bg-gradient">
				<div className="content bg-body rounded">
					<BrowserRouter>
						<ThemeProvider>
							<AlchemyConfigProvider>
								<Header />
								{toShow}
							</AlchemyConfigProvider>
						</ThemeProvider>
					</BrowserRouter>
				</div>
				<Footer />
			</div>
		</DBErrorHandler>
	);
};

export default App;
