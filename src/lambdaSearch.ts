import { loadRandom, getUnlockedSpells } from './testHelpers';
import GameInfoProvider from './services/SeedInfo/infoHandler';

import { SeedSearcher } from './services/seedSearcher'
import { ILogicRules } from './services/SeedInfo/infoHandler/IRule';

const searchRange = async (from: number, to: number, rules: ILogicRules): Promise<number[]> => {
  if (to < from) {
    return searchRange(to, from, rules);
  }

  const randoms = await loadRandom();

  const gameInfoProvider = new GameInfoProvider(
    { seed: 1 },
    getUnlockedSpells(),
    undefined,
    randoms,
    false
  );

  await gameInfoProvider.ready();

  const seedSearcher = new SeedSearcher(gameInfoProvider);

  await seedSearcher.update({
    findAll: true,
    seedEnd: to,
    currentSeed: from,
    rules
  });

  const res: number[] = [];

  seedSearcher.onFound(info => {
    res.push(info.foundSeed!);
  });

  await seedSearcher.start();
  return res;

}

export const handler = async (event) => {
  const { rules, from, to } = event.body;

  const res = await searchRange(from, to, rules);

  const response = {
    statusCode: 200,
    body: JSON.stringify(res),
  };
  return response;
};
