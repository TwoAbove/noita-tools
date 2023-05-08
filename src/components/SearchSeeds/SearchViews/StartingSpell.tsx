import React, { useState, useEffect, FC } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";

import Clickable from "../../Icons/Clickable";
import Icon from "../../Icons/Icon";
import { SpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Spell";

const spellInfoProvider = new SpellInfoProvider({} as any);

interface IStartingSpellProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule;
}

const spellOptions = ["LIGHT_BULLET", "SPITTER", "RUBBER_BALL", "BOUNCY_ORB"];

const StartingSpell: FC<IStartingSpellProps> = ({ onUpdateConfig, config }) => {
  const { val: startingSpellType } = config;

  const setStartingSpellType = newConfig => {
    onUpdateConfig({
      type: "startingSpell",
      path: "",
      params: [],
      val: newConfig,
    });
  };

  const handleClicked = type => {
    setStartingSpellType(type);
  };

  const [t] = useTranslation("materials");

  return (
    <Container fluid>
      <Row className="justify-content-evenly align-items-center">
        {spellOptions.map((type, i) => {
          const spell = spellInfoProvider.provide(type); // spells.provide(type);
          return (
            <Col className="p-0 m-1" xs="auto" key={spell.id}>
              <Clickable
                // className="m-3"
                useHover
                onClick={() => handleClicked(spell.id)}
                clicked={type === startingSpellType}
              >
                <Icon background uri={spell.sprite} alt={t(spell.description)} title={t(spell.name)} />
              </Clickable>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default StartingSpell;
