<script lang="ts">
  import { isValid, validateSignup, welcome, type Field } from '@bench/shared/signup';

  const values = $state({ email: '', password: '', confirm: '', terms: false });
  let submitted = $state(false);
  let success = $state<string>();

  const errors = $derived(submitted ? validateSignup(values) : {});
  const FIELDS: readonly { field: Exclude<Field, 'terms'>; label: string; type: string }[] = [
    { field: 'email', label: 'Email', type: 'email' },
    { field: 'password', label: 'Password', type: 'password' },
    { field: 'confirm', label: 'Confirm password', type: 'password' },
  ];

  function submit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    if (isValid(validateSignup(values))) success = welcome(values.email);
  }
</script>

<form id="signup" novalidate onsubmit={submit}>
  {#each FIELDS as f (f.field)}
    <label>
      {f.label}
      <input
        id={f.field}
        name={f.field}
        type={f.type}
        bind:value={values[f.field]}
        aria-invalid={errors[f.field] !== undefined}
      />
    </label>
    {#if errors[f.field]}
      <span id="{f.field}-error" class="error">{errors[f.field]}</span>
    {/if}
  {/each}
  <label>
    <input
      id="terms"
      name="terms"
      type="checkbox"
      bind:checked={values.terms}
      aria-invalid={errors.terms !== undefined}
    />
    I accept the terms
  </label>
  {#if errors.terms}
    <span id="terms-error" class="error">{errors.terms}</span>
  {/if}
  <button id="submit" type="submit">Sign up</button>
  {#if success}
    <p id="success">{success}</p>
  {/if}
</form>
