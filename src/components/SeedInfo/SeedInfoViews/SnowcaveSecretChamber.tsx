import React, { useContext, useEffect, useState } from "react";

import { GameInfoContext } from "../SeedDataOutput";
import { useSpellFavorite } from "./helpers";
import { Square } from "../../helpers";
import { Wand } from "./Wand";
import { Button, Modal } from "react-bootstrap";
import Entity from "../../Icons/Entity";

const SnowcaveSecretChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [wands, setWandData] = useState(() =>
    gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const wands = gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed);
    setWandData(wands);
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
          <Modal.Title>Snowy Depths Hourglass Chamber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {wands.map((wand, i) => {
            return (
              <Wand
                key={wand.ui.name + i}
                title={`Snowy Depths Secret Wand ${i + 1}`}
                item={wand}
                isFavorite={isFavorite}
              />
            );
          })}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SnowcaveSecretChamber;
