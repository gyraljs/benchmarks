import { isValid, validateSignup, welcome, type Field } from '@bench/shared/signup';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

const FIELDS: readonly { field: Exclude<Field, 'terms'>; label: string; type: string }[] = [
  { field: 'email', label: 'Email', type: 'email' },
  { field: 'password', label: 'Password', type: 'password' },
  { field: 'confirm', label: 'Confirm password', type: 'password' },
];

function Signup() {
  const [values, setValues] = createStore({ email: '', password: '', confirm: '', terms: false });
  const [submitted, setSubmitted] = createSignal(false);
  const [success, setSuccess] = createSignal<string>();

  const errors = createMemo(() => (submitted() ? validateSignup(values) : {}));

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (isValid(validateSignup(values))) setSuccess(welcome(values.email));
  };

  return (
    <form id="signup" novalidate onSubmit={submit}>
      <For each={FIELDS}>
        {(f) => (
          <>
            <label>
              {f.label}
              <input
                id={f.field}
                name={f.field}
                type={f.type}
                value={values[f.field]}
                aria-invalid={errors()[f.field] !== undefined}
                onInput={(e) => setValues(f.field, e.currentTarget.value)}
              />
            </label>
            <Show when={errors()[f.field]}>
              {(message) => (
                <span id={`${f.field}-error`} class="error">
                  {message()}
                </span>
              )}
            </Show>
          </>
        )}
      </For>
      <label>
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={values.terms}
          aria-invalid={errors().terms !== undefined}
          onChange={(e) => setValues('terms', e.currentTarget.checked)}
        />
        I accept the terms
      </label>
      <Show when={errors().terms}>
        {(message) => (
          <span id="terms-error" class="error">
            {message()}
          </span>
        )}
      </Show>
      <button id="submit" type="submit">
        Sign up
      </button>
      <Show when={success()}>{(text) => <p id="success">{text()}</p>}</Show>
    </form>
  );
}

render(() => <Signup />, document.getElementById('app') as HTMLElement);
