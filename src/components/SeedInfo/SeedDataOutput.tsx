import React, { createContext, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";

import GameInfoProvider from "../../services/SeedInfo/infoHandler";
import SeedInfo from "./SeedInfo";

import i18n from "../../i18n";
import { db } from "../../services/db";
import useLocalStorage from "../../services/useLocalStorage";

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

export const createGameInfoProvider = (seed: string, unlockedSpells: boolean[], setData) => {
  const gameInfoProvider = new GameInfoProvider({ seed: parseInt(seed, 10) }, unlockedSpells, i18n);
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
  unlockedSpells: boolean[],
): [GameInfoProvider?, Awaited<ReturnType<GameInfoProvider["provideAll"]>>?] => {
  const [data, setData] = useState<Awaited<ReturnType<GameInfoProvider["provideAll"]>>>();

  const [gameInfoProvider, setGameInfoProvider] = useState<GameInfoProvider | undefined>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setData(undefined);
      setGameInfoProvider(undefined);
      const config = await db.getSeedInfo(seed);
      const newGameInfoProvider = createGameInfoProvider(seed, unlockedSpells, setData);
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
  const [unlockedSpells] = useLocalStorage<boolean[]>("unlocked-spells", Array(413).fill(true));
  const [gameInfoProvider, data] = useGameInfoProvider(seed, unlockedSpells);
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
