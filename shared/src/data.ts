// Row data for the keyed table app, as in js-framework-benchmark: random labels built from
// three word lists and a global id counter. The generator is seeded (mulberry32) so every
// framework builds the same rows in the same order; its cost is identical for all of them.

export interface Row {
  readonly id: number;
  readonly label: string;
}

const ADJECTIVES = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
];
const COLOURS = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
];
const NOUNS = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
];

let seed = 0x9e3779b9;
let nextId = 1;

/** mulberry32: small, fast, deterministic. */
function random(max: number): number {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (((t ^ (t >>> 14)) >>> 0) % max) | 0;
}

const pick = (words: readonly string[]): string => words[random(words.length)] ?? '';

/** `count` new rows with fresh ids. */
export function buildData(count: number): Row[] {
  const rows = new Array<Row>(count);
  for (let i = 0; i < count; i++) {
    rows[i] = { id: nextId++, label: `${pick(ADJECTIVES)} ${pick(COLOURS)} ${pick(NOUNS)}` };
  }
  return rows;
}

/** The suffix the "update every 10th row" operation appends. */
export const UPDATE_SUFFIX = ' !!!';
