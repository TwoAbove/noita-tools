/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { Modal, ModalProps, Row, Col, FormControl } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Icon from "./Icons/Icon";
import Clickable from "./Icons/Clickable";
import Perk from "./Icons/Perk";
import { PerkInfoProvider } from "../services/SeedInfo/infoHandler/InfoProviders/Perk";
import Entity from "./Icons/Entity";

import entities from "../services/SeedInfo/data/obj/entities.json";

const perkInfoProvider = new PerkInfoProvider({} as any);

const subtextMap = {
  Spell: ({ t }) => <div>Spell</div>,
  "data/entities/animals/illusions/dark_alchemist.xml": ({ t }) => <div>{t("$animal_dark_alchemist")}</div>,
  "data/entities/items/pickup/potion_secret.xml": ({ t }) => (
    <div>
      {t("$item_potion")} <br /> Secret
    </div>
  ),
  "data/entities/items/pickup/potion_random_material.xml": ({ t }) => (
    <div>
      {t("$item_potion")} <br /> Random Material
    </div>
  ),
  "data/entities/items/wand_level_01.xml": () => <div>Level 1 wand</div>,
  "data/entities/items/wand_unshuffle_01.xml": () => (
    <div>
      Level 1 wand <br /> Unshuffle
    </div>
  ),
  "data/entities/items/wand_level_02.xml": () => <div>Level 2 wand</div>,
  "data/entities/items/wand_unshuffle_02.xml": () => (
    <div>
      Level 2 wand <br /> Unshuffle
    </div>
  ),
  "data/entities/items/wand_level_03.xml": () => <div>Level 3 wand</div>,
  "data/entities/items/wand_unshuffle_03.xml": () => (
    <div>
      Level 3 wand <br /> Unshuffle
    </div>
  ),
  "data/entities/items/wand_level_04.xml": () => <div>Level 4 wand</div>,
  "data/entities/items/wand_unshuffle_04.xml": () => (
    <div>
      Level 4 wand <br /> Unshuffle
    </div>
  ),
};

interface IEntityViewProps {
  id: string;
  onClick: () => void;
}
const EntityView: FC<IEntityViewProps> = ({ id, onClick }) => {
  const entity = entities[id];
  const name = entity?.name;
  const Subtext = subtextMap[id];
  const [t] = useTranslation("materials");
  return (
    <>
      <Entity id={id} onClick={onClick} />
      {(Subtext && <Subtext t={t} />) || t(name)}
    </>
  );
};

interface IEntitySelectProps {
  selected: string[];
  entitiesToShow: string[];
  show: boolean;
  showSelected?: boolean;
  handleClose: () => void;
  handleOnClick: (id: string) => void;
  handleSelectedClicked?: (id: string) => void;
  modalProps?: Partial<ModalProps>;
}

const EntitySelect = (props: IEntitySelectProps) => {
  const {
    modalProps = {},
    showSelected,
    show,
    entitiesToShow,
    handleClose,
    handleOnClick,
    handleSelectedClicked,
    selected = [],
  } = props;

  return (
    <Modal {...modalProps} fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Entity Select</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showSelected && selected.length > 0 && (
          <Row sm={5} className="p-3 justify-content-start align-items-baseline row-cols-auto">
            {selected.map(entity => {
              return (
                <Col className="p-0 m-1 d-flex flex-column align-items-center text-center lh-1" key={entity}>
                  <EntityView onClick={() => handleSelectedClicked && handleSelectedClicked(entity)} id={entity} />
                </Col>
              );
            })}
          </Row>
        )}
        <Row sm={5} className="p-3 justify-content-center align-items-baseline row-cols-auto">
          {entitiesToShow.map(entity => {
            return (
              <Col className="p-0 m-1 d-flex flex-column align-items-center text-center lh-1" key={entity}>
                <EntityView onClick={() => handleOnClick(entity)} id={entity} />
              </Col>
            );
          })}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default EntitySelect;
