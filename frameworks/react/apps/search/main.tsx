import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type Status = { readonly tag: 'idle' } | { readonly tag: 'searching' } | { readonly tag: 'done' };

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<readonly string[]>([]);
  const [status, setStatus] = useState<Status>({ tag: 'idle' });

  // Debounce, then fetch; the cleanup aborts a stale timer or request (latest wins).
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setStatus({ tag: 'idle' });
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setStatus({ tag: 'searching' });
      searchWords(query, controller.signal).then(
        (found) => {
          setResults(found);
          setStatus({ tag: 'done' });
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
        onChange={(e) => setQuery(e.target.value)}
      />
      <p id="status">
        {status.tag === 'searching'
          ? 'Searching…'
          : status.tag === 'done'
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

createRoot(document.getElementById('app') as HTMLElement).render(<Search />);
