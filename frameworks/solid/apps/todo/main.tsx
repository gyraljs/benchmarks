import { createMemo, createSignal, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}
type Filter = 'all' | 'active' | 'completed';
const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];

let nextId = 1;

function Todos() {
  const [state, setState] = createStore<{ todos: Todo[] }>({ todos: [] });
  const [filter, setFilter] = createSignal<Filter>('all');
  const [draft, setDraft] = createSignal('');

  const visible = createMemo(() =>
    state.todos.filter((t) =>
      filter() === 'all' ? true : filter() === 'active' ? !t.done : t.done,
    ),
  );
  const left = createMemo(() => state.todos.filter((t) => !t.done).length);

  const add = (event: SubmitEvent) => {
    event.preventDefault();
    const title = draft().trim();
    if (title === '') return;
    setState('todos', state.todos.length, { id: nextId++, title, done: false });
    setDraft('');
  };
  const toggle = (id: number) =>
    setState(
      'todos',
      (t) => t.id === id,
      'done',
      (d) => !d,
    );
  const remove = (id: number) => setState('todos', (ts) => ts.filter((t) => t.id !== id));

  return (
    <>
      <form id="add-form" onSubmit={add}>
        <input
          id="new-todo"
          aria-label="New todo"
          value={draft()}
          onInput={(e) => setDraft(e.currentTarget.value)}
        />
      </form>
      <ul id="todo-list">
        <For each={visible()}>
          {(t) => (
            <li classList={{ completed: t.done }}>
              <input
                class="toggle"
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <span class="title">{t.title}</span>
              <button class="destroy" type="button" onClick={() => remove(t.id)}>
                ×
              </button>
            </li>
          )}
        </For>
      </ul>
      <p>
        <span id="remaining">{left()} left</span>
        <For each={FILTERS}>
          {(f) => (
            <button
              type="button"
              data-filter={f}
              aria-pressed={filter() === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          )}
        </For>
      </p>
    </>
  );
}

render(() => <Todos />, document.getElementById('app') as HTMLElement);
