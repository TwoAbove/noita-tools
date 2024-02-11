export const GameGetDateAndTimeLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  let Jussi = false; // Midsummer Day;
  if (month === 6) {
    const day = now.getDay();
    if (date >= 20 && date <= 26 && day === 6) {
      Jussi = true;
    }
  }
  return [year, month, date, h, m, s, Number(Jussi)];
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
