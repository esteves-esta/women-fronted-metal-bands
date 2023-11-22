<script setup lang="ts">
// import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import HomeView from './views/HomeView.vue'
import BandsList from './views/BandsList.vue'
</script>

<template>
  <div class="container">
    <Sidebar class="navigation q-pt-lg" />

    <!-- <RouterView class="main-content q-pt-xl q-pr-xl" /> -->
    <div class="main-content q-pt-xl q-pr-xl">
      <HomeView />
    </div>

  </div>
</template>

<style scoped lang="scss">
.container {
  // width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content: space-around;

  gap: 100px;
  overflow: auto;
  overflow-x: hidden;
}

.navigation {
  flex: 0 1 70px;
}

.main-content {
  height: fit-content;
  flex: 1 1 700px;
}
</style>
