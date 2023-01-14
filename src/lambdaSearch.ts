import { loadRandom, getUnlockedSpells } from './testHelpers';
import GameInfoProvider from './services/SeedInfo/infoHandler';

import { SeedSearcher } from './services/seedSearcher'
import { ILogicRules } from './services/SeedInfo/infoHandler/IRule';
import { IRandom } from './services/SeedInfo/random';

let randoms: IRandom;
let gameInfoProvider: GameInfoProvider;
const readyPromise = loadRandom().then(r => {
  randoms = r;
}).then(() => {
  gameInfoProvider = new GameInfoProvider(
    { seed: 1 },
    getUnlockedSpells(),
    undefined,
    randoms,
    false
  );
  return gameInfoProvider.ready();
});

const searchRange = async (from: number, to: number, rules: ILogicRules): Promise<{ res: number[], info: any }> => {
  if (to < from) {
    return searchRange(to, from, rules);
  }

  await readyPromise;

  const startupStart = performance.now();

  const seedSearcher = new SeedSearcher(gameInfoProvider);

  await seedSearcher.update({
    findAll: true,
    seedEnd: to,
    currentSeed: from,
    rules
  });

  const startupEnd = performance.now();

  const res: number[] = [];
  let info;
  seedSearcher.onFound(info => {
    res.push(info.foundSeed!);
  });
  seedSearcher.onInfo(_info => {
    info = _info;
  });

  seedSearcher.findSync(from, to);

  return { res, info: { ...info, startupTime: startupEnd - startupStart } };
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
