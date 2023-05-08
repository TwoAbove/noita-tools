export const capitalize = (s: string) =>
  s
    .toLowerCase()
    .split(" ")
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(" ");

export const includesAll = (set: string[], test: string[]) =>
  set.length && test.length ? test.every(v => set.includes(v)) : true;

export const includesSome = (set: string[], test: string[]) =>
  set.length && test.length ? test.some(v => set.includes(v)) : true;

export const localizeNumber = (n: number) => new Intl.NumberFormat().format(n);

export const removeFromArr = (arr: string[], thing: string) => {
  const i = arr.indexOf(thing);
  if (i !== -1) {
    arr.splice(i, 1);
  }
};

export const between = (x: number, min: number, max: number) => {
  return min <= x && x <= max;
};

export const ticksToS = (t: number) => Math.round(t * 0.01666666 * 100) / 100;

export const avg = (arr: number[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

type CommonKeys<T> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T> = Subtract<AllKeys<T>, CommonKeys<T>>;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any } ? T[K] : undefined;

export type Merge<T> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
};

type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T> ? PickType<T, K> : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Objectify<T> = { [id: string]: Merge<T[keyof T]> };

export const promiseMap = function (iterable, mapper, options = { concurrency: Infinity }) {
  let { concurrency } = options;

  let index = 0;
  const results: any[] = [];
  const pending: any[] = [];
  const iterator = iterable[Symbol.iterator]();

  while (concurrency-- > 0) {
    const thread = wrappedMapper();
    if (thread) pending.push(thread);
    else break;
  }

  return Promise.all(pending).then(() => results);

  function wrappedMapper() {
    const next = iterator.next();
    if (next.done) return null;
    const i = index++;
    const mapped = mapper(next.value, i);
    return Promise.resolve(mapped).then(resolved => {
      results[i] = resolved;
      return wrappedMapper();
    });
  }
};

export function generatePoints(x0: number, x1: number, y0: number, y1: number): number[][] {
  const coordinates: number[][] = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      coordinates.push([x, y]);
    }
  }
  return coordinates;
}

export const randomUUID = () => {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
