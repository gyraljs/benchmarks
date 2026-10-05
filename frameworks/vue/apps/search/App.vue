<script setup lang="ts">
import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { ref, watch } from 'vue';

const query = ref('');
const results = ref<string[]>([]);
const status = ref<'idle' | 'searching' | 'done'>('idle');

// Debounce, then fetch; onCleanup aborts a stale timer or request (latest wins).
watch(query, (q, _old, onCleanup) => {
  if (q.trim() === '') {
    results.value = [];
    status.value = 'idle';
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => {
    status.value = 'searching';
    searchWords(q, controller.signal).then(
      (found) => {
        results.value = found;
        status.value = 'done';
      },
      () => undefined,
    );
  }, DEBOUNCE_MS);
  onCleanup(() => {
    clearTimeout(timer);
    controller.abort();
  });
});
</script>

<template>
  <search>
    <input id="q" v-model="query" type="search" aria-label="Search fruit" />
    <p id="status">
      {{
        status === 'searching' ? 'Searching…' : status === 'done' ? `${results.length} results` : ''
      }}
    </p>
    <ul id="results">
      <li v-for="r in results" :key="r">{{ r }}</li>
    </ul>
  </search>
</template>
