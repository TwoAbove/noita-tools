import React, { useContext, useEffect, useState } from "react";

import { GameInfoContext } from "../SeedDataOutput";
import { useSpellFavorite } from "./helpers";
import { Square } from "../../helpers";
import { Wand } from "./Wand";
import { Button, Modal } from "react-bootstrap";
import Entity from "../../Icons/Entity";

const SnowcastleSecretChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [spells, setSpellData] = useState(() =>
    gameInfoProvider.providers.snowcastleSecretChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const spells = gameInfoProvider.providers.snowcastleSecretChamber.provide(gameInfoProvider.config.seed);
    setSpellData(spells);
  }, [gameInfoProvider]);

  const { isFavorite } = useSpellFavorite();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button className="position-relative" onClick={() => setModalOpen(true)} variant="outline-info" size="sm">
        <Square>
          <Entity id="data/particles/image_emitters/hourglass.png" />
        </Square>
      </Button>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Snowy Depths Secret Chamber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {spells.map((spell, i) => {
            return <Entity id="Spell" key={`${spell} ${i}`} entityParams={{ extra: spell }} />;
          })}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SnowcastleSecretChamber;
