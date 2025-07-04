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
  type?: "from" | "to";
  goldToGold: boolean;
  holyGrassToHolyGrass: boolean;

  handleHeldMaterial: (val: boolean) => void;
  handleGoldToGold?: (val: boolean) => void;
  handleHolyGrassToHolyGrass?: (val: boolean) => void;
  handleOnUpdate?: (list: string[]) => void;
}

const FlaskMaterialSelect = (props: IFlaskMaterialSelectProps) => {
  const {
    show,
    type,
    handleClose,
    handleOnUpdate,
    selected,
    list,
    useFlask,
    goldToGold,
    holyGrassToHolyGrass,
    handleHeldMaterial,
    handleGoldToGold,
    handleHolyGrassToHolyGrass,
  } = props;
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
          <Col xs="auto">
            <div className="d-flex flex-column gap-2">
              <Form.Switch
                checked={useFlask}
                onChange={e => {
                  const checked = e.target.checked;
                  handleHeldMaterial(checked);
                  if (!checked) {
                    handleGoldToGold?.(false);
                    handleHolyGrassToHolyGrass?.(false);
                  }
                }}
                id="custom-switch"
                label="Held Material"
              />
              {type && type === "to" && (
                <div className="ms-4">
                  {handleGoldToGold && (
                    <Form.Check
                      type="switch"
                      id="gold-to-gold-switch"
                      label="Gold to Gold"
                      checked={!!goldToGold}
                      disabled={!useFlask}
                      onChange={e => handleGoldToGold(e.target.checked)}
                    />
                  )}
                  {handleHolyGrassToHolyGrass && (
                    <Form.Check
                      type="switch"
                      id="holygrass-to-holygrass-switch"
                      label="Holy Grass to Holy Grass"
                      checked={!!holyGrassToHolyGrass}
                      disabled={!useFlask}
                      onChange={e => handleHolyGrassToHolyGrass(e.target.checked)}
                    />
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
        <ListSelect selected={selected} items={list} onUpdate={set => handleOnUpdate?.([...set])} />
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
        <ListSelect selected={selected} items={list} onClick={material => handleOnClick?.(material)} />
      </Modal.Body>
    </Modal>
  );
};

export { FlaskMaterialSelect, MaterialSelect };
