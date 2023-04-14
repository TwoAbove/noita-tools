import { useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import useLocalStorage from '../services/useLocalStorage';
import LiveSeedStats from './LiveSeedStats';
import SearchSeeds from './SearchSeeds';
import SeedInfo from './SeedInfo';
import TestBench from './TestBench';

import { Compute, ComputeConsole } from './Compute';

const isDev = () => {
	const host = window.location.host;
	return process.env.NODE_ENV === 'development' || host === 'dev.noitool.com';
};

const isLocal = () => {
	return Boolean(
		window.location.hostname === 'localhost' ||
			// [::1] is the IPv6 localhost address.
			window.location.hostname === '[::1]' ||
			// 127.0.0.1/8 is considered localhost for IPv4.
			window.location.hostname.match(
				/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
			)
	);
};

const Body = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const seedInSeachParams = searchParams.get('seed');
	const [tab, setTab] = useLocalStorage('last-tab', '');

	useEffect(() => {
		if (seedInSeachParams) {
			setTab('SeedInfo');
		}
		// This is needed to do one-off routing if we have a seed query param in the url.
		// TODO: I think the better way of doing this is to actually use react-router
		// Routes instead of this db-memory-way.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleTab = key => {
		setTab(key);
		setSearchParams({});
	};

	const showTestBench = isDev();
	const showClusterCompute = isDev();
	const showClusterComputeConsole = isLocal();

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
				{showTestBench && (
					<Tab mountOnEnter eventKey="TestBench" title="TestBench">
						<TestBench />
					</Tab>
				)}
				{showClusterCompute && (
					<Tab mountOnEnter eventKey="Compute" title="Compute">
						<Compute />
					</Tab>
				)}
				{showClusterComputeConsole && (
					<Tab mountOnEnter eventKey="ComputeConsole" title="Compute Console">
						<ComputeConsole />
					</Tab>
				)}
			</Tabs>
		</Container>
	);
};

export default Body;
