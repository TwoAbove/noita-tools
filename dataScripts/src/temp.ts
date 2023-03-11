import util from 'util';
import data from './temp.json';

function intersection(lists: any[]) {
  var result: any[] = [];

  for (var i = 0; i < lists.length; i++) {
    var currentList = lists[i];
    for (var y = 0; y < currentList.length; y++) {
      var currentValue = currentList[y];
      if (result.indexOf(currentValue) === -1) {
        var existsInAll = true;
        for (var x = 0; x < lists.length; x++) {
          if (lists[x].indexOf(currentValue) === -1) {
            existsInAll = false;
            break;
          }
        }
        if (existsInAll) {
          result.push(currentValue);
        }
      }
    }
  }
  return result;
}

const getAllSubsets =
  theArray => theArray.reduce(
    (subsets, value) => subsets.concat(
      subsets.map(set => [value, ...set])
    ),
    [[]]
  );

for (const subset of getAllSubsets(Object.keys(data))) {
  if (!subset.length) {
    continue;
  }
  const ints = intersection(subset.map(s => data[s])).sort((a, b) => a - b);
  console.log(util.inspect(subset, undefined, 4, true), ints.length);
  console.log(util.inspect(ints, undefined, 4, true));
}
