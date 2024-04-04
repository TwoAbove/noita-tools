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

const getWandArgs = (wand: string): [number, number, boolean] => {
  switch (wand) {
    case "data/entities/items/wand_level_03.xml":
      return [60, 3, false];
    case "data/entities/items/wand_unshuffle_02.xml":
      return [40, 2, true];
  }
  return [0, 0, false];
};

const SnowcaveSecretChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [mapData, setMapData] = React.useState<ReturnType<GameInfoProvider["providers"]["map"]["provide"]>>(() =>
    gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const mapData = gameInfoProvider.providers.snowcaveSecretChamber.provide(gameInfoProvider.config.seed);
    setMapData(mapData);
  }, [gameInfoProvider]);

  const wandPoints = mapData.interestPoints.points!.filter(p => p.item.startsWith("data/entities/items/wand_"))!;

  if (!wandPoints.length) {
    return <div>Wand not found</div>;
  }

  const wands = wandPoints.map(wandPoint => {
    const wand = gameInfoProvider!.providers.wand.provide(
      wandPoint.gx,
      wandPoint.gy,
      ...getWandArgs(wandPoint.item),
      false,
    );

    return wand;
  });

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

  return <Wand title="Excavation Site Cube Chamber Wand" item={wand} isFavorite={isFavorite} />;
};

export default SnowcaveSecretChamber;
