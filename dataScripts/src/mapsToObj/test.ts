import maps from './maps.json';

const S = new Set<number>();

for (let k of Object.keys(maps)) {
  const map = maps[k];
  if (map.config && map.config.spawnFunctions) {
    for (let kk of Object.keys(map.config.spawnFunctions)) {
      S.add(parseInt(kk, 16));
    }
  }
}

console.log(S);
