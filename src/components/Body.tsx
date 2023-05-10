import { useEffect, useContext } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LiveSeedStats from "./LiveSeedStats";
import SearchSeeds from "./SearchSeeds";
import SeedInfo from "./SeedInfo";
import TestBench from "./TestBench";

import { Compute, ComputeConsole } from "./Compute";
import { ProfileContext } from "./Profile/ProfileContext";

const isDev = () => {
  const host = window.location.host;
  return process.env.NODE_ENV === "development" || host === "dev.noitool.com";
};

const isLocal = () => {
  return Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
};

const Body = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const seedInSearchParams = searchParams.get("seed");

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { patreonData } = useContext(ProfileContext);

  useEffect(() => {
    // This is needed for backwards compatibility with the old urls
    // TODO: Somewhere in the future we can remove this. I think start of 2024?
    if (pathname !== "/") {
      return;
    }

    if (seedInSearchParams) {
      navigate(
        {
          pathname: "/info",
          search: window.location.search,
        },
        { replace: true }
      );
    } else {
      navigate("/info", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTab = key => {
    navigate(key);
  };

  const isLoggedIn = !!patreonData;

  const showTestBench = isDev();
  const showClusterCompute = isDev() || isLoggedIn;
  const showClusterComputeConsole = isLocal();

  return (
    <Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
      <Tabs activeKey={pathname} onSelect={handleTab} id="main-tabs" mountOnEnter className="">
        <Tab eventKey="/info" title="Seed info">
          <SeedInfo />
        </Tab>
        <Tab eventKey="/search" title="Search For Seed">
          <SearchSeeds />
        </Tab>
        <Tab eventKey="/live" title="Live game helper (beta)">
          <LiveSeedStats />
        </Tab>
        {showTestBench && (
          <Tab eventKey="/test" title="TestBench">
            <TestBench />
          </Tab>
        )}
        {showClusterCompute && (
          <Tab eventKey="/compute" title="Compute">
            <Compute />
          </Tab>
        )}
        {showClusterComputeConsole && (
          <Tab eventKey="/compute-console" title="Compute Console">
            <ComputeConsole />
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};

export default Body;
