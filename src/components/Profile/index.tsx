import { FC, useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Cookies from "js-cookie";
import humanize from "humanize-duration";

import PatreonButton from "../misc/PatreonButton";

import { ProfileContext, IPatreonData } from "./ProfileContext";
import { Link } from "react-router-dom";
import classNames from "classnames";

const oauthLink = () => {
  const noitoolSessionToken = Cookies.get("noitoolSessionToken");

  const patreonLink = new URL("https://www.patreon.com/oauth2/authorize");
  patreonLink.searchParams.append("response_type", "code");
  patreonLink.searchParams.append("client_id", process.env.REACT_APP_PATREON_ID!);
  patreonLink.searchParams.append("redirect_uri", process.env.REACT_APP_PATREON_REDIRECT_URL!);
  // patreonLink.searchParams.append('scope', 'identity, identity[email], identity.memberships, campaigns');
  patreonLink.searchParams.append("state", noitoolSessionToken!);

  return patreonLink.toString();
};

const LinkPatreon = () => {
  return (
    <div>
      <p>
        Connect your Patreon account to unlock extra features of Noitool <b>(no patronage necessary)</b>:
      </p>
      <dl className="row">
        <dt className="col-sm-2">Noitool Sync</dt>
        <dd className="col-sm-10">Sync Noitool across devices (in development)</dd>
        <dt className="col-sm-2">Compute</dt>
        <dd className="col-sm-10">
          Enjoy <b>5 compute-hours</b> of cluster-assisted search each month, on me!
          <br className="mb-2" />
          <b>5 seconds</b> of compute time ≈ <b>5 seconds</b> of processing time on the equivalent of a 18-core CPU.
          <br />
          <small className="text-muted">
            You can also connect your other computers to the compute cluster, and they will contribute to your search
            without consuming your compute time! <br />
            Or you can contribute to other people's searches, and earn compute time for yourself!
          </small>
        </dd>
      </dl>

      <br />
      <a className={classNames("btn btn-primary btn-lg", "w-100")} href={oauthLink()}>
        Connect Patreon account
      </a>
      <div className="my-5" />
    </div>
  );
};

const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

const suffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);
const formatOrdinals = n => {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

const h = (t: number) => humanize(t, { round: true, units: ["h", "m"] });

interface IPatreonDataProps {
  data: IPatreonData;
}
const PatreonData: FC<IPatreonDataProps> = ({ data }) => {
  const { patreonId, noitoolId, userName, computeLeft, patreonComputeLeft, providedComputeLeft, resetDay } = data;
  return (
    <div>
      <p>
        Connected as <b>{userName}</b>
        <br />
        <small className="fw-light">
          {patreonId} / {noitoolId}
        </small>
      </p>
      <div>
        <p>
          You have <b>{h(computeLeft)}</b> of compute time left
        </p>
        <p>
          Compute time left from your Patreon pledge: {h(patreonComputeLeft)} <br />
          <small className="text-muted mt-0">Resets on the {formatOrdinals(resetDay || 0)} of each month</small>
        </p>
        <p>
          Compute time left from providing cluster resources: {h(providedComputeLeft)} <br />
          <small className="text-muted mt-0">
            Visit the <Link to="/compute">Compute Page</Link> to learn more
          </small>
        </p>
      </div>
    </div>
  );
};

const PatreonAccount = () => {
  const { patreonData, patreonDataLoading, patreonDataError, handleLogout, handleLogoutAll } =
    useContext(ProfileContext);

  const loggedIn = !!patreonData;

  if (patreonDataError) {
    return (
      <div>
        <h3>Patreon Account</h3>
        <p>An error occurred while fetching your Patreon data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column">
      <h3>Patreon Account</h3>
      {patreonDataLoading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {!loggedIn && <LinkPatreon />}
          {patreonData && <PatreonData data={patreonData} />}
          {patreonData && patreonData.activePatron ? <p>Thank you for your support!</p> : <PatreonButton />}
          {loggedIn && (
            <>
              <hr className="mt-4" />
              <hr className="mb-4" />
              <Row className="">
                <Col>
                  <Button className="ms-auto w-100" variant="outline-primary" onClick={() => handleLogout()}>
                    Disconnect Patreon
                  </Button>
                </Col>
                <Col>
                  <Button className="ms-auto w-100" variant="outline-danger" onClick={() => handleLogoutAll()}>
                    Disconnect ALL devices
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Row>
      )}
    </div>
  );
};

const Profile = props => {
  return (
    <Modal size="lg" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PatreonAccount />
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
