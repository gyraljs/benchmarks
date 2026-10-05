<script setup lang="ts">
import { computed, ref } from 'vue';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}
type Filter = 'all' | 'active' | 'completed';
const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];

let nextId = 1;
const todos = ref<Todo[]>([]);
const filter = ref<Filter>('all');
const draft = ref('');

const visible = computed(() =>
  todos.value.filter((t) =>
    filter.value === 'all' ? true : filter.value === 'active' ? !t.done : t.done,
  ),
);
const left = computed(() => todos.value.filter((t) => !t.done).length);

function add() {
  const title = draft.value.trim();
  if (title === '') return;
  todos.value.push({ id: nextId++, title, done: false });
  draft.value = '';
}
function remove(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
</script>

<template>
  <form id="add-form" @submit.prevent="add">
    <input id="new-todo" v-model="draft" aria-label="New todo" />
  </form>
  <ul id="todo-list">
    <li v-for="t in visible" :key="t.id" :class="{ completed: t.done }">
      <input v-model="t.done" class="toggle" type="checkbox" />
      <span class="title">{{ t.title }}</span>
      <button class="destroy" type="button" @click="remove(t.id)">×</button>
    </li>
  </ul>
  <p>
    <span id="remaining">{{ left }} left</span>
    <button
      v-for="f in FILTERS"
      :key="f"
      type="button"
      :data-filter="f"
      :aria-pressed="filter === f"
      @click="filter = f"
    >
      {{ f }}
    </button>
  </p>
</template>
