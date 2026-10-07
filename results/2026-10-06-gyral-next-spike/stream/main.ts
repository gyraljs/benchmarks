// Spike (gyral-g1r.8): a bursty source. A streaming driver emits ticks from separate tasks
// (MessageChannel), `burst` per timer tick, every `every` ms; each tick updates one of 1,000
// rows (a ticker). Counts messages and renders so the flush strategies can be compared.
import { command, define, defineDriver, each, html, type Command } from '@gyral/core';

const params = new URLSearchParams(location.search);
const BURST = Number(params.get('burst') ?? 1);
const EVERY = Number(params.get('every') ?? 4);
const N = 1000;

interface Tick {
  readonly id: number;
  readonly value: number;
}
const stream = defineDriver<null, Tick>({
  name: 'stream',
  run: (_input, { emit, signal }) =>
    new Promise<never>(() => {
      const channel = new MessageChannel();
      let seq = 0;
      channel.port1.onmessage = () => {
        seq += 1;
        emit({ id: (seq * 7919) % N, value: seq });
      };
      const timer = setInterval(() => {
        for (let k = 0; k < BURST; k++) channel.port2.postMessage(null);
      }, EVERY);
      signal.addEventListener('abort', () => {
        clearInterval(timer);
      });
    }),
});

interface Row {
  readonly id: number;
  readonly value: number;
}
interface State {
  readonly rows: readonly Row[];
  readonly ticks: number;
  readonly running: boolean;
  readonly series: readonly number[];
}
type Msg = { readonly _tag: 'Start' } | { readonly _tag: 'Ticked'; readonly tick: Tick };

const listen = (): Command<Msg> =>
  command(stream, null, { onSuccess: (tick) => ({ _tag: 'Ticked', tick }) });

const RowView = (r: Row) => html`<tr><td>${r.id}</td><td class="up">${r.value}</td></tr>`;

const w = window as unknown as { __renders: number; __ticks: () => number };
w.__renders = 0;

const App = define<State, Msg>('spike-stream', {
  renderOnFrame: params.get('lane') === 'frame' ? ['Ticked'] : [],
  init: () => ({
    rows: Array.from({ length: N }, (_, id) => ({ id, value: 0 })),
    ticks: 0,
    running: false,
    series: [],
  }),
  intent: { Start: () => ({ _tag: 'Start' }) },
  update: {
    Start: (s) => (s.running ? s : [{ ...s, running: true }, [listen()]]),
    Ticked: (s, { tick }) => ({
      ...s,
      ticks: s.ticks + 1,
      series: [...s.series.slice(-499), (tick.value * 37) % 100],
      rows: s.rows.map((r) => (r.id === tick.id ? { id: r.id, value: tick.value } : r)),
    }),
  },
  view: (s, i) => {
    w.__renders += 1;
    return html`
      <button id="start" type="button" data-intent=${i.Start}>Start</button>
      <output id="ticks">${s.ticks}</output>
      <svg viewBox="0 0 500 100" width="500" height="100">
        <polyline fill="none" stroke="black" points=${s.series.map((v, x) => `${x},${v}`).join(' ')} />
      </svg>
      <table>
        <tbody>
          ${each(s.rows, (r) => r.id, RowView)}
        </tbody>
      </table>
    `;
  },
});
const app = new App();
w.__ticks = () => app.state.ticks;
document.getElementById('app')?.append(app);
