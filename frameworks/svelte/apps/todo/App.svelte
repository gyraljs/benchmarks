<script lang="ts">
  interface Todo {
    id: number;
    title: string;
    done: boolean;
  }
  type Filter = 'all' | 'active' | 'completed';
  const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];

  let nextId = 1;
  let todos = $state<Todo[]>([]);
  let filter = $state<Filter>('all');
  let draft = $state('');

  const visible = $derived(
    todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done)),
  );
  const left = $derived(todos.filter((t) => !t.done).length);

  function add(event: SubmitEvent) {
    event.preventDefault();
    const title = draft.trim();
    if (title === '') return;
    todos.push({ id: nextId++, title, done: false });
    draft = '';
  }
  function remove(id: number) {
    todos = todos.filter((t) => t.id !== id);
  }
</script>

<form id="add-form" onsubmit={add}>
  <input id="new-todo" aria-label="New todo" bind:value={draft} />
</form>
<ul id="todo-list">
  {#each visible as t (t.id)}
    <li class={{ completed: t.done }}>
      <input class="toggle" type="checkbox" bind:checked={t.done} />
      <span class="title">{t.title}</span>
      <button class="destroy" type="button" onclick={() => remove(t.id)}>×</button>
    </li>
  {/each}
</ul>
<p>
  <span id="remaining">{left} left</span>
  {#each FILTERS as f (f)}
    <button type="button" data-filter={f} aria-pressed={filter === f} onclick={() => (filter = f)}>
      {f}
    </button>
  {/each}
</p>
