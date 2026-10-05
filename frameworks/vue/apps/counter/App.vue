<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <button id="dec" type="button" @click="count--">-</button>
  <output id="count">{{ count }}</output>
  <button id="inc" type="button" @click="count++">+</button>
</template>
