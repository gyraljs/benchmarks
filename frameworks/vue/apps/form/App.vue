<script setup lang="ts">
import { isValid, validateSignup, welcome, type Field } from '@bench/shared/signup';
import { computed, reactive, ref } from 'vue';

const values = reactive({ email: '', password: '', confirm: '', terms: false });
const submitted = ref(false);
const success = ref<string>();

const errors = computed(() => (submitted.value ? validateSignup(values) : {}));
const FIELDS: readonly { field: Exclude<Field, 'terms'>; label: string; type: string }[] = [
  { field: 'email', label: 'Email', type: 'email' },
  { field: 'password', label: 'Password', type: 'password' },
  { field: 'confirm', label: 'Confirm password', type: 'password' },
];

function submit() {
  submitted.value = true;
  if (isValid(validateSignup(values))) success.value = welcome(values.email);
}
</script>

<template>
  <form id="signup" novalidate @submit.prevent="submit">
    <template v-for="f in FIELDS" :key="f.field">
      <label>
        {{ f.label }}
        <input
          :id="f.field"
          v-model="values[f.field]"
          :name="f.field"
          :type="f.type"
          :aria-invalid="errors[f.field] !== undefined"
        />
      </label>
      <span v-if="errors[f.field]" :id="`${f.field}-error`" class="error">
        {{ errors[f.field] }}
      </span>
    </template>
    <label>
      <input
        id="terms"
        v-model="values.terms"
        name="terms"
        type="checkbox"
        :aria-invalid="errors.terms !== undefined"
      />
      I accept the terms
    </label>
    <span v-if="errors.terms" id="terms-error" class="error">{{ errors.terms }}</span>
    <button id="submit" type="submit">Sign up</button>
    <p v-if="success" id="success">{{ success }}</p>
  </form>
</template>
