import { define, each, html, intents } from '@gyral/core';

interface Todo {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
}
type Filter = 'all' | 'active' | 'completed';
const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];
const isFilter = (v: string | undefined): v is Filter => FILTERS.some((f) => f === v);

interface State {
  readonly todos: readonly Todo[];
  readonly filter: Filter;
  readonly draft: string;
  readonly nextId: number;
}
type Msg =
  | { readonly _tag: 'Typed'; readonly text: string }
  | { readonly _tag: 'Add' }
  | { readonly _tag: 'Toggle'; readonly id: number }
  | { readonly _tag: 'Remove'; readonly id: number }
  | { readonly _tag: 'Show'; readonly filter: Filter };

// Intent names as a module constant (`intents<Msg>()`), so the row stays pure: it reads only
// its argument and module constants.
const i = intents<Msg>();

const TodoItem = (t: Todo) => html`
  <li class=${t.done ? 'completed' : ''}>
    <input
      class="toggle"
      type="checkbox"
      value=${t.id}
      ?checked=${t.done}
      data-intent=${i.Toggle}
    />
    <span class="title">${t.title}</span>
    <button class="destroy" type="button" value=${t.id} data-intent=${i.Remove}>×</button>
  </li>
`;

const Todos = define<State, Msg>('bench-todos', {
  init: () => ({ todos: [], filter: 'all', draft: '', nextId: 1 }),
  intent: {
    Typed: ({ value }) => ({ _tag: 'Typed', text: value ?? '' }),
    Add: () => ({ _tag: 'Add' }),
    Toggle: ({ value }) => ({ _tag: 'Toggle', id: Number(value) }),
    Remove: ({ value }) => ({ _tag: 'Remove', id: Number(value) }),
    Show: ({ value }) => (isFilter(value) ? { _tag: 'Show', filter: value } : undefined),
  },
  update: {
    Typed: (s, m) => ({ ...s, draft: m.text }),
    Add: (s) => {
      const title = s.draft.trim();
      if (title === '') return s;
      return {
        ...s,
        todos: [...s.todos, { id: s.nextId, title, done: false }],
        draft: '',
        nextId: s.nextId + 1,
      };
    },
    Toggle: (s, m) => ({
      ...s,
      todos: s.todos.map((t) => (t.id === m.id ? { ...t, done: !t.done } : t)),
    }),
    Remove: (s, m) => ({ ...s, todos: s.todos.filter((t) => t.id !== m.id) }),
    Show: (s, m) => ({ ...s, filter: m.filter }),
  },
  view: (s) => {
    const visible = s.todos.filter((t) =>
      s.filter === 'all' ? true : s.filter === 'active' ? !t.done : t.done,
    );
    const left = s.todos.filter((t) => !t.done).length;
    return html`
      <form id="add-form" data-intent=${i.Add}>
        <input id="new-todo" aria-label="New todo" value=${s.draft} data-intent=${i.Typed} />
      </form>
      <ul id="todo-list">
        ${each(visible, (t) => t.id, TodoItem)}
      </ul>
      <p>
        <span id="remaining">${left} left</span>
        ${FILTERS.map(
          (f) => html`
            <button
              type="button"
              data-filter=${f}
              value=${f}
              aria-pressed=${s.filter === f}
              data-intent=${i.Show}
            >
              ${f}
            </button>
          `,
        )}
      </p>
    `;
  },
});
document.getElementById('app')?.append(new Todos());
