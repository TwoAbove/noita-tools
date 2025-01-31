import React, { ReactElement, ReactNode } from "react";
import { Form, Col, Row, Container } from "react-bootstrap";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import classNames from "classnames";

import useLocalStorage from "../../services/useLocalStorage";

interface IConfigRowProps {
  left: React.ReactElement;
  right: React.ReactElement;
  className?: string;
}
export const ConfigRow = (props: IConfigRowProps) => {
  // Maybe make this work with children and not left/right props?
  return (
    <Row className={classNames("align-items-baseline justify-content-between", props.className)}>
      <Col>{props.left}</Col>
      <Col className="col-auto">{props.right}</Col>
    </Row>
  );
};

export const ConfigTitle = (props: { title: ReactNode; subtitle: ReactNode }) => {
  return (
    <div className="ms-2">
      <strong>{props.title}</strong>
      <div className="pb-3">{props.subtitle}</div>
    </div>
  );
};

interface IPanelToggleProps {
  id: string;
  title: string;
}
export const PanelToggle = (props: IPanelToggleProps) => {
  const { id, title } = props;
  const [show, setShow] = useLocalStorage(`panel-${id}-config`, true);
  return (
    <ConfigRow
      left={
        <>
          <strong className="">{title}</strong>
        </>
      }
      right={
        <Form.Switch
          checked={show}
          onChange={e => {
            setShow(e.target.checked);
          }}
          id={`panel-${id}-config-switch`}
          label=""
        />
      }
    />
  );
};

export const DropZone = ({
  children,
  onDrop,
}: {
  children: ReactElement | ReactElement[];
  onDrop: DropzoneOptions["onDrop"];
}) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Container className="text-center border rounded-3 border-2" {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </Container>
  );
};
