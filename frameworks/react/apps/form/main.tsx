import {
  EMPTY_SIGNUP,
  isValid,
  validateSignup,
  welcome,
  type Field,
  type SignupValues,
} from '@bench/shared/signup';
import { useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

function Signup() {
  const [values, setValues] = useState<SignupValues>(EMPTY_SIGNUP);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState<string | undefined>();

  const errors = submitted ? validateSignup(values) : {};
  const set = (field: Field, value: string | boolean) =>
    setValues((v) => ({ ...v, [field]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (isValid(validateSignup(values))) setSuccess(welcome(values.email));
  };

  const error = (field: Field) =>
    errors[field] === undefined ? null : (
      <span id={`${field}-error`} className="error">
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
          onChange={(e) => set('email', e.target.value)}
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
          onChange={(e) => set('password', e.target.value)}
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
          onChange={(e) => set('confirm', e.target.value)}
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
          onChange={(e) => set('terms', e.target.checked)}
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

createRoot(document.getElementById('app') as HTMLElement).render(<Signup />);
