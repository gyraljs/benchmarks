import { buildData, UPDATE_SUFFIX } from '@bench/shared/data';
import { createSelector, createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

interface Row {
  id: number;
  label: string;
}

// A store for the rows (fine-grained label updates) and createSelector for the selection:
// the documented Solid tools for large lists.
function Table() {
  const [state, setState] = createStore<{ rows: Row[] }>({ rows: [] });
  const [selected, setSelected] = createSignal<number>();
  const isSelected = createSelector(selected);

  const run = () => {
    setState('rows', buildData(1000));
    setSelected(undefined);
  };
  const runLots = () => {
    setState('rows', buildData(10000));
    setSelected(undefined);
  };
  const add = () => setState('rows', (rs) => [...rs, ...buildData(1000)]);
  const update = () =>
    setState(
      'rows',
      (_r, i) => i % 10 === 0,
      'label',
      (l) => l + UPDATE_SUFFIX,
    );
  const clear = () => {
    setState('rows', []);
    setSelected(undefined);
  };
  const swap = () => {
    if (state.rows.length <= 998) return;
    setState('rows', (rs) => {
      const next = [...rs];
      const a = next[1] as Row;
      next[1] = next[998] as Row;
      next[998] = a;
      return next;
    });
  };
  const remove = (id: number) => setState('rows', (rs) => rs.filter((r) => r.id !== id));

  return (
    <>
      <menu>
        <li>
          <button id="run" type="button" onClick={run}>
            Create 1,000 rows
          </button>
        </li>
        <li>
          <button id="runlots" type="button" onClick={runLots}>
            Create 10,000 rows
          </button>
        </li>
        <li>
          <button id="add" type="button" onClick={add}>
            Append 1,000 rows
          </button>
        </li>
        <li>
          <button id="update" type="button" onClick={update}>
            Update every 10th row
          </button>
        </li>
        <li>
          <button id="clear" type="button" onClick={clear}>
            Clear
          </button>
        </li>
        <li>
          <button id="swaprows" type="button" onClick={swap}>
            Swap rows
          </button>
        </li>
      </menu>
      <table>
        <tbody id="tbody">
          <For each={state.rows}>
            {(row) => (
              <tr class={isSelected(row.id) ? 'danger' : ''}>
                <td class="col-id">{row.id}</td>
                <td>
                  <button class="lbl" type="button" onClick={() => setSelected(row.id)}>
                    {row.label}
                  </button>
                </td>
                <td>
                  <button class="remove" type="button" onClick={() => remove(row.id)}>
                    x
                  </button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
}

render(() => <Table />, document.getElementById('app') as HTMLElement);
