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

import UseMultithreadingButton from "../../UseMultithreading";

const Multithreading = () => {
  return (
    <Col md={12} className="">
      <Row className="m-3">
        <UseMultithreadingButton />
      </Row>
      <Row className="m-3">
        <p>
          Multithreading will use as many CPU threads as set in the settings, but slow down your PC. PC performance may
          suffer, as well as battery life.
        </p>
      </Row>
    </Col>
  );
};

export default Multithreading;
