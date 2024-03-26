import React, { createContext, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";

import type { GameInfoProvider } from "../../services/SeedInfo/infoHandler";
import SeedInfo from "./SeedInfo";

import i18n from "../../i18n";
import { db } from "../../services/db";
import useLocalStorage from "../../services/useLocalStorage";
import { NOITA_SPELL_COUNT } from "../../static.ts";

interface ISeedDataProps {
  isDaily?: boolean;
  seed: string;
}

const waitToLoad = (gameInfoProvider?: GameInfoProvider): Promise<void> =>
  new Promise(async res => {
    if (!gameInfoProvider) {
      return res();
    }
    await gameInfoProvider.ready();
    return res();
  });

const importMain = async () => {
  const GameInfoProvider = (await import("../../services/SeedInfo/infoHandler/index.ts")).default;
  return GameInfoProvider;
};

// Maybe something like this in the future?
// const importBeta = async () => {
//   const GameInfoProvider = (await import("../../services/SeedInfo/infoHandlerBeta/index.ts")).default;
//   return GameInfoProvider;
// };

export const createGameInfoProvider = async (branch, seed: string, unlockedSpells: boolean[], setData) => {
  const GameInfoProvider = await importMain(); // TODO: handle beta
  const gameInfoProvider = new GameInfoProvider({ seed: parseInt(seed, 10) }, unlockedSpells, i18n);
  console.log(unlockedSpells);
  gameInfoProvider
    .onRandomLoad(() => {
      gameInfoProvider.randoms.SetWorldSeed(parseInt(seed, 10));
      gameInfoProvider.randoms.SetUnlockedSpells(unlockedSpells);
      gameInfoProvider
        .provideAll()
        .then(data => {
          setData(data);
        })
        .catch(() => {
          // handle this?
        });
      gameInfoProvider.addEventListener("update", async event => {
        // Save config for resetting
        const config = gameInfoProvider.config;
        await db.setSeedInfo("" + config.seed, config);
        await gameInfoProvider.provideAll().then(data => {
          setData(data);
        });
      });
      gameInfoProvider.addEventListener("reset", event => {
        gameInfoProvider
          .provideAll()
          .then(data => {
            setData(data);
          })
          .catch(e => {
            console.error(e);
          });
      });
    })
    .catch(e => {
      console.error(e);
    });
  return gameInfoProvider;
};

export const GameInfoContext = createContext<{
  gameInfoProvider?: GameInfoProvider;
  data?: Awaited<ReturnType<GameInfoProvider["provideAll"]>>;
}>({});

export const useGameInfoProvider = (
  seed: string,
): [GameInfoProvider?, Awaited<ReturnType<GameInfoProvider["provideAll"]>>?] => {
  const [data, setData] = useState<Awaited<ReturnType<GameInfoProvider["provideAll"]>>>();
  const [unlockedSpells] = useLocalStorage<boolean[]>("unlocked-spells", Array(NOITA_SPELL_COUNT).fill(true));
  const [branch] = useLocalStorage<string>("noita-branch", "main");

  const [gameInfoProvider, setGameInfoProvider] = useState<GameInfoProvider | undefined>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setData(undefined);
      setGameInfoProvider(undefined);
      const config = await db.getSeedInfo(seed);
      console.log(branch, seed, unlockedSpells);
      const newGameInfoProvider = await createGameInfoProvider(branch, seed, unlockedSpells, setData);
      waitToLoad(newGameInfoProvider)
        .then(() => {
          newGameInfoProvider.resetConfig({
            ...config?.config,
            seed: parseInt(seed, 10),
          });
          setGameInfoProvider(newGameInfoProvider);
        })
        .catch(() => {
          // handle this?
        });
    })();
  }, [seed, unlockedSpells]);

  return [gameInfoProvider, data];
};

const SeedDataOutput = (props: ISeedDataProps) => {
  const { seed, isDaily } = props;
  console.log(seed, isDaily);
  const [gameInfoProvider, data] = useGameInfoProvider(seed);
  return (
    <>
      {gameInfoProvider && data ? (
        <GameInfoContext.Provider value={{ gameInfoProvider, data }}>
          <Stack className="seed-info">
            {data && (
              <p className="my-2">
                Seed: {seed} {isDaily && ` (Daily)`}
              </p>
            )}
            {data && <SeedInfo isDaily={isDaily || false} seed={seed} infoProvider={gameInfoProvider} data={data} />}
          </Stack>
        </GameInfoContext.Provider>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default SeedDataOutput;
