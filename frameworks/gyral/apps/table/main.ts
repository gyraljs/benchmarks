import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';
import { define, each, html, intentsOf, type TemplateResult } from '@gyral/core';

interface State {
  readonly rows: readonly Row[];
  readonly selected: number | undefined;
}
type Msg =
  | { readonly _tag: 'Run' }
  | { readonly _tag: 'RunLots' }
  | { readonly _tag: 'Add' }
  | { readonly _tag: 'Update' }
  | { readonly _tag: 'Clear' }
  | { readonly _tag: 'Swap' }
  | { readonly _tag: 'Select'; readonly id: number }
  | { readonly _tag: 'Remove'; readonly id: number };

const swapped = (rows: readonly Row[]): readonly Row[] => {
  if (rows.length <= 998) return rows;
  const next = [...rows];
  const a = next[1] as Row;
  next[1] = next[998] as Row;
  next[998] = a;
  return next;
};

/** A row id from a button's `value`; anything else is ignored. */
const rowId = (value: string | undefined): number | undefined => {
  const id = Number(value);
  return Number.isInteger(id) ? id : undefined;
};

// The component's intent names as a module constant (`intentsOf`), so the row stays pure: it
// reads only its arguments and module constants; the selection comes through `pick`.
const i = intentsOf<typeof Table>();

const RowView = (row: Row, selected: boolean): TemplateResult => html`
  <tr class=${selected ? 'danger' : ''}>
    <td class="col-id">${row.id}</td>
    <td>
      <button class="lbl" type="button" value=${row.id} data-intent=${i.Select}>
        ${row.label}
      </button>
    </td>
    <td>
      <button class="remove" type="button" value=${row.id} data-intent=${i.Remove}>x</button>
    </td>
  </tr>
`;

// Building rows is the same shared code every implementation calls; Gyral's own guideline
// would make randomness a command (a random driver), which only adds work here.
const Table = define<State, Msg>()('bench-table', {
  init: () => ({ rows: [], selected: undefined }),
  intent: {
    Run: true,
    RunLots: true,
    Add: true,
    Update: true,
    Clear: true,
    Swap: true,
    Select: ({ value }) => {
      const id = rowId(value);
      return id === undefined ? undefined : { _tag: 'Select', id };
    },
    Remove: ({ value }) => {
      const id = rowId(value);
      return id === undefined ? undefined : { _tag: 'Remove', id };
    },
  },
  update: {
    Run: () => ({ rows: buildData(1000), selected: undefined }),
    RunLots: () => ({ rows: buildData(10000), selected: undefined }),
    Add: (s) => ({ ...s, rows: [...s.rows, ...buildData(1000)] }),
    Update: (s) => ({
      ...s,
      rows: s.rows.map((r, n) => (n % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r)),
    }),
    Clear: () => ({ rows: [], selected: undefined }),
    Swap: (s) => ({ ...s, rows: swapped(s.rows) }),
    Select: (s, m) => ({ ...s, selected: m.id }),
    Remove: (s, m) => ({ ...s, rows: s.rows.filter((r) => r.id !== m.id) }),
  },
  // The view uses its own `i`; the module constant is for the rows.
  view: (s, i) => html`
    <menu>
      <li><button id="run" type="button" data-intent=${i.Run}>Create 1,000 rows</button></li>
      <li>
        <button id="runlots" type="button" data-intent=${i.RunLots}>Create 10,000 rows</button>
      </li>
      <li><button id="add" type="button" data-intent=${i.Add}>Append 1,000 rows</button></li>
      <li>
        <button id="update" type="button" data-intent=${i.Update}>Update every 10th row</button>
      </li>
      <li><button id="clear" type="button" data-intent=${i.Clear}>Clear</button></li>
      <li><button id="swaprows" type="button" data-intent=${i.Swap}>Swap rows</button></li>
    </menu>
    <table>
      <tbody id="tbody">
        ${each(
          s.rows,
          (row) => row.id,
          RowView,
          (row) => row.id === s.selected,
        )}
      </tbody>
    </table>
  `,
});
document.getElementById('app')?.append(new Table());
