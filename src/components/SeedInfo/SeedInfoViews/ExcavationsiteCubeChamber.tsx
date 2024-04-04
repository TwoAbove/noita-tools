import React, { useContext, useEffect } from "react";
import { Card, Stack } from "react-bootstrap";
import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import { SpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Spell";

import Icon from "../../Icons/Icon";
import { StaticPotion } from "./Potion";
import { Tile } from "./Map";
import { copyImage } from "../../../services/imageActions/webImageActions";
import { Wand } from "./ShopItems";
import { GameInfoContext } from "../SeedDataOutput";
import { set } from "mongoose";
import { useSpellFavorite } from "./helpers";

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

  return <Wand title="Excavation Site Cube Chamber Wand" item={wand} isFavorite={isFavorite} />;
};

export default ExcavationsiteCubeChamber;
