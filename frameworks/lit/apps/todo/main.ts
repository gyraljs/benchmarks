import { html, LitElement } from 'lit';
import { live } from 'lit/directives/live.js';
import { repeat } from 'lit/directives/repeat.js';

interface Todo {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
}
type Filter = 'all' | 'active' | 'completed';
const FILTERS: readonly Filter[] = ['all', 'active', 'completed'];

let nextId = 1;

class BenchTodos extends LitElement {
  static override properties = {
    todos: { state: true },
    filter: { state: true },
    draft: { state: true },
  };
  declare todos: readonly Todo[];
  declare filter: Filter;
  declare draft: string;

  constructor() {
    super();
    this.todos = [];
    this.filter = 'all';
    this.draft = '';
  }

  private add(event: SubmitEvent) {
    event.preventDefault();
    const title = this.draft.trim();
    if (title === '') return;
    this.todos = [...this.todos, { id: nextId++, title, done: false }];
    this.draft = '';
  }

  private toggle(id: number) {
    this.todos = this.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  }

  private removeTodo(id: number) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  override render() {
    const visible = this.todos.filter((t) =>
      this.filter === 'all' ? true : this.filter === 'active' ? !t.done : t.done,
    );
    const left = this.todos.filter((t) => !t.done).length;
    return html`
      <form id="add-form" @submit=${this.add}>
        <input
          id="new-todo"
          aria-label="New todo"
          .value=${live(this.draft)}
          @input=${(e: InputEvent) => (this.draft = (e.target as HTMLInputElement).value)}
        />
      </form>
      <ul id="todo-list">
        ${repeat(
          visible,
          (t) => t.id,
          (t) => html`
            <li class=${t.done ? 'completed' : ''}>
              <input
                class="toggle"
                type="checkbox"
                .checked=${t.done}
                @change=${() => this.toggle(t.id)}
              />
              <span class="title">${t.title}</span>
              <button class="destroy" type="button" @click=${() => this.removeTodo(t.id)}>×</button>
            </li>
          `,
        )}
      </ul>
      <p>
        <span id="remaining">${left} left</span>
        ${FILTERS.map(
          (f) => html`
            <button
              type="button"
              data-filter=${f}
              aria-pressed=${this.filter === f}
              @click=${() => (this.filter = f)}
            >
              ${f}
            </button>
          `,
        )}
      </p>
    `;
  }
}
customElements.define('bench-todos', BenchTodos);
document.getElementById('app')?.append(new BenchTodos());
