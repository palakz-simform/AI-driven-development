import { ref } from 'vue'
import { photoApi } from '@/api/photos'
import { usePhotoStore } from '@/stores/photo'

export function usePhotoFeed() {
  const photoStore = usePhotoStore()
  const page = ref(1)
  const limit = ref(10)
  const isLoadingMore = ref(false)

  async function loadPhotos() {
    try {
      photoStore.setLoading(true)
      const photos = await photoApi.getAll(page.value, limit.value)
      photoStore.setPhotos(photos)
      photoStore.setError(null)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load photos'
      photoStore.setError(error)
    } finally {
      photoStore.setLoading(false)
    }
  }

  async function loadMorePhotos() {
    try {
      isLoadingMore.value = true
      page.value++
      const photos = await photoApi.getAll(page.value, limit.value)
      if (photos.length > 0) {
        photoStore.photos.push(...photos)
      } else {
        page.value-- // Reset if no more photos
      }
      photoStore.setError(null)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load more photos'
      photoStore.setError(error)
      page.value--
    } finally {
      isLoadingMore.value = false
    }
  }

  async function refreshPhotos() {
    page.value = 1
    await loadPhotos()
  }

  return {
    page,
    limit,
    isLoadingMore,
    loadPhotos,
    loadMorePhotos,
    refreshPhotos,
    photos: photoStore.photos,
    loading: photoStore.loading,
    error: photoStore.error,
  }
}
