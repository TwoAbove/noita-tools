import classNames from "classnames";
import { useState, useEffect, FC, useRef } from "react";
import { Button, Col, Collapse, Container, Form, FormGroup, ListGroup, ProgressBar, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import humanize from "humanize-duration";
import copy from "copy-to-clipboard";
import Cookies from "js-cookie";

import { localizeNumber } from "../../../services/helpers";
import { ILogicRules } from "../../../services/SeedInfo/infoHandler/IRule";
import SeedSolver from "../../../services/seedSolverHandler";
import { Import } from "../../SearchSeeds/RuleList";
import { ComputeSocket } from "../../../services/compute/ComputeSocket";
import useLocalStorage from "../../../services/useLocalStorage";
import SocketHandler from "../../../services/socketHandler";
import { ChunkProvider, Status } from "../../../services/compute/ChunkProvider";
import { SocketComputeProvider } from "../../../services/compute/SocketComputeProvider";

const testConfig = {
  id: "1",
  type: "and",
  rules: [
    {
      id: "2",
      type: "map",
      val: {
        coalmine: {
          pos: {
            x: 34,
            y: 15,
          },
          searchType: "and",
          search: ["data/biome_impl/coalmine/receptacle_oil.png"],
          funcs: ["load_pixel_scene2"],
        },
        excavationSite: {
          pos: {
            x: 34,
            y: 17,
          },
          searchType: "and",
          search: [
            "data/biome_impl/excavationsite/meditation_cube.png",
            "data/biome_impl/excavationsite/receptacle_steam.png",
          ],
          funcs: ["spawn_meditation_cube", "load_pixel_scene4_alt"],
        },
        snowCastle: {
          pos: {
            x: 34,
            y: 25,
          },
          searchType: "or",
          search: ["data/biome_impl/snowcastle/kitchen.png", "data/biome_impl/snowcastle/sauna.png"],
          funcs: ["load_pixel_scene2"],
        },
        snowCave: {
          pos: {
            x: 34,
            y: 21,
          },
          searchType: "and",
          search: ["data/biome_impl/snowcave/receptacle_water.png", "data/biome_impl/snowcave/buried_eye.png"],
          funcs: ["load_pixel_scene", "load_pixel_scene3"],
        },
        vault: {
          pos: {
            x: 34,
            y: 31,
          },
          searchType: "and",
          search: ["data/biome_impl/vault/lab_puzzle.png"],
          funcs: ["load_pixel_scene2"],
        },
      },
    },
  ],
  selectedRule: "search",
};

const ComputeConsole = () => {
  const [computeSocket, setComputeSocket] = useState<ComputeSocket>();
  const [connected, setConnected] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [chunkProvider, setChunkProvider] = useState<ChunkProvider>();
  const [socketComputeProvider, setSocketComputeProvider] = useState<SocketComputeProvider>();

  const [computeUrl, setComputeUrl] = useState(window.location.host);
  const noitoolSessionToken = Cookies.get("noitoolSessionToken");
  const [computeJobName, setComputeJobName] = useState("The Seed");
  // const [computeJobName, setComputeJobName] = useState((Math.random() + 1).toString(36).substring(7));

  const [rules, setRules] = useState<ILogicRules>(testConfig as any);

  const [computeStatus, setComputeStatus] = useState<Status>({
    running: false,
    checked: 0,
    estimate: 0,
    rate: 0,
    currentChunk: 0,
    results: [],
  });

  const [searchFrom, setSearchFrom] = useState(1);
  // const [searchTo, setSearchTo] = useState(6658);
  const [searchTo, setSearchTo] = useState(2_147_483_646);
  const [chunkSize, setChunkSize] = useState(2000);

  useEffect(() => {
    const newComputeSocket = new ComputeSocket({
      url: computeUrl,
      sessionToken: noitoolSessionToken,
      version: process.env.REACT_APP_VERSION!,
      onUpdate: () => {
        setConnected(newComputeSocket.connected);
      },
      isHost: true,
    });
    setComputeSocket(newComputeSocket);
  }, [computeUrl, noitoolSessionToken]);

  useEffect(() => {
    if (!computeSocket || !rules || !chunkProvider) {
      return;
    }
    const newSocketComputeProvider = new SocketComputeProvider(setComputeStatus, chunkProvider, rules, computeSocket);
    setSocketComputeProvider(newSocketComputeProvider);
    return () => {
      newSocketComputeProvider.destruct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeSocket, rules, chunkProvider]);

  useEffect(() => {
    if (!chunkProvider) {
      const newChunkProvider = new ChunkProvider({
        chunkSize,
        searchFrom,
        searchTo,
        jobName: computeJobName,
        etaHistoryTimeConstant: 120,
        chunkProcessingTimeTarget: 5,
      });
      setChunkProvider(newChunkProvider);
      return;
    }
    chunkProvider.config = {
      ...chunkProvider.config,
      chunkSize,
      searchFrom,
      searchTo,
      jobName: computeJobName,
    };
  }, [chunkSize, searchFrom, searchTo, computeJobName, chunkProvider]);

  const handleCopy = () => {
    const seedList = computeStatus.results;
    copy(seedList.join(","));
  };

  const nextUp = chunkProvider?.config.searchFrom;

  return (
    <Container>
      <Stack gap={1}>
        <Row>
          <Col xs={12} sm={6}>
            Import search
            <Import
              onClick={rules => {
                const newRules = JSON.parse(atob(rules));
                setRules(newRules);
              }}
            />
            <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Col>
                  <Form.Group className="">
                    <Form.Label htmlFor="SearchSeeds.seed">Start search from seed: </Form.Label>
                    <Form.Control
                      id="SearchSeeds.seed"
                      type="number"
                      disabled={computeStatus.running}
                      value={searchFrom}
                      onChange={e => setSearchFrom(parseInt(e.target.value, 10))}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="SearchSeeds.seedEnd">End search at seed: </Form.Label>
                    <Form.Control
                      id="SearchSeeds.seedEnd"
                      type="number"
                      placeholder="Optional"
                      disabled={computeStatus.running}
                      value={searchTo}
                      onChange={e => setSearchTo(parseInt(e.target.value, 10))}
                    />
                  </Form.Group>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col xs={12} sm={6}>
            Current config:
            <pre style={{ height: "30rem" }} className="overflow-auto">
              <code>{JSON.stringify(rules, null, 2)}</code>
            </pre>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Compute URL</Form.Label>
              <Form.Control value={computeUrl} onChange={e => setComputeUrl(e.target.value)} />
              <Form.Text>{connected ? "Connected" : "Not Connected"}</Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Compute Job Name</Form.Label>
              <Form.Control value={computeJobName} onChange={e => setComputeJobName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Chunk Size</Form.Label>
              <Form.Control
                value={chunkSize}
                type="number"
                onChange={e => setChunkSize(parseInt(e.target.value, 10))}
              />
              <Form.Text className="text-muted">
                The amount of seeds that will be sent to a compute worker at one time. Larger values are more stable,
                but will use more memory on compute machines. Recommended not to change.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Button disabled={computeStatus.running} onClick={() => socketComputeProvider?.start()}>
              Start
            </Button>
          </Col>
          <Col>
            <Button disabled={!computeStatus.running} onClick={() => socketComputeProvider?.stop()}>
              Stop
            </Button>
          </Col>
        </Row>
        <hr />
        <Stack gap={3}>
          <Row>
            {nextUp && computeStatus.estimate && socketComputeProvider?.running && (
              <div>
                <ProgressBar
                  min={searchFrom}
                  max={searchTo}
                  now={nextUp}
                  animated
                  label={`${Math.round((computeStatus.checked * 100) / (searchTo - searchFrom))}%`}
                />
                Seeds checked: {localizeNumber(computeStatus.checked)} / {localizeNumber(searchTo - searchFrom)}{" "}
                (Estimated time left:{" "}
                {humanize(computeStatus.estimate * 1000, {
                  round: true,
                  units: ["h", "m"],
                })}
                , {localizeNumber(Math.round(computeStatus.rate * 100) / 100)} avg seeds/s)
              </div>
            )}
          </Row>
          <Row>
            <h6>Results:</h6>
            {chunkProvider && (
              <div>
                Found {chunkProvider.results.size} seeds: <br />
                <Button onClick={handleCopy}>Copy seed list to clipboard</Button>
                <ListGroup
                  style={{
                    overflowY: "auto",
                    height: "100px",
                  }}
                >
                  {computeStatus.results.map(s => {
                    return (
                      <ListGroup.Item variant="flush" key={s}>
                        {s}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            )}
          </Row>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ComputeConsole;
