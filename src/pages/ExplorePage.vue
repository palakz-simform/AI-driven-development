<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useExplore } from '@/composables/useExplore'
import PhotoCard from '@/components/PhotoCard.vue'
import LikeButton from '@/components/LikeButton.vue'
import { useLike } from '@/composables/useLike'

const currentUserId = 1
const searchQuery = ref('')
const sortBy = ref<'recent' | 'popular' | 'trending'>('recent')
const selectedPhotoId = ref<number | null>(null)

const {
  trendingPhotos,
  searchResults,
  loading,
  hasMore,
  loadTrending,
  search,
  loadMoreSearch,
  resetSearch,
} = useExplore()

onMounted(() => {
  loadTrendingPhotos()
})

const loadTrendingPhotos = async () => {
  await loadTrending(12)
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    resetSearch()
    await loadTrendingPhotos()
    return
  }

  await search(searchQuery.value, sortBy.value, 1)
}

const handleLoadMore = async () => {
  if (searchQuery.value.trim()) {
    await loadMoreSearch()
  } else {
    await loadTrendingPhotos()
  }
}

const currentPhotos = () => {
  return searchQuery.value.trim() ? searchResults : trendingPhotos
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Search Bar -->
    <div class="sticky top-16 bg-white border-b border-gray-200 px-4 py-4 z-30">
      <div class="max-w-7xl mx-auto space-y-4">
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search photos, tags, users..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="handleSearch"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        <!-- Sort Options (visible when searching) -->
        <div v-if="searchQuery.trim()" class="flex gap-2">
          <button
            v-for="option in ['recent', 'popular', 'trending']"
            :key="option"
            @click="sortBy = option as any; handleSearch()"
            :class="[
              'px-4 py-1 rounded-full text-sm font-medium transition-colors',
              sortBy === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <main class="flex-1 px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <h2 class="text-lg font-semibold text-gray-900 mb-6">
          {{ searchQuery.trim() ? `Search results for "${searchQuery}"` : 'Trending Now' }}
        </h2>

        <!-- Loading State -->
        <div v-if="loading && currentPhotos().length === 0" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-4 text-gray-600">Loading photos...</p>
        </div>

        <!-- Photo Grid -->
        <div v-else-if="currentPhotos().length > 0" class="grid gap-6">
          <div
            v-for="photo in currentPhotos()"
            :key="photo.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <PhotoCard :photo="photo" />

            <!-- Interactions Row -->
            <div class="px-4 py-3 border-t border-gray-200 flex items-center gap-4">
              <LikeButton
                :is-liked="photo.liked"
                :count="photo.likes"
                @toggle="useLike(photo.id, currentUserId).toggleLike()"
              />

              <button class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586a1 1 0 00-.707.293l-2.414 2.414z"
                  />
                </svg>
                <span class="text-sm">{{ photo.comments }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-600">
          <p v-if="searchQuery.trim()">No photos found matching your search.</p>
          <p v-else>No trending photos at the moment.</p>
        </div>

        <!-- Load More Button -->
        <div v-if="currentPhotos().length > 0 && hasMore" class="mt-8 text-center">
          <button
            @click="handleLoadMore"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load More
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
