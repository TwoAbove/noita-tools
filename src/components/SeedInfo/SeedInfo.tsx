import React from "react";

import Alchemy from "./SeedInfoViews/Alchemy";
import GameInfoProvider from "../../services/SeedInfo/infoHandler";

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
// import SnowcastleSecretChamber from "./SeedInfoViews/SnowcastleSecretChamber";

interface WithShowProps {
  id: string;
  children: React.ReactNode;
}

const WithShow: React.FC<WithShowProps> = ({ id, children }) => {
  const config = useLiveQuery(() => db.configItems.get({ key: `panel-${id}-config` }));
  const hasConfig = !!config;

  if (hasConfig && !config.val) {
    return <div />;
  }

  return <div>{children}</div>;
};

interface SeedInfoProps {
  data: any; // Ideally we should export the return type of provideAll from GameInfoProvider
  infoProvider: GameInfoProvider;
  seed?: string | number;
  isDaily?: boolean;
}

const SeedInfo: React.FC<SeedInfoProps> = ({ data, infoProvider, isDaily }) => {
  const searchParams = new URLSearchParams(document.location.search);
  const showMap = !!searchParams.get("map");

  return (
    <div className="flex flex-row flex-wrap justify-between gap-4">
      <div className="flex flex-grow w-min flex-col flex-wrap gap-4">
        <WithShow id="holy-mountain">
          <HolyMountain
            infoProvider={infoProvider}
            shop={data.shop}
            perks={data.perks}
            perkDeck={data.perkDeck}
          />
        </WithShow>
        <div className="flex flex-wrap justify-around gap-4">
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
          <div className="flex justify-center gap-4">
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
