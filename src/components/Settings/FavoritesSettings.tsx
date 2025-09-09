import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Button, Col, Form, ListGroup, Stack } from "react-bootstrap";
import { db, FavoriteType } from "../../services/db";
import PerkSelect from "../PerkSelect";
import { MaterialSelect } from "../MaterialSelect";
import SpellSelect from "../SpellSelect";
import { ConfigRow, ConfigTitle } from "./helpers";

import useLocalStorage from "../../services/useLocalStorage";
import { FungalShiftInfoProvider } from "../../services/SeedInfo/infoHandler/InfoProviders/FungalShift";

const fungalInfoProvider = new FungalShiftInfoProvider({} as any);

const materialsFrom = fungalInfoProvider.fungalData.materials_from.flatMap(m => m.materials);
const materialsTo = fungalInfoProvider.fungalData.materials_to.map(m => m.material);

const materialList = [...new Set([...materialsFrom, ...materialsTo])];

const PerkFavorites = () => {
  const [open, setOpen] = useState(false);
  const handleSelect = async (perk: string) => {
    await db.toggleFavorite(FavoriteType.Perk, perk);
  };
  const query = useLiveQuery(() => db.favorites.where({ type: FavoriteType.Perk }).toArray(), [], []);
  const selected = query.map(q => q.key);

  const [val, setVal] = useLocalStorage("favorite-perks-reroll", 2);
  const handleRange = (e: any) => {
    setVal(e.target.valueAsNumber);
  };

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Perks</strong>
        </>
      }
      right={
        <>
          <PerkSelect
            showSelected
            selected={selected}
            handleClose={() => setOpen(false)}
            handleOnClick={perk => handleSelect(perk)}
            handleSelectedClicked={perk => handleSelect(perk)}
            show={open}
          />
          <Stack direction="horizontal">
            <div className="d-flex justify-content-center">
              <Form.Group as={Col} xs={6} controlId="code">
                <Form.Label className="m-0">Rerolls to check: {val}</Form.Label>
                <Form.Range value={val} onChange={handleRange} min="0" max="5" />
              </Form.Group>
            </div>
            <Button onClick={() => setOpen(true)} size="sm">
              Select Perks
            </Button>
          </Stack>
        </>
      }
    />
  );
};

const SpellFavorites = () => {
  const [open, setOpen] = useState(false);
  const handleSelect = async (spell: string) => {
    await db.toggleFavorite(FavoriteType.Spell, spell);
  };
  const query = useLiveQuery(() => db.favorites.where({ type: FavoriteType.Spell }).toArray(), [], []);
  const selected = query.map(q => q.key);

  const [val, setVal] = useLocalStorage("favorite-spell-preview-max-count", 2);
  const handleRange = (e: any) => {
    setVal(e.target.valueAsNumber);
  };

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Spells</strong>
        </>
      }
      right={
        <>
          <SpellSelect
            showSelected
            selected={selected}
            handleClose={() => setOpen(false)}
            handleOnClick={spell => handleSelect(spell)}
            handleSelectedClicked={spell => handleSelect(spell)}
            show={open}
          />
          <Stack direction="horizontal">
            <div className="d-flex justify-content-center">
              <Form.Group as={Col} xs={6} controlId="code">
                <Form.Label className="m-0">Preview count: {val}</Form.Label>
                <Form.Range value={val} onChange={handleRange} min="0" max="12" />
              </Form.Group>
            </div>
            <Button onClick={() => setOpen(true)} size="sm">
              Select Spells
            </Button>
          </Stack>
        </>
      }
    />
  );
};
const MaterialFavorites = () => {
  const [open, setOpen] = useState(false);
  const handleSelect = async (spell: string) => {
    await db.toggleFavorite(FavoriteType.Material, spell);
  };
  const query = useLiveQuery(() => db.favorites.where({ type: FavoriteType.Material }).toArray(), [], []);
  const selected = query.map(q => q.key);

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Materials</strong>
        </>
      }
      right={
        <>
          <MaterialSelect
            list={materialList}
            selected={new Set<string>(selected)}
            handleClose={() => setOpen(false)}
            handleOnClick={spell => handleSelect(spell)}
            show={open}
          />
          <Button onClick={() => setOpen(true)} size="sm">
            Select Materials
          </Button>
        </>
      }
    />
  );
};

const FavoritesSettings = () => {
  return (
    <>
      <ConfigTitle title="Favorites" subtitle="Things chosen here will be highlighted so they are easier to spot." />
      <ListGroup variant="flush" className="mb-5 shadow">
        <ListGroup.Item>
          <PerkFavorites />
        </ListGroup.Item>
        <ListGroup.Item>
          <SpellFavorites />
        </ListGroup.Item>
        <ListGroup.Item>
          <MaterialFavorites />
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default FavoritesSettings;
