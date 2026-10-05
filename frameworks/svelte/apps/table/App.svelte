<script lang="ts">
  import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';

  // $state.raw: the list is replaced, never mutated in place (the documented choice for
  // large immutable data, which avoids deep proxies).
  let rows = $state.raw<Row[]>([]);
  let selected = $state<number>();

  function run() {
    rows = buildData(1000);
    selected = undefined;
  }
  function runLots() {
    rows = buildData(10000);
    selected = undefined;
  }
  function add() {
    rows = [...rows, ...buildData(1000)];
  }
  function update() {
    rows = rows.map((r, i) => (i % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r));
  }
  function clear() {
    rows = [];
    selected = undefined;
  }
  function swap() {
    if (rows.length <= 998) return;
    const next = [...rows];
    const a = next[1] as Row;
    next[1] = next[998] as Row;
    next[998] = a;
    rows = next;
  }
  function remove(id: number) {
    rows = rows.filter((r) => r.id !== id);
  }
</script>

<menu>
  <li><button id="run" type="button" onclick={run}>Create 1,000 rows</button></li>
  <li><button id="runlots" type="button" onclick={runLots}>Create 10,000 rows</button></li>
  <li><button id="add" type="button" onclick={add}>Append 1,000 rows</button></li>
  <li><button id="update" type="button" onclick={update}>Update every 10th row</button></li>
  <li><button id="clear" type="button" onclick={clear}>Clear</button></li>
  <li><button id="swaprows" type="button" onclick={swap}>Swap rows</button></li>
</menu>
<table>
  <tbody id="tbody">
    {#each rows as row (row.id)}
      <tr class={{ danger: row.id === selected }}>
        <td class="col-id">{row.id}</td>
        <td>
          <button class="lbl" type="button" onclick={() => (selected = row.id)}>{row.label}</button>
        </td>
        <td><button class="remove" type="button" onclick={() => remove(row.id)}>x</button></td>
      </tr>
    {/each}
  </tbody>
</table>
