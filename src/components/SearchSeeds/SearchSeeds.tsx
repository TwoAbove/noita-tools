import { Container, Stack, Row, Col } from "react-bootstrap";

import SearchContextProvider from "./SearchContext";
import RuleConstructor from "./RuleConstructor";
import RuleList from "./RuleList";
import { GameInfoContext, useGameInfoProvider } from "../SeedInfo/SeedDataOutput";

const SearchSeeds = () => {
  const [gameInfoProvider, data] = useGameInfoProvider("0");

  return (
    <Container className="col container shadow-lg">
      {gameInfoProvider && data ? (
        <GameInfoContext.Provider value={{ gameInfoProvider, data }}>
          <Row>
            <SearchContextProvider>
              <Col className="border rounded-3" xs={12} md={3}>
                <RuleList />
              </Col>
              <Col className="mx-auto" xs={12} md={9}>
                <RuleConstructor />
              </Col>
            </SearchContextProvider>
          </Row>
        </GameInfoContext.Provider>
      ) : (
        <p>Loading</p>
      )}
    </Container>
  );
};

export default SearchSeeds;
