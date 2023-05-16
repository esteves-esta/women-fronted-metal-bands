<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useCounterStore } from '@/stores/counter'
import TheWelcome from '../components/TheWelcome.vue'

const store = useCounterStore()
const { count, doubleCount } = storeToRefs(store)
const { increment } = store
</script>

<template>
  <main>
    <h1>
      {{ doubleCount }} - {{ count }}
    </h1>
    <button @click="increment">
      increment 
    </button>
    <TheWelcome />
  </main>
</template>
