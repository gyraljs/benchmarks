import { define, html } from '@gyral/core';

// No state and no messages: neither `intent` nor `update` is needed (Gyral 0.3.1).
const App = define()('bench-app', {
  view: () => html`<p id="hello">Hello</p>`,
});
document.getElementById('app')?.append(new App());
