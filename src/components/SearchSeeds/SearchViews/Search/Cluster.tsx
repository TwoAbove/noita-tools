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
import { SearchContext } from "../../SearchContext";
import UseMultithreadingButton from "../../UseMultithreading";
import { Status } from "../../../../services/compute/ChunkProvider";
import useLocalStorage from "../../../../services/useLocalStorage";
import { ProfileContext } from "../../../Profile/ProfileContext";
import { useSearchParams } from "react-router-dom";
import { useSearchParamsState } from "react-use-search-params-state";
import { VersionMisatch } from "../../../misc/VersionMismatch";

const InfoText = ({ clusterHelpAvailable, isLoggedIn, computeLeft }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterParams, setFilterParams] = useSearchParamsState({
    profile: {
      type: "boolean",
      default: false,
    },
  });

  const profileOpen = filterParams.profile;
  const handleProfile = () => {
    if (!profileOpen) {
      setFilterParams({ profile: true });
    } else {
      // delete the param outright - I don't like profile=false in the url
      searchParams.delete("profile");
      setSearchParams(searchParams);
    }
  };

  const ProfileButton = () => (
    <Button size="sm" variant="outline-info mx-1 my-0 px-1 py-0" onClick={() => handleProfile()}>
      Open Profile
    </Button>
  );

  if (clusterHelpAvailable) {
    if (!isLoggedIn) {
      return (
        <p>
          Connect your patreon account to enable cluster compute. <br />
          To learn more about cluster compute, visit your profile <ProfileButton />
        </p>
      );
    }
    return (
      <p>
        Offloading part of the work to a compute cluster is <b>available</b>!
        <br />
        You have <i>{humanize(computeLeft, { round: true, units: ["h", "m"] })}</i> of compute time available.
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
  } = useContext(SearchContext);

  const { patreonData } = useContext(ProfileContext);

  const isLoggedIn = !!patreonData;
  const buttonDisabled = !isLoggedIn || !clusterHelpAvailable;
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
        <InfoText
          isLoggedIn={isLoggedIn}
          clusterHelpAvailable={clusterHelpAvailable}
          computeLeft={patreonData?.computeLeft}
        />
      </Row>
      <Row className="mx-3 mt-0">
        <Col className="fw-light p-1 lh-sm" xs={12} sm={6}>
          Current cluster size: <br />
          <b>
            {clusterState.workers} ({clusterState.appetite} cores online)
          </b>
          <br />
          <small className="text-muted pt-0">
            <b>64</b> cores auto-connect on search start
          </small>
        </Col>
        <Col className="fw-light p-1 lh-1" xs={12} sm={6}>
          Searchers online: <b>{clusterState.hosts}</b>
        </Col>
      </Row>
    </Col>
  );
};

export default ClusterInfo;
