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
  disabled?: boolean;
  filter?: boolean;
  strict?: boolean;
}

const SpellSelect: FC<ISpellSelectProps> = ({
  level,
  show,
  showSelected,
  handleClose,
  handleOnClick,
  handleSelectedClicked,
  selected = [],
  disabled = false,
  filter = true,
  strict = true,
}) => {
  const [isPending, startTransition] = useTransition();
  const [selectedFilter, setSelectedFilter] = useState("");
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

  const spellsToShow = (
    filter && selectedFilter
      ? fuse.search(selectedFilter).map(s => s.item)
      : gameInfoProvider!.providers.spells.spellsArr
  ).filter(s =>
    level !== undefined && level >= 0
      ? Object.keys(s.spawn_probabilities).includes(String(gameInfoProvider!.providers.shop.getShopLevel(level)))
      : true,
  );

  const handleFilter = e => {
    setSelectedFilter(e.target.value);
  };

  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Spell Select {disabled && <small className="text-muted">(Max capacity reached)</small>}
          {filter && <small className="text-muted ms-2">({strict ? "All required" : "Any of these"})</small>}
        </Modal.Title>
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
        {filter && (
          <Row className="p-1 ps-4 pe-4 align-items-center">
            <FormControl
              type="search"
              placeholder="Filter"
              className=""
              aria-label="Filter"
              value={selectedFilter}
              onChange={handleFilter}
            />
          </Row>
        )}
        <Row sm={8} className="p-3 justify-content-center align-items-center row-cols-auto">
          {spellsToShow.map(spell => {
            return (
              <Col className="p-0 m-1" key={spell.id}>
                <Clickable useHover onClick={() => !disabled && handleOnClick(spell.id)}>
                  <Icon
                    uri={spell.sprite}
                    alt={t(spell.description)}
                    title={t(spell.name)}
                    background
                    style={disabled ? { opacity: 0.5 } : undefined}
                  />
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
