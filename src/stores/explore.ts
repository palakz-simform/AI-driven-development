import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Photo } from './photo'

export interface SearchFilters {
  query: string
  sortBy: 'recent' | 'popular' | 'trending'
  tag?: string
}

export const useExploreStore = defineStore('explore', () => {
  const trendingPhotos = ref<Photo[]>([])
  const searchResults = ref<Photo[]>([])
  const searchFilters = ref<SearchFilters>({
    query: '',
    sortBy: 'recent',
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const hasMore = ref(true)

  const resultCount = computed(() => searchResults.value.length)
  const trendingCount = computed(() => trendingPhotos.value.length)

  function setTrendingPhotos(photos: Photo[]) {
    trendingPhotos.value = photos
  }

  function setSearchResults(photos: Photo[]) {
    searchResults.value = photos
    page.value = 1
    hasMore.value = photos.length > 0
  }

  function appendSearchResults(photos: Photo[]) {
    searchResults.value.push(...photos)
    hasMore.value = photos.length > 0
  }

  function setSearchFilters(filters: Partial<SearchFilters>) {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  function resetSearch() {
    searchResults.value = []
    searchFilters.value = { query: '', sortBy: 'recent' }
    page.value = 1
    hasMore.value = true
  }

  function nextPage() {
    page.value++
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    trendingPhotos,
    searchResults,
    searchFilters,
    loading,
    error,
    page,
    hasMore,
    resultCount,
    trendingCount,
    setTrendingPhotos,
    setSearchResults,
    appendSearchResults,
    setSearchFilters,
    resetSearch,
    nextPage,
    setLoading,
    setError,
  }
})
