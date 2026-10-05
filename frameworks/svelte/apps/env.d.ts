// Lets plain .ts entry files import .svelte components (svelte-check types the components).
declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component;
  export default component;
}
