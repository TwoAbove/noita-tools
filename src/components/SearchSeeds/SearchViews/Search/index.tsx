import React, { useContext } from "react";
import {
  Container,
  Stack,
  Row,
  Col,
  ListGroup,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  ProgressBar,
} from "react-bootstrap";
import humanize from "humanize-duration";

import { localizeNumber } from "../../../../services/helpers";
import SeedDataOutput from "../../../SeedInfo/SeedDataOutput";
import { useSearchContext } from "../../SearchContext";
import UseMultithreadingButton from "../../UseMultithreading";
import { Status } from "../../../../services/compute/ChunkProvider";
import useLocalStorage from "../../../../services/useLocalStorage";
import ClusterInfo from "./Cluster";
import Multithreading from "./Multithreading";

const MemoSeedDataOutput = React.memo(SeedDataOutput);

const Description = () => {
  return (
    <>
      <h4 className="mb-3">Find a seed with desired parameters</h4>
      <p>
        Logic operations are available. Logic meta-rules allow you to better filter for specific seeds or to make the
        search more flexible. The top level list of rules is an <code>AND</code>, meaning all of the rules inside the{" "}
        <code>AND</code>&nbsp; need to be true for a seed to be considered "found". You can drag and drop rules and
        logic rules into other logic rules.
      </p>
      <p>
        <code>AND</code>: All rules must be true.&nbsp;
        <code>OR</code>: Any of the rules must be true. <code>NOT</code>: Negates any rule/logic inside. Accepts only
        one thing.
      </p>
      <p>
        To get the same behavior as the old seed search, simply add rules to the root <code>AND</code>.
      </p>
    </>
  );
};

const Search = () => {
  // TODO: Spilt Search Context into something more manageable
  const {
    solverStatus,
    solverReady,
    chunkProvider,
    clearSearch,

    handleCopy,
    startCalculation,
    stopCalculation,
    computeJobName,
    handleCustomSeedListChange,
    updateSearchConfig,
    findAll,
    running,
    seed,
    seedEnd,
    customSeedList,
    seedsChecked,
    totalSeeds,
    percentChecked,
    seedsPerSecond,
  } = useSearchContext();

  const [clearClicked, setClearClicked] = React.useState(false);

  const handleClear = () => {
    if (!clearClicked) {
      setTimeout(() => {
        setClearClicked(false);
      }, 2000);

      setClearClicked(true);
      return;
    }
    clearSearch();
    setClearClicked(false);
  };

  const [showedSeed, setShowedSeed] = React.useState<number>(0);

  let results: number[] = [];
  if (chunkProvider?.results.size) {
    results = [...chunkProvider?.results.values()];
  }

  return (
    <div className="p-0 pt-3">
      <Description />
      <Row>{/* <RuleConstructor onSubmit={updateRules} /> */}</Row>
      <Row className="px-0 mt-2-xs">
        <Col xs={12} sm={6} md={5}>
          <Form onSubmit={e => e.preventDefault()}>
            <FormGroup>
              <Col className="mb-4">
                <Form.Group>
                  <Form.Label htmlFor="SearchSeeds.name">Search name:</Form.Label>
                  <Form.Control
                    id="SearchSeeds.name"
                    disabled={running || !solverReady}
                    value={computeJobName}
                    onChange={e => updateSearchConfig({ name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="my-2">
                  <Form.Label htmlFor="SearchSeeds.seed">Start search from seed: </Form.Label>
                  <Form.Control
                    id="SearchSeeds.seed"
                    type="number"
                    disabled={running || !solverReady}
                    value={seed}
                    onChange={e => updateSearchConfig({ from: parseInt(e.target.value, 10) })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mt-2">
                  <Form.Label htmlFor="SearchSeeds.seedEnd">End search at seed: </Form.Label>
                  <Form.Control
                    id="SearchSeeds.seedEnd"
                    type="number"
                    placeholder="Optional"
                    disabled={running || !solverReady}
                    value={seedEnd}
                    onChange={e => updateSearchConfig({ to: parseInt(e.target.value, 10) })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Label htmlFor="SearchSeeds.seedEnd">
                    Or, input a list of seeds (slower, best for filtering):{" "}
                  </Form.Label>
                  <Form.Control
                    id="SearchSeeds.seedList"
                    type="text"
                    placeholder="Optional"
                    disabled={running || !solverReady}
                    value={customSeedList}
                    onChange={e => handleCustomSeedListChange(e)}
                  />
                  {customSeedList && (
                    <Form.Text className="text-muted">{chunkProvider.customSeeds?.length} seeds left</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mt-3">
                  <Form.Check
                    checked={findAll}
                    disabled={!solverReady}
                    onChange={e => updateSearchConfig({ findAll: e.target.checked })}
                    id={`find-all-switch`}
                    label="Don't stop searching when a seed is found"
                  />
                </Form.Group>
              </Col>
            </FormGroup>
          </Form>
        </Col>
        {/* <Col /> */}
        <Col md={7} className="px-0 mt-0-xs">
          <Row className="d-flex flex-direction-column justify-content-center">
            <ClusterInfo />
            <hr className="w-75" />
            {navigator.hardwareConcurrency && <Multithreading />}
          </Row>
          <Row className="p-3">
            <ButtonGroup>
              <Button color="primary" disabled={running || !solverReady} onClick={() => startCalculation()}>
                {!solverReady ? "Loading searcher" : "Find next"}
              </Button>
              <Button color="primary" disabled={!running || !solverReady} onClick={() => stopCalculation()}>
                Stop
              </Button>
            </ButtonGroup>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className="my-2">
          <Button variant={clearClicked ? "danger" : "outline-warning"} onClick={() => handleClear()}>
            Clear search{clearClicked && "?"}
          </Button>
        </Col>
      </Row>
      <div>
        {!chunkProvider?.customSeeds && solverStatus?.running && (
          <div>
            <ProgressBar animated now={percentChecked} label={`${percentChecked}%`} />
            Seeds checked: {localizeNumber(seedsChecked)} / {localizeNumber(totalSeeds)} (Estimated time left:{" "}
            {humanize((solverStatus as Status).estimate * 1000, {
              round: true,
              units: ["h", "m"],
            })}
            , {Math.round(seedsPerSecond * 10) / 10} avg seeds/s)
            <br />
            {}
          </div>
        )}
        <h5 className="mt-3 mb-1">Results:</h5>
        {findAll && chunkProvider && (
          <div>
            Found {results.length} seeds: <br />
            <Button onClick={handleCopy}>Copy seed list to clipboard</Button>
            <ListGroup
              style={{
                overflowY: "auto",
                height: "100px",
              }}
            >
              {results.map(s => {
                return (
                  <ListGroup.Item variant="flush" key={s}>
                    {s}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        )}
        {!findAll && results.length > 0 && (
          <div>
            <Row>
              <Col>
                <Button disabled={showedSeed === 0} onClick={() => setShowedSeed(showedSeed - 1)}>
                  {"<"}
                </Button>
              </Col>
              <Col>
                Showing Seed {showedSeed + 1} of {results.length}
              </Col>
              <Col>
                <Button disabled={showedSeed === results.length - 1} onClick={() => setShowedSeed(showedSeed + 1)}>
                  {">"}
                </Button>
              </Col>
            </Row>
            <div className="mb-4" key={results[showedSeed]}>
              <MemoSeedDataOutput key={results[showedSeed]} seed={`${results[showedSeed]}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
