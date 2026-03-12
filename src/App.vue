<script setup lang="ts">
import { ref } from 'vue'
import Navigation from '@/components/Navigation.vue'

const isAuthenticated = ref(true)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation :is-authenticated="isAuthenticated" />
    <main class="pt-0">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:deep(html, body) {
  margin: 0;
  padding: 0;
}
</style>
