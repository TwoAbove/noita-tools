import { useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import useLocalStorage from '../services/useLocalStorage';
import LiveSeedStats from './LiveSeedStats';
import SearchSeeds from './SearchSeeds';
import SeedInfo from './SeedInfo';
import TestBench from './TestBench';

const Body = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const seedInSeachParams = searchParams.get('seed');
	const [tab, setTab] = useLocalStorage('last-tab', 'SeedInfo');

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
				{process.env.NODE_ENV === 'development' && (
					<Tab mountOnEnter eventKey="TestBench" title="TestBench">
						<TestBench />
					</Tab>
				)}
			</Tabs>
		</Container>
	);
};

export default Body;
