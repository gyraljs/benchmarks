import {
  EMPTY_SIGNUP,
  isValid,
  validateSignup,
  welcome,
  type Field,
  type SignupValues,
} from '@bench/shared/signup';
import { html, LitElement, nothing } from 'lit';

const FIELDS: readonly { field: Exclude<Field, 'terms'>; label: string; type: string }[] = [
  { field: 'email', label: 'Email', type: 'email' },
  { field: 'password', label: 'Password', type: 'password' },
  { field: 'confirm', label: 'Confirm password', type: 'password' },
];

class BenchSignup extends LitElement {
  static override properties = {
    values: { state: true },
    submitted: { state: true },
    success: { state: true },
  };
  declare values: SignupValues;
  declare submitted: boolean;
  declare success: string | undefined;

  constructor() {
    super();
    this.values = EMPTY_SIGNUP;
    this.submitted = false;
    this.success = undefined;
  }

  private set(field: Field, value: string | boolean) {
    this.values = { ...this.values, [field]: value };
  }

  private submit(event: SubmitEvent) {
    event.preventDefault();
    this.submitted = true;
    if (isValid(validateSignup(this.values))) this.success = welcome(this.values.email);
  }

  override render() {
    const errors = this.submitted ? validateSignup(this.values) : {};
    const error = (field: Field) =>
      errors[field] === undefined
        ? nothing
        : html`<span id="${field}-error" class="error">${errors[field]}</span>`;
    return html`
      <form id="signup" novalidate @submit=${this.submit}>
        ${FIELDS.map(
          (f) => html`
            <label>
              ${f.label}
              <input
                id=${f.field}
                name=${f.field}
                type=${f.type}
                .value=${this.values[f.field]}
                aria-invalid=${errors[f.field] !== undefined}
                @input=${(e: InputEvent) => this.set(f.field, (e.target as HTMLInputElement).value)}
              />
            </label>
            ${error(f.field)}
          `,
        )}
        <label>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            .checked=${this.values.terms}
            aria-invalid=${errors.terms !== undefined}
            @change=${(e: Event) => this.set('terms', (e.target as HTMLInputElement).checked)}
          />
          I accept the terms
        </label>
        ${error('terms')}
        <button id="submit" type="submit">Sign up</button>
        ${this.success === undefined ? nothing : html`<p id="success">${this.success}</p>`}
      </form>
    `;
  }
}
customElements.define('bench-signup', BenchSignup);
document.getElementById('app')?.append(new BenchSignup());
