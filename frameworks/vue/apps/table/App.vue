<script setup lang="ts">
import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';
import { shallowRef } from 'vue';

// shallowRef + replacing the array, and v-memo on rows: Vue's documented tools for large lists.
const rows = shallowRef<Row[]>([]);
const selected = shallowRef<number>();

function run() {
  rows.value = buildData(1000);
  selected.value = undefined;
}
function runLots() {
  rows.value = buildData(10000);
  selected.value = undefined;
}
function add() {
  rows.value = [...rows.value, ...buildData(1000)];
}
function update() {
  rows.value = rows.value.map((r, i) =>
    i % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r,
  );
}
function clear() {
  rows.value = [];
  selected.value = undefined;
}
function swap() {
  if (rows.value.length <= 998) return;
  const next = [...rows.value];
  const a = next[1] as Row;
  next[1] = next[998] as Row;
  next[998] = a;
  rows.value = next;
}
function remove(id: number) {
  rows.value = rows.value.filter((r) => r.id !== id);
}
</script>

<template>
  <menu>
    <li><button id="run" type="button" @click="run">Create 1,000 rows</button></li>
    <li><button id="runlots" type="button" @click="runLots">Create 10,000 rows</button></li>
    <li><button id="add" type="button" @click="add">Append 1,000 rows</button></li>
    <li><button id="update" type="button" @click="update">Update every 10th row</button></li>
    <li><button id="clear" type="button" @click="clear">Clear</button></li>
    <li><button id="swaprows" type="button" @click="swap">Swap rows</button></li>
  </menu>
  <table>
    <tbody id="tbody">
      <tr
        v-for="row in rows"
        :key="row.id"
        v-memo="[row.label, row.id === selected]"
        :class="{ danger: row.id === selected }"
      >
        <td class="col-id">{{ row.id }}</td>
        <td>
          <button class="lbl" type="button" @click="selected = row.id">{{ row.label }}</button>
        </td>
        <td><button class="remove" type="button" @click="remove(row.id)">x</button></td>
      </tr>
    </tbody>
  </table>
</template>
