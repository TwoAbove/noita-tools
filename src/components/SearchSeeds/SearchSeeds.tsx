import { Container, Stack, Row, Col } from "react-bootstrap";
import SearchContextProvider, { useSearchContext } from "./SearchContext";
import RuleConstructor from "./RuleConstructor";
import RuleList from "./RuleList";
import { GameInfoContext, useGameInfoProvider } from "../SeedInfo/SeedDataOutput";

const SearchContent = () => {
  const { searchInstance } = useSearchContext();
  const searchId = searchInstance?.id || "default";

  return (
    <Row>
      <Col className="border rounded-3" xs={12} md={3}>
        <RuleList key={`rule-list-${searchId}`} />
      </Col>
      <Col className="mx-auto" xs={12} md={9}>
        <RuleConstructor key={`rule-constructor-${searchId}`} />
      </Col>
    </Row>
  );
};

const SearchSeeds = () => {
  const [gameInfoProvider, data] = useGameInfoProvider("0");

  return (
    <Container className="col container shadow-lg">
      {gameInfoProvider && data ? (
        <GameInfoContext.Provider value={{ gameInfoProvider, data }}>
          <SearchContextProvider>
            <SearchContent />
          </SearchContextProvider>
        </GameInfoContext.Provider>
      ) : (
        <p>Loading</p>
      )}
    </Container>
  );
};

export default SearchSeeds;
