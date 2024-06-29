/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from "react";

import Alchemy from "./SeedInfoViews/Alchemy";

import GameInfoProvider from "../../services/SeedInfo/infoHandler";

// import Map from './SeedInfoViews/Map';
import Weather from "./SeedInfoViews/Weather";
import Start from "./SeedInfoViews/Start";
import Biome from "./SeedInfoViews/Biome";
import Watercave from "./SeedInfoViews/Watercave";
import FungalShifts from "./SeedInfoViews/FungalShifts";
import HolyMountain from "./SeedInfoViews/HolyMountain";

import { db } from "../../services/db";
import { useLiveQuery } from "dexie-react-hooks";
import MapComponent from "./SeedInfoViews/Map";
import ExcavationsiteCubeChamber from "./SeedInfoViews/ExcavationsiteCubeChamber";
import SnowcaveSecretChamber from "./SeedInfoViews/SnowcaveSecretChamber";
import SnowcastleSecretChamber from "./SeedInfoViews/SnowcastleSecretChamber";

const WithShow = (props: { id: string; children: React.ReactNode }): JSX.Element => {
  const config = useLiveQuery(() => db.configItems.get({ key: `panel-${props.id}-config` }));
  const hasConfig = !!config;

  if (hasConfig && !config.val) {
    return <div></div>;
  }

  return <div>{props.children}</div>;
};

interface ISeedInfoProps {
  seed: string;
  data: Awaited<ReturnType<GameInfoProvider["provideAll"]>>;
  infoProvider: GameInfoProvider; // This should be a context in the future
  isDaily: boolean;
}

const SeedInfo = (props: ISeedInfoProps) => {
  const { data, infoProvider, seed, isDaily } = props;
  const searchParams = new URLSearchParams(document.location.search);
  const showMap = !!searchParams.get("map");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        flexDirection: "row",

        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          gap: "1rem",
          flexGrow: 1,
          width: "min-content",
        }}
      >
        <WithShow id="holy-mountain">
          <HolyMountain infoProvider={infoProvider} shop={data.shop} perks={data.perks} perkDeck={data.perkDeck} />
        </WithShow>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-around",
          }}
        >
          {!isDaily && (
            <WithShow id="start">
              <Start
                startingFlask={data.startingFlask}
                startingSpell={data.startingSpell}
                startingBombSpell={data.startingBombSpell}
              />
            </WithShow>
          )}
          <WithShow id="weather">
            <Weather infoProvider={infoProvider} weather={data.weather} />
          </WithShow>
          <WithShow id="watercave">
            <Watercave infoProvider={infoProvider} waterCave={data.waterCave} />
          </WithShow>
          <WithShow id="alchemy">
            <Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
          </WithShow>
          <WithShow id="biome">
            <Biome infoProvider={infoProvider} biomeData={data.biomeModifiers} />
          </WithShow>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <WithShow id="secret-wands">
              <ExcavationsiteCubeChamber />
              <SnowcaveSecretChamber />
              {/* <SnowcastleSecretChamber /> not ready yet */}
            </WithShow>
          </div>
        </div>
      </div>

      <WithShow id="fungal">
        <FungalShifts infoProvider={infoProvider} fungalData={data.fungalShifts} />
      </WithShow>

      {showMap && (
        <WithShow id="map">
          <MapComponent infoProvider={infoProvider} worldOffset={0} mapPart="MainPath" />
        </WithShow>
      )}
    </div>
  );
};

export default SeedInfo;
