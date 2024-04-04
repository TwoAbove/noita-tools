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
            title={`Snowcave Secret Chamber Wand ${i + 1}`}
            item={wand}
            isFavorite={isFavorite}
          />
        );
      })}
    </>
  );
};

export default SnowcaveSecretChamber;
