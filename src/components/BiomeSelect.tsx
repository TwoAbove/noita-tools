/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Modal, Row, Col, FormControl, Stack, ListGroup, Collapse } from "react-bootstrap";
import Fuse from "fuse.js";

import { capitalize, Objectify } from "../services/helpers";
import BiomeModifier from "./SeedInfo/SeedInfoViews/BiomeMod";
import { BiomeModifierInfoProvider } from "../services/SeedInfo/infoHandler/InfoProviders/BiomeModifier";
import { BiomeInfoProvider } from "../services/SeedInfo/infoHandler/InfoProviders/Biome";

const options = {
  shouldSort: false,
  keys: ["id", "ui_name"],
};

const biomeModifierInfoProvider = new BiomeModifierInfoProvider({} as any);
const biomeInfoProvider = new BiomeInfoProvider({} as any);

interface IBiomeSelectProps {
  show: boolean;
  filterBiomes?: { [biome: string]: string[] };
  handleClose: () => void;
  handleOnSelect: (biome: string, modifier: string) => void;
}

const BiomeSelect = (props: IBiomeSelectProps) => {
  const { show, handleClose, handleOnSelect, filterBiomes = {} } = props;
  const [selectedBiome, setSelectedBiome] = useState("");

  const availableFilteredBiomeModifiers = Object.entries(filterBiomes).reduce((c, [biome, modifiers]) => {
    if (c[biome]) {
      c[biome] = c[biome].filter(b => !modifiers.includes(b));
    }
    if (c[biome] && !c[biome].length) {
      delete c[biome];
    }
    return c;
  }, biomeModifierInfoProvider.availableBiomeModifiers);

  const biomesToShow = Object.keys(availableFilteredBiomeModifiers).filter(
    b => biomeInfoProvider.provide(b).translated_name
  );

  const handleSubmit = (biome: string, modifier: string) => {
    handleOnSelect(biome, modifier);
    setSelectedBiome("");
  };

  const handlePreClose = () => {
    setSelectedBiome("");
    handleClose();
  };

  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handlePreClose}>
      <Modal.Header closeButton>
        <Modal.Title>Biome Selector</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Collapse in={!selectedBiome}>
          <ListGroup className="">
            {biomesToShow.map(biome => {
              return (
                <ListGroup.Item key={biome} action onClick={() => setSelectedBiome(biome)}>
                  <div className="m-1">{capitalize(biomeInfoProvider.provide(biome).translated_name)}</div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Collapse>
        <Collapse in={!!selectedBiome}>
          <ListGroup className="">
            {selectedBiome &&
              availableFilteredBiomeModifiers[selectedBiome].map(modifier => {
                return (
                  <ListGroup.Item
                    key={modifier}
                    className="d-flex"
                    action
                    onClick={() => handleSubmit(selectedBiome, modifier)}
                  >
                    <div className="mx-auto"></div>
                    <BiomeModifier biome={""} modifier={biomeModifierInfoProvider.get(modifier)} />
                    <div className="mx-auto"></div>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </Collapse>
      </Modal.Body>
    </Modal>
  );
};

export default BiomeSelect;
