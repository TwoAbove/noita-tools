/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";

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

const WithShow = (props: { id: string; children: React.ReactNode }): JSX.Element => {
  const config = useLiveQuery(() => db.configItems.get({ key: `panel-${props.id}-config` }));
  const hasConfig = !!config;

  if (hasConfig && !config.val) {
    return <div></div>;
  }

  return props.children as any;
};

// Function to add <Col> to all children. Some children return <><> which have several elements
const WithCols = (props: { children: React.ReactNode }): JSX.Element => {
  return (
    <>
      {React.Children.map(props.children, child => {
        return <Col>{child}</Col>;
      })}
    </>
  );
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
    <Row className="m-0">
      <Col className="px-2" lg={8} md={12}>
        {/* <Row xs="auto">
						<Map seed={seed} infoProvider={infoProvider} />
				</Row> */}
        <Row xs="auto" className="gap-2 justify-content-center">
          <Col className="col-12">
            <WithShow id="holy-mountain">
              <HolyMountain infoProvider={infoProvider} shop={data.shop} perks={data.perks} perkDeck={data.perkDeck} />
            </WithShow>
          </Col>
          <Row xs="auto" className="gap-2 justify-content-center flex-wrap">
            <Col className="p-0 m-2">
              {!isDaily && (
                <WithShow id="start">
                  <Start
                    startingFlask={data.startingFlask}
                    startingSpell={data.startingSpell}
                    startingBombSpell={data.startingBombSpell}
                  />
                </WithShow>
              )}
            </Col>
            <Col className="p-0 m-2">
              <WithShow id="weather">
                <Weather infoProvider={infoProvider} weather={data.weather} />
              </WithShow>
            </Col>
            <Col className="p-0 m-2">
              <WithShow id="watercave">
                <Watercave infoProvider={infoProvider} waterCave={data.waterCave} />
              </WithShow>
            </Col>
            <Col className="p-0 m-2">
              <WithShow id="alchemy">
                <Alchemy infoProvider={infoProvider} alchemy={data.alchemy} />
              </WithShow>
            </Col>
            <Col className="p-0 m-2">
              <WithShow id="biome">
                <Biome infoProvider={infoProvider} biomeData={data.biomeModifiers} />
              </WithShow>
            </Col>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <WithShow id="secret-wands">
                <ExcavationsiteCubeChamber />
                <SnowcaveSecretChamber />
              </WithShow>
            </div>
          </Row>
        </Row>
      </Col>
      <Col className="px-2" lg={4}>
        <WithShow id="fungal">
          <FungalShifts infoProvider={infoProvider} fungalData={data.fungalShifts} />
        </WithShow>
      </Col>
      {showMap && (
        <WithShow id="map">
          <MapComponent infoProvider={infoProvider} worldOffset={0} mapPart="MainPath" />
        </WithShow>
      )}
    </Row>
  );
};

export default SeedInfo;
