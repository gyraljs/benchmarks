import {
  EMPTY_SIGNUP,
  isValid,
  validateSignup,
  welcome,
  type Field,
  type SignupValues,
} from '@bench/shared/signup';
import { define, html, live, liveBoolean, nothing } from '@gyral/core';

const FIELDS: readonly { field: Exclude<Field, 'terms'>; label: string; type: string }[] = [
  { field: 'email', label: 'Email', type: 'email' },
  { field: 'password', label: 'Password', type: 'password' },
  { field: 'confirm', label: 'Confirm password', type: 'password' },
];
const isTextField = (name: string): name is Exclude<Field, 'terms'> =>
  FIELDS.some((f) => f.field === name);

interface State {
  readonly values: SignupValues;
  readonly submitted: boolean;
  readonly success: string | undefined;
}
type Msg =
  | { readonly _tag: 'Edited'; readonly field: Exclude<Field, 'terms'>; readonly value: string }
  | { readonly _tag: 'Agreed'; readonly terms: boolean }
  | { readonly _tag: 'Submit' };

const Signup = define<State, Msg>('bench-signup', {
  init: () => ({ values: EMPTY_SIGNUP, submitted: false, success: undefined }),
  intent: {
    Edited: ({ target, value }) => {
      const name = target.getAttribute('name') ?? '';
      return isTextField(name) ? { _tag: 'Edited', field: name, value: value ?? '' } : undefined;
    },
    Agreed: ({ checked }) => ({ _tag: 'Agreed', terms: checked === true }),
    Submit: () => ({ _tag: 'Submit' }),
  },
  update: {
    Edited: (s, m) => ({ ...s, values: { ...s.values, [m.field]: m.value } }),
    Agreed: (s, m) => ({ ...s, values: { ...s.values, terms: m.terms } }),
    Submit: (s) => ({
      ...s,
      submitted: true,
      success: isValid(validateSignup(s.values)) ? welcome(s.values.email) : s.success,
    }),
  },
  view: (s, i) => {
    const errors = s.submitted ? validateSignup(s.values) : {};
    const error = (field: Field) =>
      errors[field] === undefined
        ? nothing
        : html`<span id="${field}-error" class="error">${errors[field]}</span>`;
    return html`
      <form id="signup" novalidate data-intent=${i.Submit}>
        ${FIELDS.map(
          (f) => html`
            <label>
              ${f.label}
              <input
                id=${f.field}
                name=${f.field}
                type=${f.type}
                .value=${live(s.values[f.field])}
                aria-invalid=${errors[f.field] !== undefined}
                data-intent=${i.Edited}
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
            ?checked=${liveBoolean(s.values.terms)}
            aria-invalid=${errors.terms !== undefined}
            data-intent=${i.Agreed}
          />
          I accept the terms
        </label>
        ${error('terms')}
        <button id="submit" type="submit">Sign up</button>
        ${s.success === undefined ? nothing : html`<p id="success">${s.success}</p>`}
      </form>
    `;
  },
});
document.getElementById('app')?.append(new Signup());
