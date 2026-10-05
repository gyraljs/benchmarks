import { render } from 'preact';
import { useState } from 'preact/hooks';

interface Todo {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
}
type Filter = 'all' | 'active' | 'completed';
const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];

let nextId = 1;

function Todos() {
  const [todos, setTodos] = useState<readonly Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [draft, setDraft] = useState('');

  const add = (event: SubmitEvent) => {
    event.preventDefault();
    const title = draft.trim();
    if (title === '') return;
    setTodos((ts) => [...ts, { id: nextId++, title, done: false }]);
    setDraft('');
  };
  const toggle = (id: number) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTodos((ts) => ts.filter((t) => t.id !== id));

  const visible = todos.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done,
  );
  const left = todos.filter((t) => !t.done).length;

  return (
    <>
      <form id="add-form" onSubmit={add}>
        <input
          id="new-todo"
          aria-label="New todo"
          value={draft}
          onInput={(e) => setDraft(e.currentTarget.value)}
        />
      </form>
      <ul id="todo-list">
        {visible.map((t) => (
          <li key={t.id} class={t.done ? 'completed' : ''}>
            <input class="toggle" type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span class="title">{t.title}</span>
            <button class="destroy" type="button" onClick={() => remove(t.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <p>
        <span id="remaining">{left} left</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            data-filter={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </p>
    </>
  );
}

render(<Todos />, document.getElementById('app') as HTMLElement);
