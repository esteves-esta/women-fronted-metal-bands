import { ref, computed, /* Ref */ } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // variables
  const count = ref(0) //as Ref<number | null>
  
  // getters
  const doubleCount = computed(() => count.value * 2)
  
  // actions
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
