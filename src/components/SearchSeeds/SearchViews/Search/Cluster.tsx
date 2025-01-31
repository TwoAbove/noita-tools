import { Row, Col, Button } from "react-bootstrap";

import { useSearchContext } from "../../SearchContext";
import { VersionMisatch } from "../../../misc/VersionMismatch";

const InfoText = ({ clusterHelpAvailable }) => {
  if (clusterHelpAvailable) {
    return (
      <p>
        Offloading part of the work to a compute cluster is <b>available</b>!
      </p>
    );
  }

  return (
    <p>
      Offloading part of the work to a compute cluster is temporarily <b>not available</b>.
    </p>
  );
};

const IndicatorConnected = () => {
  return <i className="bi bi-cloud-check"></i>;
};
const IndicatorNotConnected = () => {
  return <i className="bi bi-cloud-slash"></i>;
};

const ClusterInfo = () => {
  const {
    clusterState,
    clusterHelpAvailable,
    clusterHelpEnabled,
    toggleClusterHelp,
    clusterConnected,
    computeVersionMismatch,
  } = useSearchContext();

  const buttonDisabled = !clusterHelpAvailable;
  let buttonVariant = "outline-info";
  if (clusterHelpEnabled) {
    buttonVariant = "outline-success";
  }
  if (buttonDisabled) {
    buttonVariant = "outline-secondary";
  }
  return (
    <Col md={12} className="mt-3 mt-sm-0 mb-3">
      {computeVersionMismatch && (
        <Row className="mx-3 mb-1">
          <VersionMisatch />
        </Row>
      )}
      {clusterHelpAvailable && (
        <Row className="mx-3 mb-1">
          <Button
            style={{
              position: "relative",
            }}
            disabled={buttonDisabled}
            variant={buttonVariant}
            onClick={toggleClusterHelp}
          >
            {clusterHelpEnabled ? "Cluster compute enabled" : "Enable cluster compute"}
            <div
              style={{
                position: "absolute",
                top: "-0.0rem",
                right: "0.5rem",
                fontSize: "1rem",
              }}
              className="ms-2"
            >
              {clusterConnected ? <IndicatorConnected /> : <IndicatorNotConnected />}
            </div>
          </Button>
        </Row>
      )}
      <Row className="mx-3 mb-0">
        <InfoText clusterHelpAvailable={clusterHelpAvailable} />
      </Row>
      <Row className="mx-3 mt-0">
        <Col className="fw-light p-1 lh-sm" xs={12} sm={6}>
          Current cluster size: <br />
          <b>
            {clusterState.workers} ({clusterState.appetite} cores online)
          </b>
          <br />
        </Col>
        <Col className="fw-light p-1 lh-1" xs={12} sm={6}>
          Searchers online: <b>{clusterState.hosts}</b>
        </Col>
      </Row>
    </Col>
  );
};

export default ClusterInfo;
