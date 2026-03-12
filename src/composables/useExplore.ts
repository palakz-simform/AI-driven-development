import { ref } from 'vue'
import { photoApi } from '@/api/photos'
import { useExploreStore } from '@/stores/explore'

export function useExplore() {
  const exploreStore = useExploreStore()
  const isLoadingTrending = ref(false)

  async function loadTrending(limit: number = 12) {
    try {
      isLoadingTrending.value = true
      exploreStore.setLoading(true)
      exploreStore.setError(null)

      const photos = await photoApi.getTrending(limit)
      exploreStore.setTrendingPhotos(photos)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load trending'
      exploreStore.setError(error)
    } finally {
      isLoadingTrending.value = false
      exploreStore.setLoading(false)
    }
  }

  async function search(
    query: string,
    sortBy: 'recent' | 'popular' | 'trending' = 'recent',
    page: number = 1,
  ) {
    try {
      exploreStore.setLoading(true)
      exploreStore.setError(null)
      exploreStore.setSearchFilters({ query, sortBy })

      const photos = await photoApi.search(query, sortBy, page, 12)
      if (page === 1) {
        exploreStore.setSearchResults(photos)
      } else {
        exploreStore.appendSearchResults(photos)
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Search failed'
      exploreStore.setError(error)
    } finally {
      exploreStore.setLoading(false)
    }
  }

  async function loadMoreSearch() {
    if (!exploreStore.hasMore) return

    exploreStore.nextPage()
    await search(
      exploreStore.searchFilters.query,
      exploreStore.searchFilters.sortBy,
      exploreStore.page,
    )
  }

  function resetSearch() {
    exploreStore.resetSearch()
  }

  return {
    trendingPhotos: exploreStore.trendingPhotos,
    searchResults: exploreStore.searchResults,
    searchFilters: exploreStore.searchFilters,
    loading: exploreStore.loading,
    error: exploreStore.error,
    hasMore: exploreStore.hasMore,
    isLoadingTrending,
    loadTrending,
    search,
    loadMoreSearch,
    resetSearch,
  }
}
