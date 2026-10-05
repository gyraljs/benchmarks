// Validation rules for the signup form, shared by every implementation so the benchmark
// compares frameworks, not validation code. No form library is used anywhere.

export type Field = 'email' | 'password' | 'confirm' | 'terms';

export interface SignupValues {
  readonly email: string;
  readonly password: string;
  readonly confirm: string;
  readonly terms: boolean;
}

export type SignupErrors = Partial<Record<Field, string>>;

export const EMPTY_SIGNUP: SignupValues = { email: '', password: '', confirm: '', terms: false };

export function validateSignup(v: SignupValues): SignupErrors {
  const errors: { [K in Field]?: string } = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Enter a valid email address.';
  if (v.password.length < 8 || !/\d/.test(v.password)) {
    errors.password = 'Use at least 8 characters, including a digit.';
  }
  if (v.confirm !== v.password || v.confirm === '') errors.confirm = 'Passwords do not match.';
  if (!v.terms) errors.terms = 'Accept the terms to continue.';
  return errors;
}

export const isValid = (errors: SignupErrors): boolean => Object.keys(errors).length === 0;

export const welcome = (email: string): string => `Welcome, ${email}!`;
