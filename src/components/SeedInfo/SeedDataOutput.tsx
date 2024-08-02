import React, { createContext, useEffect, useState, useCallback } from "react";
import { Stack } from "react-bootstrap";

import type { GameInfoProvider } from "../../services/SeedInfo/infoHandler";
import SeedInfo from "./SeedInfo";

import i18n from "../../i18n";
import { db } from "../../services/db";
import useLocalStorage from "../../services/useLocalStorage";
import { NOITA_SPELL_COUNT } from "../../static";

interface ISeedDataProps {
  isDaily?: boolean;
  seed: string;
}

interface GameInfoContextType {
  gameInfoProvider: GameInfoProvider;
  data: Awaited<ReturnType<GameInfoProvider["provideAll"]>>;
}

const waitToLoad = async (gameInfoProvider?: GameInfoProvider): Promise<void> => {
  if (gameInfoProvider) {
    await gameInfoProvider.ready();
  }
};

const importGameInfoProvider = async (branch: string) => {
  // TODO: handle beta branch
  return (await import("../../services/SeedInfo/infoHandler/index.ts")).default;
};

export const createGameInfoProvider = async (
  branch: string,
  seed: string,
  unlockedSpells: boolean[],
  setData: (data: Awaited<ReturnType<GameInfoProvider["provideAll"]>>) => void,
): Promise<GameInfoProvider> => {
  const GameInfoProvider = await importGameInfoProvider(branch);
  const gameInfoProvider = new GameInfoProvider({ seed: parseInt(seed, 10) }, unlockedSpells, i18n);

  const handleProvideAll = async () => {
    try {
      const data = await gameInfoProvider.provideAll();
      setData(data);
    } catch (error) {
      console.error("Error providing data:", error);
    }
  };

  gameInfoProvider.onRandomLoad(() => {
    gameInfoProvider.randoms.SetWorldSeed(parseInt(seed, 10));
    gameInfoProvider.randoms.SetUnlockedSpells(unlockedSpells);
    handleProvideAll();

    gameInfoProvider.addEventListener("update", async () => {
      const config = gameInfoProvider.config;
      await db.setSeedInfo("" + config.seed, config);
      await handleProvideAll();
    });

    gameInfoProvider.addEventListener("reset", handleProvideAll);
  });

  return gameInfoProvider;
};

export const GameInfoContext = createContext<GameInfoContextType>(null!);

export const useGameInfoProvider = (
  seed: string,
): [GameInfoProvider | undefined, Awaited<ReturnType<GameInfoProvider["provideAll"]>> | undefined] => {
  const [data, setData] = useState<Awaited<ReturnType<GameInfoProvider["provideAll"]>>>();
  const [unlockedSpells] = useLocalStorage<boolean[]>("unlocked-spells", Array(NOITA_SPELL_COUNT).fill(true));
  const [branch] = useLocalStorage<string>("noita-branch", "main");
  const [gameInfoProvider, setGameInfoProvider] = useState<GameInfoProvider>();

  const initializeGameInfoProvider = useCallback(async () => {
    setData(undefined);
    setGameInfoProvider(undefined);
    const config = await db.getSeedInfo(seed);
    const newGameInfoProvider = await createGameInfoProvider(branch, seed, unlockedSpells, setData);

    await waitToLoad(newGameInfoProvider);

    newGameInfoProvider.resetConfig({
      ...config?.config,
      seed: parseInt(seed, 10),
    });
    setGameInfoProvider(newGameInfoProvider);
  }, [seed, unlockedSpells, branch]);

  useEffect(() => {
    initializeGameInfoProvider();
  }, [initializeGameInfoProvider]);

  return [gameInfoProvider, data];
};

const SeedDataOutput: React.FC<ISeedDataProps> = ({ seed, isDaily = false }) => {
  const [gameInfoProvider, data] = useGameInfoProvider(seed);

  if (!gameInfoProvider || !data) {
    return <p>Loading</p>;
  }

  return (
    <GameInfoContext.Provider value={{ gameInfoProvider, data }}>
      <Stack className="seed-info">
        <p className="my-2">
          Seed: {seed} {isDaily && ` (Daily)`}
        </p>
        <SeedInfo isDaily={isDaily} seed={seed} infoProvider={gameInfoProvider} data={data} />
      </Stack>
    </GameInfoContext.Provider>
  );
};

export default SeedDataOutput;
