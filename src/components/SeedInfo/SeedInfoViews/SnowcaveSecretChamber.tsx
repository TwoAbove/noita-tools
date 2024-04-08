import React, { useContext, useEffect } from "react";

import { GameInfoContext } from "../SeedDataOutput";
import { useSpellFavorite } from "./helpers";
import { Wand } from "./Wand";

const SnowcaveSecretChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [wands, setWandData] = React.useState(() =>
    gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const wands = gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed);
    setWandData(wands);
  }, [gameInfoProvider]);

  const { isFavorite } = useSpellFavorite();

  return (
    <>
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
    </>
  );
};

export default SnowcaveSecretChamber;
