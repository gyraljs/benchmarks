import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class BenchTable extends LitElement {
  static override properties = {
    rows: { state: true },
    selected: { state: true },
  };
  declare rows: readonly Row[];
  declare selected: number | undefined;

  constructor() {
    super();
    this.rows = [];
    this.selected = undefined;
  }

  private run() {
    this.rows = buildData(1000);
    this.selected = undefined;
  }
  private runLots() {
    this.rows = buildData(10000);
    this.selected = undefined;
  }
  private add() {
    this.rows = [...this.rows, ...buildData(1000)];
  }
  private updateRows() {
    this.rows = this.rows.map((r, i) =>
      i % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r,
    );
  }
  private clear() {
    this.rows = [];
    this.selected = undefined;
  }
  private swap() {
    if (this.rows.length <= 998) return;
    const next = [...this.rows];
    const a = next[1] as Row;
    next[1] = next[998] as Row;
    next[998] = a;
    this.rows = next;
  }
  private removeRow(id: number) {
    this.rows = this.rows.filter((r) => r.id !== id);
  }

  override render() {
    return html`
      <menu>
        <li><button id="run" type="button" @click=${this.run}>Create 1,000 rows</button></li>
        <li>
          <button id="runlots" type="button" @click=${this.runLots}>Create 10,000 rows</button>
        </li>
        <li><button id="add" type="button" @click=${this.add}>Append 1,000 rows</button></li>
        <li>
          <button id="update" type="button" @click=${this.updateRows}>Update every 10th row</button>
        </li>
        <li><button id="clear" type="button" @click=${this.clear}>Clear</button></li>
        <li><button id="swaprows" type="button" @click=${this.swap}>Swap rows</button></li>
      </menu>
      <table>
        <tbody id="tbody">
          ${repeat(
            this.rows,
            (row) => row.id,
            (row) => html`
              <tr class=${row.id === this.selected ? 'danger' : ''}>
                <td class="col-id">${row.id}</td>
                <td>
                  <button class="lbl" type="button" @click=${() => (this.selected = row.id)}>
                    ${row.label}
                  </button>
                </td>
                <td>
                  <button class="remove" type="button" @click=${() => this.removeRow(row.id)}>
                    x
                  </button>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}
customElements.define('bench-table', BenchTable);
document.getElementById('app')?.append(new BenchTable());
