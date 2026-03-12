import { ref, computed } from 'vue'
import { likeApi } from '@/api/likes'
import { photoApi } from '@/api/photos'
import { usePhotoStore, type PhotoId } from '@/stores/photo'

export function useLike(photoId: PhotoId, currentUserId: number) {
  const photoStore = usePhotoStore()
  const isToggling = ref(false)
  const error = ref<string | null>(null)

  const photo = computed(() => photoStore.photos.find((entry) => entry.id === String(photoId)))
  const isLiked = computed(() => photo.value?.liked ?? false)
  const likeCount = computed(() => photo.value?.likes ?? 0)

  async function toggleLike() {
    if (!photo.value) return

    try {
      isToggling.value = true
      error.value = null

      if (isLiked.value) {
        await likeApi.delete(photoId, currentUserId)
      } else {
        await likeApi.create(photoId, currentUserId)
      }

      photoStore.toggleLike(photoId)
      await photoApi.updateLikes(photoId, likeCount.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update like'
    } finally {
      isToggling.value = false
    }
  }

  return {
    isLiked,
    likeCount,
    isToggling: computed(() => isToggling.value),
    error: computed(() => error.value),
    toggleLike,
  }
}
