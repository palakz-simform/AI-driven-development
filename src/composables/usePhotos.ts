import { ref } from 'vue'
import { photosApi } from '@/api/photos'
import type { Photo } from '@/stores/photo'

export function usePhotos() {
  const photos = ref<Photo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPhotos() {
    isLoading.value = true
    error.value = null
    try {
      photos.value = await photosApi.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  return { photos, isLoading, error, fetchPhotos }
}
