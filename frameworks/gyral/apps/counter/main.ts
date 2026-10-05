import { define, html } from '@gyral/core';

interface State {
  readonly count: number;
}
type Msg = { readonly _tag: 'Increment' } | { readonly _tag: 'Decrement' };

const Counter = define<State, Msg>('bench-counter', {
  init: () => ({ count: 0 }),
  intent: {
    Increment: () => ({ _tag: 'Increment' }),
    Decrement: () => ({ _tag: 'Decrement' }),
  },
  update: {
    Increment: (s) => ({ count: s.count + 1 }),
    Decrement: (s) => ({ count: s.count - 1 }),
  },
  view: (s, i) => html`
    <button id="dec" type="button" data-intent=${i.Decrement}>-</button>
    <output id="count">${s.count}</output>
    <button id="inc" type="button" data-intent=${i.Increment}>+</button>
  `,
});
document.getElementById('app')?.append(new Counter());
