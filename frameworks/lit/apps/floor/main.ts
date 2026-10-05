import { html, LitElement } from 'lit';

class BenchApp extends LitElement {
  override render() {
    return html`<p id="hello">Hello</p>`;
  }
}
customElements.define('bench-app', BenchApp);
document.getElementById('app')?.append(new BenchApp());
