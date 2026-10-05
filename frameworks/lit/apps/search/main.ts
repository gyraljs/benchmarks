import { DEBOUNCE_MS, searchWords } from '@bench/shared/search';
import { html, LitElement } from 'lit';

type Status = 'idle' | 'searching' | 'done';

class BenchSearch extends LitElement {
  static override properties = {
    results: { state: true },
    status: { state: true },
  };
  declare results: readonly string[];
  declare status: Status;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private controller: AbortController | undefined;

  constructor() {
    super();
    this.results = [];
    this.status = 'idle';
  }

  // Debounce, then fetch; a new keystroke cancels the stale timer and request (latest wins).
  private onInput(event: InputEvent) {
    const query = (event.target as HTMLInputElement).value;
    clearTimeout(this.timer);
    this.controller?.abort();
    if (query.trim() === '') {
      this.results = [];
      this.status = 'idle';
      return;
    }
    const controller = new AbortController();
    this.controller = controller;
    this.timer = setTimeout(() => {
      this.status = 'searching';
      searchWords(query, controller.signal).then(
        (found) => {
          this.results = found;
          this.status = 'done';
        },
        () => undefined,
      );
    }, DEBOUNCE_MS);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.controller?.abort();
  }

  override render() {
    return html`
      <search>
        <input id="q" type="search" aria-label="Search fruit" @input=${this.onInput} />
        <p id="status">
          ${
            this.status === 'searching'
              ? 'Searching…'
              : this.status === 'done'
                ? `${this.results.length} results`
                : ''
          }
        </p>
        <ul id="results">
          ${this.results.map((r) => html`<li>${r}</li>`)}
        </ul>
      </search>
    `;
  }
}
customElements.define('bench-search', BenchSearch);
document.getElementById('app')?.append(new BenchSearch());
