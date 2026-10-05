import {
  EMPTY_SIGNUP,
  isValid,
  validateSignup,
  welcome,
  type Field,
  type SignupValues,
} from '@bench/shared/signup';
import { render } from 'preact';
import { useState } from 'preact/hooks';

function Signup() {
  const [values, setValues] = useState<SignupValues>(EMPTY_SIGNUP);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState<string | undefined>();

  const errors = submitted ? validateSignup(values) : {};
  const set = (field: Field, value: string | boolean) =>
    setValues((v) => ({ ...v, [field]: value }));

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (isValid(validateSignup(values))) setSuccess(welcome(values.email));
  };

  const error = (field: Field) =>
    errors[field] === undefined ? null : (
      <span id={`${field}-error`} class="error">
        {errors[field]}
      </span>
    );

  return (
    <form id="signup" noValidate onSubmit={submit}>
      <label>
        Email
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          aria-invalid={errors.email !== undefined}
          onInput={(e) => set('email', e.currentTarget.value)}
        />
      </label>
      {error('email')}
      <label>
        Password
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          aria-invalid={errors.password !== undefined}
          onInput={(e) => set('password', e.currentTarget.value)}
        />
      </label>
      {error('password')}
      <label>
        Confirm password
        <input
          id="confirm"
          name="confirm"
          type="password"
          value={values.confirm}
          aria-invalid={errors.confirm !== undefined}
          onInput={(e) => set('confirm', e.currentTarget.value)}
        />
      </label>
      {error('confirm')}
      <label>
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={values.terms}
          aria-invalid={errors.terms !== undefined}
          onChange={(e) => set('terms', e.currentTarget.checked)}
        />
        I accept the terms
      </label>
      {error('terms')}
      <button id="submit" type="submit">
        Sign up
      </button>
      {success === undefined ? null : <p id="success">{success}</p>}
    </form>
  );
}

render(<Signup />, document.getElementById('app') as HTMLElement);
