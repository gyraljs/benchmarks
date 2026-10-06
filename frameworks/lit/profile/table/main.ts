// Profiling variant of the Lit table (docs/profile.md): identical to apps/table except that the
// URL picks shadow vs light DOM, indented vs compact templates, and CSS on or off.
import { buildData, UPDATE_SUFFIX, type Row } from '@bench/shared/data';
import { adoptDocumentCss, TABLE_CSS, variantOptions } from '@bench/shared/profile';
import { html, LitElement, unsafeCSS, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const options = variantOptions();
adoptDocumentCss(options);

type RowView = (row: Row, selected: number | undefined, host: ProfileTable) => TemplateResult;

// Whitespace text nodes are part of what is measured: keep this template as written.
// prettier-ignore
const indentedRow: RowView = (row, selected, host) => html`
  <tr class=${row.id === selected ? 'danger' : ''}>
    <td class="col-id">${row.id}</td>
    <td>
      <button class="lbl" type="button" @click=${() => (host.selected = row.id)}>
        ${row.label}
      </button>
    </td>
    <td>
      <button class="remove" type="button" @click=${() => host.removeRow(row.id)}>
        x
      </button>
    </td>
  </tr>
`;

// prettier-ignore
const compactRow: RowView = (row, selected, host) => html`<tr class=${row.id === selected ? 'danger' : ''}><td class="col-id">${row.id}</td><td><button class="lbl" type="button" @click=${() => (host.selected = row.id)}>${row.label}</button></td><td><button class="remove" type="button" @click=${() => host.removeRow(row.id)}>x</button></td></tr>`;

const rowView = options.compact ? compactRow : indentedRow;

class ProfileTable extends LitElement {
  static override properties = { rows: { state: true }, selected: { state: true } };
  static override styles = options.shadow && options.css ? [unsafeCSS(TABLE_CSS)] : [];
  declare rows: readonly Row[];
  declare selected: number | undefined;

  constructor() {
    super();
    this.rows = [];
    this.selected = undefined;
  }

  protected override createRenderRoot() {
    return options.shadow ? super.createRenderRoot() : this;
  }

  removeRow(id: number) {
    this.rows = this.rows.filter((r) => r.id !== id);
  }

  private swap() {
    if (this.rows.length <= 998) return;
    const next = [...this.rows];
    const a = next[1] as Row;
    next[1] = next[998] as Row;
    next[998] = a;
    this.rows = next;
  }

  override render() {
    const set =
      (rows: readonly Row[], selected = this.selected) =>
      () => {
        this.rows = rows;
        this.selected = selected;
      };
    return html`
      <menu>
        <li>
          <button id="run" type="button" @click=${() => set(buildData(1000), undefined)()}>
            Create 1,000 rows
          </button>
        </li>
        <li>
          <button id="runlots" type="button" @click=${() => set(buildData(10000), undefined)()}>
            Create 10,000 rows
          </button>
        </li>
        <li>
          <button id="add" type="button" @click=${() => set([...this.rows, ...buildData(1000)])()}>
            Append 1,000 rows
          </button>
        </li>
        <li>
          <button
            id="update"
            type="button"
            @click=${() => set(this.rows.map((r, i) => (i % 10 === 0 ? { ...r, label: r.label + UPDATE_SUFFIX } : r)))()}
          >
            Update every 10th row
          </button>
        </li>
        <li>
          <button id="clear" type="button" @click=${() => set([], undefined)()}>Clear</button>
        </li>
        <li><button id="swaprows" type="button" @click=${() => this.swap()}>Swap rows</button></li>
      </menu>
      <table>
        <tbody id="tbody">
          ${repeat(
            this.rows,
            (row) => row.id,
            (row) => rowView(row, this.selected, this),
          )}
        </tbody>
      </table>
    `;
  }
}
customElements.define('bench-table', ProfileTable);
document.getElementById('app')?.append(new ProfileTable());
