// The profiling variants (docs/profile.md). Each name maps to a page path under dist/: the
// p-<fw> builds read their options from the query (shared/src/profile.ts); `lit (app)` is the
// benchmark's own Lit app as a control, and Svelte and Solid are light-DOM references.
export const VARIANTS = {
  'lit (app)': 'lit/table/',
  'lit shadow': 'p-lit/table/?shadow=1',
  'lit light': 'p-lit/table/?shadow=0',
  'lit shadow compact': 'p-lit/table/?shadow=1&compact=1',
  'lit light compact': 'p-lit/table/?shadow=0&compact=1',
  'lit shadow css': 'p-lit/table/?shadow=1&css=1',
  'lit light css': 'p-lit/table/?shadow=0&css=1',
  'gyral shadow': 'p-gyral/table/?shadow=1',
  'gyral light': 'p-gyral/table/?shadow=0',
  'gyral light compact': 'p-gyral/table/?shadow=0&compact=1',
  svelte: 'svelte/table/',
  solid: 'solid/table/',
};

/** Every app's page for the node counts: the variants plus the other benchmark apps. */
export const NODE_COUNT_PAGES = {
  ...VARIANTS,
  gyral: 'gyral/table/',
  react: 'react/table/',
  preact: 'preact/table/',
  vue: 'vue/table/',
};
