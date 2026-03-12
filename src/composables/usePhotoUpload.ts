import { ref, computed } from 'vue'
import { photoApi } from '@/api/photos'
import { usePhotoStore } from '@/stores/photo'

export function usePhotoUpload() {
  const photoStore = usePhotoStore()
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  async function uploadPhoto(
    title: string,
    description: string,
    imageUrl: string,
    userId: number,
    username: string,
    userAvatar: string,
  ) {
    try {
      isUploading.value = true
      uploadError.value = null

      const now = new Date().toISOString()
      const newPhoto = await photoApi.create({
        title,
        description,
        imageUrl,
        userId,
        username,
        userAvatar,
        likes: 0,
        liked: false,
        comments: 0,
        createdAt: now,
        updatedAt: now,
      })

      photoStore.addPhoto(newPhoto)
      return newPhoto
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Upload failed'
      uploadError.value = error
      throw err
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading: computed(() => isUploading.value),
    uploadError: computed(() => uploadError.value),
    uploadPhoto,
  }
}
