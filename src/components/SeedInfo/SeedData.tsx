import React, { FC, useEffect, useState } from "react";
import { Table, Button, Col, Modal, Row, Stack, ListGroup, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useSearchParamsState } from "react-use-search-params-state";

import SeedForm from "./SeedForm";
import SeedDataOutput from "./SeedDataOutput";
import { db } from "../../services/db";
import { useLiveQuery } from "dexie-react-hooks";
import FungalShifts from "./SeedInfoViews/FungalShifts";
import { MaterialInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/Material";
import i18n from "../../i18n";
import { ShowAlwaysCastRow } from "../Settings/GeneralSettings";
import useLocalStorage from "../../services/useLocalStorage";

const MemoSeedDataOutput = React.memo(SeedDataOutput);

const SeedHistoryModal = props => {
  const { show, handleClose, onSelectSeed } = props;

  const seeds = useLiveQuery(() => db.seedInfo.toArray(), [], []).sort((a, b) => +b.updatedAt - +a.updatedAt);

  const [clicked, setClicked] = useState<number | null>(null);

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Seed History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive striped borderless hover>
          <thead>
            <tr>
              <th>Seed</th>
              <th>Last updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {seeds.map((seed, i) => {
              const dateString = seed.updatedAt.toLocaleString();
              return (
                <tr style={{ cursor: "pointer" }} onClick={() => onSelectSeed(seed.seed)} key={seed.seed}>
                  <td className="text-primary">
                    <Button size="sm" variant="outline-primary">
                      {seed.seed}
                    </Button>
                  </td>
                  <td>{dateString}</td>
                  <td>
                    {clicked !== i ? (
                      <Button
                        variant="outline-warning"
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          setClicked(i);
                        }}
                        size="sm"
                      >
                        delete
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          setClicked(null);
                          db.seedInfo
                            .get({ seed: seed.seed })
                            .then(q => {
                              if (!q) return;
                              db.seedInfo.delete(q.id!).finally(() => {});
                            })
                            .catch(e => console.error(e));
                        }}
                        size="sm"
                      >
                        delete
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const materialProvider = new MaterialInfoProvider(i18n);

const Part: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="mt-3">{children}</div>;
};

const QuirkModal = props => {
  const { show, handleClose } = props;

  return (
    <Modal fullscreen="sm-down" size="lg" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Quirks and Limitations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Part>
          <h4>Perk Rerolls</h4>
          <p>
            Due to how perks are re-rolled in-game, the only guarantee is the <b>perks</b> that you will get,{" "}
            <b>not their position</b>. <br />
            <br />
            When looking at <i>always cast</i> and <i>perk lottery</i> info, note that they are <b>position</b>
            -dependent, not <b>perk</b>-dependent. That means that if the position of <i>always cast</i> in-tool is
            different from that in-game, then the value will be different. As a non-perfect solution, please enable
            "show always-cast for whole row" in the settings (shortcut below).
          </p>
          <ListGroup variant="flush" className="mt-0 mb-3 shadow">
            <ListGroup.Item>
              <ShowAlwaysCastRow />
            </ListGroup.Item>
          </ListGroup>
        </Part>
        <Part>
          <h4>Pacifist Chest</h4>
          <h5>Greed</h5>
          <p>Greed is currently not supported, coming later.</p>
          <h5>Random Material Potion</h5>
          <p>
            The contents of the Random Material Potion is very mod dependent. <br />
            If the amount of materials in-game changes, then the material in this potion will differ. Even changing the
            material positions in <code className="mx-1">data/materials.xml</code> will change the generated materials.
          </p>
        </Part>
        <Part>
          <h4>Weather</h4>
          <p>
            In Noita, the occurrence of rain depends on the game's seed, while snowfall relies on real-time dates. Snow
            only appears during the months of December, January, and February.{" "}
            <b>
              <em>Please note that the displayed value represents the current time and date.</em>
            </b>
            <br />
            This also applies when searching for seeds. When looking for a seed with snow, the results will only be
            relevant for the months of December, January, and February, as well as being accurate for the specific day
            and hour of generation.
          </p>
        </Part>
        <Part>
          <h4>Fungal Shifts</h4>
          <p>Fungal Shifts will shift one material to another.</p>
          <p>
            When shifting to a held material, and if you're holding Gold, then you only have a <b>1/1000</b> chance of
            shifting the material to Gold.
          </p>
          <FungalShifts
            fungalData={[
              {
                flaskTo: true,
                flaskFrom: false,
                from: ["water"],
                to: "lava",
                gold_to_x: "gold",
                grass_to_x: "grass_holy",
              },
              {
                flaskTo: true,
                flaskFrom: false,
                from: ["water"],
                to: "lava",
                gold_to_x: "pea_soup",
                grass_to_x: "grass_holy",
              },
            ]}
            infoProvider={
              {
                // stub for this example
                updateConfig: () => {},
                config: { fungalShifts: [true, false] },
                providers: {
                  material: materialProvider,
                },
              } as any
            }
          />
        </Part>
      </Modal.Body>
    </Modal>
  );
};

const SeedData = () => {
  const [showCurrentDailySeed, setShowCurrentDailySeed] = useLocalStorage("show-current-daily-seed", false);

  const [filterParams, setFilterParams] = useSearchParamsState({
    seed: {
      type: "string",
      default: "",
    },
  });

  const [dailySeed, setDailySeed] = useState<string | null>(null);

  const seed = filterParams.seed;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const res = await fetch("/api/daily-seed").then(r => r.json());
      setDailySeed(res.seed);
      if (showCurrentDailySeed && !seed) {
        setFilterParams({ seed: res.seed });
      }
    })();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCurrentDailySeed]);

  // const [seed, setSeed] = React.useState<any>(() => seedInSeachParams || '');

  const [openQuirks, setQuirksOpen] = React.useState(false);

  const handleSetSeed = (newSeed: string) => {
    setFilterParams({ seed: newSeed });
  };

  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="px-sm-3 px-2 pb-3 mb-5">
      <SeedHistoryModal
        show={showHistory}
        handleClose={() => setShowHistory(false)}
        onSelectSeed={seed => handleSetSeed(seed)}
      />
      <Row className="align-items-center mt-2">
        <Col lg="8" sm="12">
          <Row>
            <Col xs={6}>
              <p className="mb-0">
                Noitool provides information about perks, fungal shifts, shop items, chests, biome info, LC and AP
                recipes, weather for the given seed. <br />
              </p>
            </Col>
            <Col>
              <p>
                Note that Noitool has minor limitations in details of generation: <span className="mx-2" />
                <Button
                  className="align-self-baseline mt-1"
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setQuirksOpen(true)}
                >
                  Show quirks
                </Button>
                <QuirkModal show={openQuirks} handleClose={() => setQuirksOpen(false)} />
              </p>
            </Col>
          </Row>
        </Col>
        <Col lg="4">
          <Row>
            <Col xs={8} className="d-flex justify-content-center align-items-center">
              <Form.Check
                checked={showCurrentDailySeed}
                onChange={e => setShowCurrentDailySeed(e.target.checked)}
                type="switch"
                id="custom-switch"
              />
              <Form.Label className="ms-2" htmlFor="custom-switch">
                Automatically show current daily seed {dailySeed && <Link to={`?seed=${dailySeed}`}>{dailySeed}</Link>}
              </Form.Label>
            </Col>
            <Col className="d-flex">
              <Button className="ms-auto" variant="outline-secondary" size="sm" onClick={() => setShowHistory(true)}>
                Seed History
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Stack>
        <SeedForm onSubmit={seed => handleSetSeed(seed)} />
        {seed ? <SeedDataOutput isDaily={seed === dailySeed} seed={seed} /> : null}
      </Stack>
    </div>
  );
};

export default SeedData;
