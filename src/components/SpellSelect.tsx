/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { Modal, Row, Col, FormControl } from "react-bootstrap";
import Fuse from "fuse.js";

import Icon from "./Icons/Icon";
import Clickable from "./Icons/Clickable";

import { useTranslation } from "react-i18next";
import LoadingComponent from "./LoadingComponent";
import { GameInfoContext } from "./SeedInfo/SeedDataOutput";

const options = {
  minMatchCharLength: 2,
  // shouldSort: false,
  keys: ["id", "name", "description"],
};

interface ISpellSelectProps {
  show: boolean;
  level?: number;
  selected: string[];
  showSelected?: boolean;
  handleClose: () => void;
  handleOnClick: (id: string) => void;
  handleSelectedClicked: (id: string) => void;
}

const SpellSelect: FC<ISpellSelectProps> = ({
  level,
  show,
  showSelected,
  handleClose,
  handleOnClick,
  handleSelectedClicked,
  selected = [],
}) => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const { t, i18n } = useTranslation("materials");

  const { gameInfoProvider } = useContext(GameInfoContext);

  const translatedShop = useMemo(() => {
    return gameInfoProvider!.providers.spells.spellsArr.map(s => ({
      ...s,
      name: t(s.name),
      description: t(s.description),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n, i18n.language]);

  const [fuse, setFuse] = useState(() => new Fuse(translatedShop, options as any));

  useEffect(() => {
    startTransition(() => {
      setFuse(new Fuse(translatedShop, options as any));
    });
  }, [t, i18n, i18n.language, translatedShop]);

  const spellsToShow = (filter ? fuse.search(filter).map(s => s.item) : gameInfoProvider!.providers.spells.spellsArr)
    .filter(s =>
      level && level >= 0
        ? Object.keys(s.spawn_probabilities).includes(String(gameInfoProvider!.providers.shop.getShopLevel(level)))
        : true,
    )
    .filter(s => !selected.includes(s.id));

  const handleFilter = e => {
    setFilter(e.target.value);
  };

  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Spell Select</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isPending ? (
          <LoadingComponent />
        ) : (
          showSelected &&
          selected.length > 0 && (
            <Row sm={8} className="p-3 justify-content-start align-items-center row-cols-auto">
              {selected.map(s => {
                const spell = gameInfoProvider!.providers.spells.spells[s];
                return (
                  <Col className="p-0 m-1" key={spell.id}>
                    <Clickable useHover onClick={() => handleSelectedClicked(spell.id)}>
                      <Icon uri={spell.sprite} alt={t(spell.description)} title={t(spell.name)} background />
                    </Clickable>
                  </Col>
                );
              })}
            </Row>
          )
        )}
        <Row className="p-1 ps-4 pe-4 align-items-center">
          <FormControl
            type="search"
            placeholder="Filter"
            className=""
            aria-label="Filter"
            value={filter}
            onChange={handleFilter}
          />
        </Row>
        <Row sm={8} className="p-3 justify-content-center align-items-center row-cols-auto">
          {spellsToShow.map(spell => {
            return (
              <Col className="p-0 m-1" key={spell.id}>
                <Clickable useHover onClick={() => handleOnClick(spell.id)}>
                  <Icon uri={spell.sprite} alt={t(spell.description)} title={t(spell.name)} background />
                </Clickable>
              </Col>
            );
          })}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SpellSelect;
