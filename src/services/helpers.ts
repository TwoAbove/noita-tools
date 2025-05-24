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

export const simd = async () =>
  WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
    ]),
  );

export const isNode = typeof process === "object" && typeof require === "function";

const wikiLinkMap: { [spellId: string]: string } = {
  "KANTELE_A": "Note_spells",
  "KANTELE_D": "Note_spells",
  "KANTELE_DIS": "Note_spells",
  "KANTELE_E": "Note_spells",
  "KANTELE_G": "Note_spells",
  "OCARINA_B": "Note_spells",
  "OCARINA_C": "Note_spells",
  "OCARINA_D": "Note_spells",
  "OCARINA_E": "Note_spells",
  "OCARINA_F": "Note_spells",
  "OCARINA_GSHARP": "Note_spells",
  "OCARINA_A2": "Note_spells",
  "X_RAY": "All-Seeing_Eye",
  "LONG_DISTANCE_CAST": "Long-Distance_Cast",
  "HITFX_CRITICAL_WATER": "Critical_on_Wet_(Water)_Enemies",
  "PINGPONG_PATH": "Ping-Pong_Path",
  "FIREBALL_RAY_LINE": "Two-Way_Fireball_Thrower",
  "CHAOS_POLYMORPH_FIELD": "Circle_of_Unstable_Metamorphosis",
  "LEVITATION_FIELD": "Circle_of_Buoyancy",
  "TELEPORTATION_FIELD": "Circle_of_Displacement",
  "BERSERK_FIELD": "Circle_of_Fervour",
  "SHIELD_FIELD": "Circle_of_Shielding",
  "FREEZE_FIELD": "Circle_of_Stillness",
  "POLYMORPH_FIELD": "Circle_of_Transmogrification",
  "ELECTROCUTION_FIELD": "Circle_of_Thunder",
  "ALCOHOL_BLAST": "Explosion_of_Spirits",
  "POISON_BLAST": "Explosion_of_Poison",
  "THUNDER_BLAST": "Explosion_of_Thunder",
  "FUNKY_SPELL": "%3F%3F%3F_(Spell)"
};

export function getWikiUrl(name: string) {
  if (wikiLinkMap[name]) {
    return `https://noita.wiki.gg/wiki/${wikiLinkMap[name]}`;
  }
  return `https://noita.wiki.gg/wiki/${name
    .replace(/(^|\s)\S/g, l => l.toUpperCase())
    .replace("(One-off)", "(Perk)")
    .replace(/\s*\(Perk\)$/, "") // Remove "(Perk)" suffix if it exists
    .replace(/\s+/g, "_")}`; // More reliable space replacement
}
