/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap";

import ListSelect from "./ListSelect";

interface IMaterialSelectProps {
  show: boolean;
  selected: Set<string>;
  list: string[];

  handleClose: () => void;
  handleOnClick?: (list: string) => void;
}
interface IFlaskMaterialSelectProps extends IMaterialSelectProps {
  useFlask: boolean;
  handleFlask: (val: boolean) => void;
  handleOnUpdate?: (list: string[]) => void;
}

const FlaskMaterialSelect = (props: IFlaskMaterialSelectProps) => {
  const { show, handleClose, handleOnUpdate, selected, list, useFlask, handleFlask } = props;
  const onDeselectAll = () => {
    handleOnUpdate && handleOnUpdate([]);
  };

  const onSelectAll = () => {
    handleOnUpdate && handleOnUpdate([...list]);
  };

  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Material Selector</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3 align-items-center">
          <Col className="me-3">
            <ButtonGroup size="sm">
              <Button variant="outline-primary" onClick={() => onSelectAll()}>
                Select All
              </Button>
              <Button variant="outline-primary" onClick={() => onDeselectAll()}>
                Deselect All
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs={3}>
            <Form.Switch
              checked={useFlask}
              onChange={e => {
                handleFlask(e.target.checked);
              }}
              id="custom-switch"
              label="Flask"
            />
          </Col>
        </Row>
        <ListSelect selected={selected} items={list} onUpdate={set => handleOnUpdate && handleOnUpdate([...set])} />
      </Modal.Body>
    </Modal>
  );
};

const MaterialSelect = (props: IMaterialSelectProps) => {
  const { show, handleClose, handleOnClick, selected, list } = props;
  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Material Selector</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListSelect selected={selected} items={list} onClick={material => handleOnClick && handleOnClick(material)} />
      </Modal.Body>
    </Modal>
  );
};

export { FlaskMaterialSelect, MaterialSelect };
