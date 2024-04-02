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

interface IExcavationsiteCubeChamberProps {
  mapData: ReturnType<GameInfoProvider["providers"]["map"]["provide"]>;
}

const getWandArgs = (wand: string): [number, number, boolean] => {
  switch (wand) {
    case "data/entities/items/wand_level_03.xml":
      return [60, 3, false];
    case "data/entities/items/wand_unshuffle_02.xml":
      return [40, 2, true];
  }
  return [0, 0, false];
};

const ExcavationsiteCubeChamber = () => {
  const { gameInfoProvider } = useContext(GameInfoContext);

  const [mapData, setMapData] = React.useState<ReturnType<GameInfoProvider["providers"]["map"]["provide"]>>(() =>
    gameInfoProvider.providers.excavationSiteCubeChamber.provide(gameInfoProvider.config.seed),
  );

  useEffect(() => {
    const mapData = gameInfoProvider.providers.excavationSiteCubeChamber.provide(gameInfoProvider.config.seed);
    setMapData(mapData);
  }, [gameInfoProvider]);

  const wandPoint = mapData.interestPoints.points!.find(p => p.item.startsWith("data/entities/items/wand_"))!;

  const wand = gameInfoProvider!.providers.wand.provide(
    wandPoint.gx,
    wandPoint.gy,
    ...getWandArgs(wandPoint.item),
    false,
  );

  const { isFavorite } = useSpellFavorite();

  return <Wand title="Excavation Site Cube Chamber Wand" item={wand} isFavorite={isFavorite} />;
};

export default ExcavationsiteCubeChamber;
