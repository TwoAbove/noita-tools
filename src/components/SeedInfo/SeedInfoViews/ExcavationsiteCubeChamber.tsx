import React, { useContext, useEffect } from "react";
import { Wand } from "./Wand";
import { GameInfoContext } from "../SeedDataOutput";
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

  return <Wand title="Coal Pits Cube Wand" item={wand} isFavorite={isFavorite} />;
};

export default ExcavationsiteCubeChamber;
