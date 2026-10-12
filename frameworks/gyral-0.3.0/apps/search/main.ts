import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { command, defineDriver, define, each, html, type Command } from '@gyral/core';
import { debounce } from '@gyral/time';

/** The fake search API as a driver; its lane switches, so a newer query aborts the old one. */
const searchDriver = defineDriver<string, readonly string[]>({
  name: 'search',
  run: (query, { signal }) => searchWords(query, signal),
  concurrency: 'switch',
});

type Status = 'idle' | 'searching' | 'done';

interface State {
  readonly query: string;
  readonly results: readonly string[];
  readonly status: Status;
}
type Msg =
  | { readonly _tag: 'Typed'; readonly query: string }
  | { readonly _tag: 'Search'; readonly query: string }
  | { readonly _tag: 'Found'; readonly query: string; readonly results: readonly string[] };

const search = (query: string): Command<Msg> =>
  command(searchDriver, query, {
    onSuccess: (results) => ({ _tag: 'Found', query, results }),
  });

const Search = define<State, Msg>('bench-search', {
  init: () => ({ query: '', results: [], status: 'idle' }),
  intent: {
    Typed: ({ value }) => ({ _tag: 'Typed', query: value ?? '' }),
  },
  update: {
    // Each keystroke restarts the debounce timer (a `switch` lane in @gyral/time).
    Typed: (s, m) => [
      { ...s, query: m.query },
      [debounce<Msg>(DEBOUNCE_MS, { _tag: 'Search', query: m.query })],
    ],
    Search: (s, m) =>
      m.query.trim() === ''
        ? { ...s, results: [], status: 'idle' }
        : [{ ...s, status: 'searching' }, [search(m.query)]],
    // Only the answer for the current query counts.
    Found: (s, m) => (m.query === s.query ? { ...s, results: m.results, status: 'done' } : s),
  },
  view: (s, i) => html`
    <search>
      <input id="q" type="search" aria-label="Search fruit" data-intent=${i.Typed} />
      <p id="status">
        ${
          s.status === 'searching'
            ? 'Searching…'
            : s.status === 'done'
              ? `${s.results.length} results`
              : ''
        }
      </p>
      <ul id="results">
        ${each(
          s.results,
          (r) => r,
          (r) => html`<li>${r}</li>`,
        )}
      </ul>
    </search>
  `,
});
document.getElementById('app')?.append(new Search());
