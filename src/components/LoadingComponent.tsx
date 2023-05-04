import React from "react";
import { Container, ProgressBar } from "react-bootstrap";

const LoadingComponent = props => {
  return (
    <Container className="container shadow-lg mb-5">
      <ProgressBar animated now={100} />
    </Container>
  );
};

export default LoadingComponent;
