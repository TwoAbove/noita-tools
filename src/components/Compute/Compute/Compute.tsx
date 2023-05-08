import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import humanize from "humanize-duration";
import Cookies from "js-cookie";

import SeedSolver from "../../../services/seedSolverHandler";
import useLocalStorage from "../../../services/useLocalStorage";
import UseMultithreadingButton from "../../SearchSeeds/UseMultithreading";
import { ComputeSocket } from "../../../services/compute/ComputeSocket";
import { localizeNumber } from "../../../services/helpers";
import { VersionMisatch } from "../../misc/VersionMismatch";

const Compute = () => {
  const [computeSocket, setComputeSocket] = useState<ComputeSocket>();

  const [useCores, setUseCores] = useLocalStorage("useCores", 1);
  const [startAutomatically, setStartAutomatically] = useLocalStorage("search-start-automatically", false);
  const [seedSolver, setSeedSolver] = useState<SeedSolver>();

  const [computeUrl, setComputeUrl] = useState(window.location.host);
  const noitoolSessionToken = Cookies.get("noitoolSessionToken");

  const [connected, setConnected] = useState(false);
  const [computeRunning, setComputeRunning] = useState(false);
  const [computeInfo, setComputeInfo] = useState<any>({});
  const [computeVersionMismatch, setComputeVersionMismatch] = useState<boolean>(false);

  useEffect(() => {
    if (!seedSolver) {
      // not ready
      return;
    }

    const newComputeSocket = new ComputeSocket({
      url: computeUrl,
      sessionToken: noitoolSessionToken,
      version: process.env.REACT_APP_VERSION!,
      seedSolver,
      onUpdate: () => {
        setConnected(newComputeSocket.connected);
        setComputeRunning(newComputeSocket.running);
        setComputeInfo({
          jobName: newComputeSocket.jobName,
          chunkTo: newComputeSocket.chunkTo,
          chunkFrom: newComputeSocket.chunkFrom,
          jobStats: newComputeSocket.jobStats,
        });
      },
    });

    newComputeSocket.on("compute:version_mismatch", () => {
      setComputeVersionMismatch(true);
      newComputeSocket.stop();
    });

    setComputeSocket(newComputeSocket);

    return () => {
      newComputeSocket.stop();
    };
  }, [computeUrl, noitoolSessionToken, seedSolver, startAutomatically]);

  const handleStart = () => {
    if (!computeSocket) {
      return;
    }
    computeSocket.register();
    computeSocket.start().catch(e => {
      console.error(e);
      computeSocket.stop();
    });
  };
  const handleStop = () => {
    if (!computeSocket) {
      return;
    }
    computeSocket?.unregister();
    computeSocket?.stop();
  };

  useEffect(() => {
    if (startAutomatically) {
      handleStart();
    }
  }, [computeSocket, startAutomatically]);

  useEffect(() => {
    const newSeedSolver = new SeedSolver(useCores, false);
    setSeedSolver(newSeedSolver);
    return () => {
      newSeedSolver.destroy();
    };
  }, [useCores]);

  return (
    <Container>
      <Row>
        <p>This tab allows you to use this device's computing power to help with searches.</p>
        <div className="ps-3">
          <ul>
            <li>If you're doing your own searches on other devices, this device's compute will be used for that.</li>
            <li>
              If not, you can help other users with their searches and earn compute time for your own future searches.
            </li>
            <li>To see how much compute time you have, go your profile page.</li>
          </ul>
        </div>
      </Row>
      <hr />
      <Row>
        <p>{connected ? "Connected" : "Not Connected"}</p>{" "}
      </Row>
      {computeVersionMismatch && (
        <Row className="mx-3 mb-3">
          <VersionMisatch />
        </Row>
      )}
      <Stack gap={3}>
        <Row>
          <Col md={3}>{computeRunning ? "Running" : "Stopped"}</Col>
        </Row>
        <Row>
          {computeRunning && (
            <Col md={8}>
              {computeInfo.jobName ? (
                <Col>
                  <Col>Working on job: {computeInfo.jobName}</Col>
                  <Col>
                    Chunk {localizeNumber(computeInfo.chunkFrom)} - {localizeNumber(computeInfo.chunkTo)}
                  </Col>
                  <Col className="text-muted fw-light">
                    Cluster stats: Seeds checked: {localizeNumber(computeInfo.jobStats.checked)} (Estimated time left:{" "}
                    {humanize(computeInfo.jobStats.estimate * 1000, {
                      round: true,
                      units: ["h", "m"],
                    })}
                    , {localizeNumber(Math.round(computeInfo.jobStats.rate * 100) / 100)} avg seeds/s)
                  </Col>
                </Col>
              ) : (
                <Col>Waiting for next job</Col>
              )}
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Start automatically</Form.Label>
              <Form.Check
                type="switch"
                checked={startAutomatically as any}
                onChange={() => setStartAutomatically(!startAutomatically)}
              />
            </Form.Group>
          </Col>
          <Col>
            <UseMultithreadingButton />
          </Col>
          <Col>
            <Button disabled={computeRunning} onClick={() => handleStart()}>
              Start
            </Button>
          </Col>
          <Col>
            <Button disabled={!computeRunning} onClick={() => handleStop()}>
              Stop
            </Button>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
};

const withSupport = props => {
  if (typeof OffscreenCanvas === "undefined") {
    return (
      <Container>
        <p>
          Compute not supported on this device.
          <br />
          If you are on a mobile apple device, they are not supported.
          <br />
          If on an apple desktop device, please use a Chromium browser (Chrome, edge, etc.) or Firefox.
        </p>
      </Container>
    );
  }
  return <Compute {...props} />;
};

export default withSupport;
