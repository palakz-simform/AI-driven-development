<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  isAuthenticated?: boolean
}

withDefaults(defineProps<Props>(), {
  isAuthenticated: false,
})

const router = useRouter()
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Explore', path: '/explore', icon: 'compass' },
  { label: 'Profile', path: '/profile', icon: 'user', requiresAuth: true },
]

const goToPage = (path: string) => {
  router.push(path)
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 bg-white shadow-sm z-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 font-bold text-xl text-gray-900">
          <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          PhotoShare
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            v-slot="{ isActive }"
            :to="item.path"
          >
            <a
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              {{ item.label }}
            </a>
          </router-link>
        </div>

        <!-- Desktop Action Button -->
        <button
          v-if="isAuthenticated"
          @click="$router.push('/upload')"
          class="hidden md:inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload
        </button>

        <!-- Mobile Menu Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 py-4 space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          @click="isMobileMenuOpen = false"
        >
          {{ item.label }}
        </router-link>
        <button
          v-if="isAuthenticated"
          @click="goToPage('/upload')"
          class="w-full text-left px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Upload Photo
        </button>
      </div>
    </div>
  </nav>
</template>
