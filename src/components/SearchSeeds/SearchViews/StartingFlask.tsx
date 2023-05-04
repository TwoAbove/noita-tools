import React, { useState, useEffect, FC } from "react";
import { Row, Col, Container } from "react-bootstrap";

import Clickable from "../../Icons/Clickable";
import { capitalize } from "../../../services/helpers";
import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";
import { MaterialInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Material";
import i18n from "../../../i18n";

interface IStartingFlaskProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule;
}

const flaskOptions = [
  "",
  "mud",
  "water_swamp",
  "water_salt",
  "swamp",
  "snow",
  "water",
  "blood",
  "acid",
  "magic_liquid_polymorph",
  "magic_liquid_random_polymorph",
  "magic_liquid_berserk",
  "magic_liquid_charm",
  "magic_liquid_movement_faster",
  "urine",
  "gold",
  "slime",
  "gunpowder_unstable",
];
const material = new MaterialInfoProvider(i18n);

const StartingFlask: FC<IStartingFlaskProps> = ({ onUpdateConfig, config }) => {
  const { val: startingFlaskType } = config;

  const setStartingFlaskType = newConfig => {
    onUpdateConfig({
      type: "startingFlask",
      path: "",
      params: [],
      val: newConfig,
    });
  };

  const handleClicked = type => {
    setStartingFlaskType(type);
  };

  return (
    <Container fluid>
      <Row className="justify-content-evenly align-items-center">
        {flaskOptions.map((type, i) => {
          return (
            <Col key={type}>
              <Clickable onClick={() => handleClicked(type)} clicked={type === startingFlaskType}>
                <div className="m-3">{type ? capitalize(material.translate(type)) : "Any"}</div>
              </Clickable>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default StartingFlask;
