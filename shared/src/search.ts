// A fake search API for the http-search app. Latency depends on the query length so that an
// earlier, shorter query answers AFTER a later, longer one: an implementation that doesn't
// keep only the latest request shows stale results, and the correctness test catches it.

export const DEBOUNCE_MS = 150;

const WORDS = [
  'apple',
  'apricot',
  'avocado',
  'banana',
  'bilberry',
  'blackberry',
  'blackcurrant',
  'blueberry',
  'boysenberry',
  'cantaloupe',
  'cherry',
  'cherimoya',
  'clementine',
  'cloudberry',
  'coconut',
  'cranberry',
  'currant',
  'damson',
  'date',
  'dragonfruit',
  'durian',
  'elderberry',
  'feijoa',
  'fig',
  'gooseberry',
  'grape',
  'grapefruit',
  'guava',
  'honeydew',
  'huckleberry',
  'jackfruit',
  'jambul',
  'jujube',
  'kiwi',
  'kumquat',
  'lemon',
  'lime',
  'loquat',
  'longan',
  'lychee',
  'mandarin',
  'mango',
  'mangosteen',
  'marionberry',
  'melon',
  'mulberry',
  'nectarine',
  'olive',
  'orange',
  'papaya',
  'passionfruit',
  'peach',
  'pear',
  'persimmon',
  'pineapple',
  'pitaya',
  'plantain',
  'plum',
  'pomegranate',
  'pomelo',
  'quince',
  'raisin',
  'rambutan',
  'raspberry',
  'redcurrant',
  'salak',
  'satsuma',
  'soursop',
  'starfruit',
  'strawberry',
  'tamarillo',
  'tamarind',
  'tangerine',
  'watermelon',
  'yuzu',
  'applesauce',
  'apple pie',
  'apple cider',
  'appleberry',
  'pineapple juice',
];

/** Shorter queries are slower: 1 char → 300 ms, 2 → 200 ms, 3+ → 100 ms. */
export function latencyFor(query: string): number {
  return 100 + 100 * Math.max(0, 3 - Math.min(query.length, 3));
}

/** Up to 20 words containing `query` (case-insensitive). */
export function matches(query: string): string[] {
  const q = query.trim().toLowerCase();
  return q === '' ? [] : WORDS.filter((w) => w.includes(q)).slice(0, 20);
}

/** Resolves with the matches after `latencyFor(query)`; rejects with AbortError on abort. */
export function searchWords(query: string, signal?: AbortSignal): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const abort = (): void => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve(matches(query));
    }, latencyFor(query));
    if (signal?.aborted === true) abort();
    else signal?.addEventListener('abort', abort, { once: true });
  });
}
