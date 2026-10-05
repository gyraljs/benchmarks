import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

type Status = 'idle' | 'searching' | 'done';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<readonly string[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  // Debounce, then fetch; the cleanup aborts a stale timer or request (latest wins).
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setStatus('idle');
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setStatus('searching');
      searchWords(query, controller.signal).then(
        (found) => {
          setResults(found);
          setStatus('done');
        },
        () => undefined,
      );
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <search>
      <input
        id="q"
        type="search"
        aria-label="Search fruit"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <p id="status">
        {status === 'searching'
          ? 'Searching…'
          : status === 'done'
            ? `${results.length} results`
            : ''}
      </p>
      <ul id="results">
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </search>
  );
}

render(<Search />, document.getElementById('app') as HTMLElement);
