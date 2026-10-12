import { define, html, type Stateless } from '@gyral/core';

const App = define<Stateless, never>('bench-app', {
  intent: {},
  update: {},
  view: () => html`<p id="hello">Hello</p>`,
});
document.getElementById('app')?.append(new App());
