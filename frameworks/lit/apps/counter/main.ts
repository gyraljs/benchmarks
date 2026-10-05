import { html, LitElement } from 'lit';

class BenchCounter extends LitElement {
  static override properties = { count: { state: true } };
  declare count: number;

  constructor() {
    super();
    this.count = 0;
  }

  override render() {
    return html`
      <button id="dec" type="button" @click=${() => this.count--}>-</button>
      <output id="count">${this.count}</output>
      <button id="inc" type="button" @click=${() => this.count++}>+</button>
    `;
  }
}
customElements.define('bench-counter', BenchCounter);
document.getElementById('app')?.append(new BenchCounter());
