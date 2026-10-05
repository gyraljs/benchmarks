import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';
import { memo, useCallback, useReducer } from 'react';
import { createRoot } from 'react-dom/client';

interface State {
  readonly rows: readonly Row[];
  readonly selected: number | undefined;
}
type Action =
  | { readonly type: 'run' }
  | { readonly type: 'runLots' }
  | { readonly type: 'add' }
  | { readonly type: 'update' }
  | { readonly type: 'clear' }
  | { readonly type: 'swap' }
  | { readonly type: 'select'; readonly id: number }
  | { readonly type: 'remove'; readonly id: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'run':
      return { rows: buildData(1000), selected: undefined };
    case 'runLots':
      return { rows: buildData(10000), selected: undefined };
    case 'add':
      return { ...state, rows: [...state.rows, ...buildData(1000)] };
    case 'update':
      return {
        ...state,
        rows: state.rows.map((r, i) =>
          i % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r,
        ),
      };
    case 'clear':
      return { rows: [], selected: undefined };
    case 'swap': {
      if (state.rows.length <= 998) return state;
      const rows = [...state.rows];
      const a = rows[1] as Row;
      rows[1] = rows[998] as Row;
      rows[998] = a;
      return { ...state, rows };
    }
    case 'select':
      return { ...state, selected: action.id };
    case 'remove':
      return { ...state, rows: state.rows.filter((r) => r.id !== action.id) };
  }
}

interface RowProps {
  readonly row: Row;
  readonly selected: boolean;
  readonly dispatch: (action: Action) => void;
}

// memo: only rows whose props change re-render (the documented way to skip work in lists).
const TableRow = memo(function TableRow({ row, selected, dispatch }: RowProps) {
  return (
    <tr className={selected ? 'danger' : ''}>
      <td className="col-id">{row.id}</td>
      <td>
        <button
          className="lbl"
          type="button"
          onClick={() => dispatch({ type: 'select', id: row.id })}
        >
          {row.label}
        </button>
      </td>
      <td>
        <button
          className="remove"
          type="button"
          onClick={() => dispatch({ type: 'remove', id: row.id })}
        >
          x
        </button>
      </td>
    </tr>
  );
});

function Table() {
  const [state, dispatch] = useReducer(reducer, { rows: [], selected: undefined });
  const send = useCallback((action: Action) => dispatch(action), []);
  return (
    <>
      <menu>
        <li>
          <button id="run" type="button" onClick={() => send({ type: 'run' })}>
            Create 1,000 rows
          </button>
        </li>
        <li>
          <button id="runlots" type="button" onClick={() => send({ type: 'runLots' })}>
            Create 10,000 rows
          </button>
        </li>
        <li>
          <button id="add" type="button" onClick={() => send({ type: 'add' })}>
            Append 1,000 rows
          </button>
        </li>
        <li>
          <button id="update" type="button" onClick={() => send({ type: 'update' })}>
            Update every 10th row
          </button>
        </li>
        <li>
          <button id="clear" type="button" onClick={() => send({ type: 'clear' })}>
            Clear
          </button>
        </li>
        <li>
          <button id="swaprows" type="button" onClick={() => send({ type: 'swap' })}>
            Swap rows
          </button>
        </li>
      </menu>
      <table>
        <tbody id="tbody">
          {state.rows.map((row) => (
            <TableRow key={row.id} row={row} selected={row.id === state.selected} dispatch={send} />
          ))}
        </tbody>
      </table>
    </>
  );
}

createRoot(document.getElementById('app') as HTMLElement).render(<Table />);
