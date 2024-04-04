const isEaster = (now: Date) => {
  // https://www.irt.org/articles/js052/index.htm
  let Y = now.getFullYear();
  let C = Math.floor(Y / 100);
  let N = Y - 19 * Math.floor(Y / 19);
  let K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  let L = I - J;
  let M = 3 + Math.floor((L + 40) / 44);
  let D = L + 28 - 31 * Math.floor(M / 4);

  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  return currentMonth === M && currentDay === D;
};

// Midsummer Day;
const isJussi = (now: Date) => {
  const day = now.getDay();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  if (month === 6) {
    if (date >= 20 && date <= 26 && day === 6) {
      return true;
    }
  }
  return false;
};

export const GameGetDateAndTimeLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const Jussi = isJussi(now);
  const Easter = isEaster(now);

  return [year, month, date, h, m, s, Number(Jussi), Number(Easter)];
};

export const isChristmas = () => {
  const [year, month, day] = GameGetDateAndTimeLocal();

  if (month === 12 && day >= 24 && day <= 26) {
    return true;
  } else {
    return false;
  }
};

export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = args.join(",");
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
