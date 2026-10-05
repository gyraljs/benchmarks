<script lang="ts">
  import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';

  let query = $state('');
  let results = $state<string[]>([]);
  let status = $state<'idle' | 'searching' | 'done'>('idle');

  // Debounce, then fetch; the teardown aborts a stale timer or request (latest wins).
  $effect(() => {
    const q = query;
    if (q.trim() === '') {
      results = [];
      status = 'idle';
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      status = 'searching';
      searchWords(q, controller.signal).then(
        (found) => {
          results = found;
          status = 'done';
        },
        () => undefined,
      );
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });
</script>

<search>
  <input id="q" type="search" aria-label="Search fruit" bind:value={query} />
  <p id="status">
    {status === 'searching' ? 'Searching…' : status === 'done' ? `${results.length} results` : ''}
  </p>
  <ul id="results">
    {#each results as r (r)}
      <li>{r}</li>
    {/each}
  </ul>
</search>
