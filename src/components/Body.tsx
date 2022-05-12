import { Container, Tabs, Tab } from "react-bootstrap";
import useLocalStorage from "../services/useLocalStorage";
import LiveSeedStats from "./LiveSeedStats";
import SearchSeeds from "./SearchSeeds";
import SeedInfo from "./SeedInfo";

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

export default Body;
