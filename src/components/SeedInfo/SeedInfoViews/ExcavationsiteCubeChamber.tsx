import React, { useContext, useEffect } from "react";
import { Wand } from "./Wand";
import { Square } from "../../helpers";
import { GameInfoContext } from "../SeedDataOutput";
import { useSpellFavorite } from "./helpers";
import { Button, Modal } from "react-bootstrap";
import Entity from "../../Icons/Entity";

const ExcavationsiteCubeChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [wand, setWand] = React.useState(() =>
    gameInfoProvider.providers.excavationSiteCubeChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const wand = gameInfoProvider.providers.excavationSiteCubeChamber.provide(gameInfoProvider.config.seed);
    setWand(wand);
  }, [gameInfoProvider]);

  const { isFavorite } = useSpellFavorite();

  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Button className="position-relative" onClick={() => setModalOpen(true)} variant="outline-info" size="sm">
        <Square>
          <Entity id="data/biome_impl/excavationsite/meditation_cube_visual.png" />
        </Square>
      </Button>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Coal Pits Meditation Cube Chamber</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wand title="Coal Pits Cube Wand" item={wand} isFavorite={isFavorite} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExcavationsiteCubeChamber;
