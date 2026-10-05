import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { createEffect, createSignal, For, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';

function Search() {
  const [query, setQuery] = createSignal('');
  const [results, setResults] = createSignal<readonly string[]>([]);
  const [status, setStatus] = createSignal<'idle' | 'searching' | 'done'>('idle');

  // Debounce, then fetch; onCleanup aborts a stale timer or request (latest wins).
  createEffect(() => {
    const q = query();
    if (q.trim() === '') {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setStatus('searching');
      searchWords(q, controller.signal).then(
        (found) => {
          setResults(found);
          setStatus('done');
        },
        () => undefined,
      );
    }, DEBOUNCE_MS);
    onCleanup(() => {
      clearTimeout(timer);
      controller.abort();
    });
  });

  return (
    <search>
      <input
        id="q"
        type="search"
        aria-label="Search fruit"
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <p id="status">
        {status() === 'searching'
          ? 'Searching…'
          : status() === 'done'
            ? `${results().length} results`
            : ''}
      </p>
      <ul id="results">
        <For each={results()}>{(r) => <li>{r}</li>}</For>
      </ul>
    </search>
  );
}

render(() => <Search />, document.getElementById('app') as HTMLElement);
