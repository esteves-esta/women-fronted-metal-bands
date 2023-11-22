<script setup lang="ts">
// import { storeToRefs } from 'pinia'

// import { useCounterStore } from '@/stores/counter'
// const store = useCounterStore()
// const { count, doubleCount } = storeToRefs(store)
// const { increment } = store
</script>

<template>
  <main class="row q-col-gutter-md">
    <div class="col-3">
      <q-img 
      src="../assets/images/jinjer.png" 
      alt="Tatiana Shmailyuk (from ucranian band Jinjer)" 
      fit="fill"
      class="q-mb-md"
        style="max-width: 250px" />
      <p class="text-caption">Image: Tatiana Shmailyuk (Jinjer)</p>
    </div>

    <div class="col text-justify">
      <h2 class="title1">Women frontend </h2>
      <h3 class="title2 q-mb-xl">metal bands</h3>

      <p class="text-h5"> This is a tiny project to compile a list of metal / hard rock bands that have women as lead
        vocalists.</p>
      <p class="text-body1">This project started when I realized that most metal/rock band that I usually listened mostly
        had man as lead vocalist. And I just got interessed in find and looking for band where with women as lead
        vocalist, and specially where said vocalist isn’t just doing the melodic parts but doing lots of growling. </p>
      <p class="text-body2">So I decided to make this page to compile the bands that I found and also pratice my frontend
        skills. I didn’t add genres of the bands as some don’t have it on there websites and a lot of bands change with
        time, so instead of genre you can filter bands by how much growling the singer can / usually do on the songs of
        the band.</p>

      <p class="text-caption">Note: This is an ongoing project, so there probaly is going to be missing some bands.</p>
    </div>

   
  </main>
</template>
