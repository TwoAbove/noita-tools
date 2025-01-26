import React from "react";
import { Card, Stack } from "react-bootstrap";
import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import { SpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Spell";
import { StartingBombSpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/StartingBomb";
import { StartingFlaskInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/StartingFlask";
import { StartingSpellInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/StartingSpell";

import Entity from "../../Icons/Entity";
import { StaticPotion } from "./Potion";

interface IStartProps {
  startingFlask: ReturnType<StartingFlaskInfoProvider["provide"]>;
  startingSpell: ReturnType<StartingSpellInfoProvider["provide"]>;
  startingBombSpell: ReturnType<StartingBombSpellInfoProvider["provide"]>;
}

const spells = new SpellInfoProvider({} as any);

const Start = (props: IStartProps) => {
  const { startingFlask, startingSpell, startingBombSpell } = props;
  const startingSpellSpell = spells.provide(startingSpell.toUpperCase());
  const startingBombSpellSpell = spells.provide(startingBombSpell.toUpperCase());

  return (
    <Card
      className="border"
      style={{
        borderRadius: "0.75rem",
        borderWidth: "0.125rem",
      }}
    >
      <Card.Title className="mb-1 text-center m-0">Starting setup</Card.Title>
      <Card.Body className="d-flex justify-content-evenly p-0 mx-1 mb-1">
        <Stack className="justify-content-center" direction="horizontal" gap={3}>
          <Entity
            id="Spell"
            entityParams={{
              extra: startingSpell.toUpperCase(),
            }}
          />
          <Entity
            id="Spell"
            entityParams={{
              extra: startingBombSpell.toUpperCase(),
            }}
          />
          <StaticPotion material={startingFlask} />
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default Start;
