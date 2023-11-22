<script setup lang="ts">
// import { RouterLink } from 'vue-router'
</script>


<template>
  <div class="sidebar">
    <nav class="column q-col-gutter-md">
      <a class="col" to="/">
        <q-icon name="eva-home-outline" size="1.5em" />
      </a>

      <a class="col" to="/about">
        <q-icon name="eva-alert-circle-outline" size="1.5em" />

      </a>
    </nav>
  </div>
</template>

<style scoped lang="scss">
// nav a:first-of-type {
//   border: 0;
// }

// nav a.router-link-exact-active:hover {
//   background-color: transparent;
// }

// nav a.router-link-exact-active {
//   color: var(--color-text);
// }

.sidebar {
  background: linear-gradient(180deg, #583515 0%, rgba(0, 0, 0, 0) 100%);
  font-size: 12px;
  text-align: center;
}

// nav a {
//   display: inline-block;
//   padding: 0 1rem;
//   border-left: 1px solid var(--color-border);
// }

// .column-equal-width {
//   .column>div {
//     padding: 10px 15px;
//   }

//   .column+.column {
//     margin-top: 1rem
//   }
// }
</style>