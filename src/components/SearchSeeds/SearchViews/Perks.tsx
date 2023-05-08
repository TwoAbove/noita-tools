/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FC } from "react";
import { Row, Col, Container, Stack, Button, Form } from "react-bootstrap";

import classNames from "classnames";
import Clickable from "../../Icons/Clickable";
import PerkSelect from "../../PerkSelect";
import Icon from "../../Icons/Icon";
import { Square } from "../../helpers";
import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";
import Perk from "../../Icons/Perk";
import { PerkInfoProvider, IPerkRule } from "../../../services/SeedInfo/infoHandler/InfoProviders/Perk";

const perkInfoProvider = new PerkInfoProvider({} as any);

interface IPerksProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule<IPerkRule>;
}

const getMaxPerksPerRow = (perks: string[][]): number[] => {
  const res: number[] = [];
  let ppr = 3; // default
  perks.forEach((row, i) => {
    res.push(ppr);
    const extraPerk = row.filter(r => r === "EXTRA_PERK").length;
    ppr += extraPerk;
  });
  return res;
};

const PerkCol: FC<any> = ({ title, perks, handleDelete, togglePerkSelect }) => {
  return (
    <Col xs={6}>
      {title}
      <Stack gap={3}>
        {perks.map((row, i) => {
          return (
            <Row className="justify-content-center align-items-center" key={i}>
              <Col xs={3}>Level {i + 1}</Col>
              <Col>
                <Stack gap={3} direction="horizontal">
                  {row.map(perkId => {
                    return (
                      <Perk
                        key={perkId}
                        onClick={() => handleDelete(perkId, i)}
                        perk={perkInfoProvider.perks[perkId]}
                      />
                    );
                  })}
                </Stack>
              </Col>
              <Col className="me-auto">
                <Button size="sm" onClick={() => togglePerkSelect(i)}>
                  <Square>Add Perk</Square>
                </Button>
              </Col>
            </Row>
          );
        })}
      </Stack>
    </Col>
  );
};

const Perks: FC<IPerksProps> = ({ onUpdateConfig, config }) => {
  const { val } = config;
  const [selectOpen, setSelectOpen] = useState(-1);
  const [selectType, setSelectType] = useState("");

  const perksSome = val?.some || [];
  const perksAll = val?.all || [];
  const perksDeck = val?.deck || [];

  const setPerks = newConfig => {
    onUpdateConfig({
      ...config,
      type: "perk",
      path: "",
      params: [],
      val: newConfig,
    });
  };

  const handleAdd = (type, perkId) => {
    let perks;
    switch (type) {
      case "all":
        perks = perksAll;
        break;
      case "some":
        perks = perksSome;
        break;
      case "deck":
        perks = perksDeck;
        break;
    }
    // The regular [...] keeps refs to the old arrays, so need to copy
    const newPerks = perks.map(p => p.slice());
    newPerks[selectOpen].push(perkId);
    setPerks({ ...val, [type]: newPerks });
  };

  const handleDelete = (type, perkId, row) => {
    let perks;
    switch (type) {
      case "all":
        perks = perksAll;
        break;
      case "some":
        perks = perksSome;
        break;
      case "deck":
        perks = perksDeck;
        break;
    }
    // The regular [...] keeps refs to the old arrays, so need to copy
    const newPerks = perks.map(p => p.slice());
    const index = newPerks[row].indexOf(perkId);
    if (index === -1) {
      return;
    }
    newPerks[row].splice(index, 1);

    // Handle EXTRA_PERK perk being removed
    if (perkId !== "EXTRA_PERK") {
      setPerks({ ...val, [type]: newPerks });
      return;
    }
    // We don't need to do anything if it's the last level
    if (row === newPerks.length - 1) {
      setPerks({ ...val, [type]: newPerks });
      return;
    }

    for (let i = row + 1; i < newPerks.length; i++) {
      // Only do something if we are at max
      if (newPerks[i].length !== 3) {
        continue;
      }
      newPerks[i] = newPerks[i].slice(0, -1);
    }
    setPerks({ ...val, [type]: newPerks });
  };

  const togglePerkSelect = (type, n = 0) => {
    setSelectType(type);
    setSelectOpen(n);
  };

  const getSelected = (type, row) => {
    switch (type) {
      case "all":
        return perksAll[row];
      case "some":
        return perksSome[row];
      case "deck":
        return perksDeck[row];
    }
    return [];
  };

  return (
    <Container fluid>
      <p>
        <b>Deck:</b> Choose which perks must be in the deck. <b>All of:</b> <i>All</i> perks must be in the Holy
        Mountain. <b>Some of:</b> At least <i>one</i> of the perks must be in the Holy Mountain. <br />
        To delete a perk, click on it. Compute-intensive. Use sparingly!
      </p>
      <Row className="my-2 p-2 border-bottom border-top">
        <Col>
          Deck:
          <Row className="justify-content-start row-cols-auto">
            {perksDeck[0].map(perkId => {
              return (
                <Col key={perkId}>
                  <Perk onClick={() => handleDelete("deck", perkId, 0)} perk={perkInfoProvider.perks[perkId]} />
                </Col>
              );
            })}
            <Col className="me-auto flex-grow-1">
              <Button size="sm" onClick={() => togglePerkSelect("deck", 0)}>
                <Square>Add Perk</Square>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <PerkCol
          title="All of:"
          perks={perksAll}
          handleDelete={(perkId, row) => handleDelete("all", perkId, row)}
          togglePerkSelect={i => togglePerkSelect("all", i)}
        />
        <PerkCol
          title="Some of:"
          perks={perksSome}
          handleDelete={(perkId, row) => handleDelete("some", perkId, row)}
          togglePerkSelect={i => togglePerkSelect("some", i)}
        />
      </Row>
      <PerkSelect
        selected={getSelected(selectType, selectOpen)}
        handleOnClick={perkId => handleAdd(selectType, perkId)}
        show={selectOpen >= 0}
        handleClose={() => togglePerkSelect("", -1)}
      />
    </Container>
  );
};

export default Perks;
