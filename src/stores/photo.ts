import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Photo {
  id: number
  title: string
  description: string
  imageUrl: string
  userId: number
  username: string
  userAvatar: string
  likes: number
  liked: boolean
  comments: number
  createdAt: string
  updatedAt: string
}

export interface PhotoUploadPayload {
  title: string
  description: string
  imageUrl: string
}

export const usePhotoStore = defineStore('photo', () => {
  const photos = ref<Photo[]>([])
  const userPhotos = ref<Photo[]>([])
  const currentPhoto = ref<Photo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const photoCount = computed(() => photos.value.length)
  const userPhotoCount = computed(() => userPhotos.value.length)

  function setPhotos(newPhotos: Photo[]) {
    photos.value = newPhotos
  }

  function setUserPhotos(newPhotos: Photo[]) {
    userPhotos.value = newPhotos
  }

  function addPhoto(photo: Photo) {
    photos.value.unshift(photo)
  }

  function updatePhoto(id: number, updates: Partial<Photo>) {
    const photoIndex = photos.value.findIndex((p) => p.id === id)
    if (photoIndex !== -1) {
      photos.value[photoIndex] = { ...photos.value[photoIndex], ...updates } as Photo
    }

    const userPhotoIndex = userPhotos.value.findIndex((p) => p.id === id)
    if (userPhotoIndex !== -1) {
      userPhotos.value[userPhotoIndex] = {
        ...userPhotos.value[userPhotoIndex],
        ...updates,
      } as Photo
    }
  }

  function removePhoto(id: number) {
    photos.value = photos.value.filter((p) => p.id !== id)
    userPhotos.value = userPhotos.value.filter((p) => p.id !== id)
  }

  function setCurrentPhoto(photo: Photo | null) {
    currentPhoto.value = photo
  }

  function toggleLike(photoId: number) {
    const photo = photos.value.find((p) => p.id === photoId)
    if (photo) {
      photo.liked = !photo.liked
      photo.likes += photo.liked ? 1 : -1
    }

    const userPhoto = userPhotos.value.find((p) => p.id === photoId)
    if (userPhoto) {
      userPhoto.liked = !userPhoto.liked
      userPhoto.likes += userPhoto.liked ? 1 : -1
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    photos,
    userPhotos,
    currentPhoto,
    loading,
    error,
    photoCount,
    userPhotoCount,
    setPhotos,
    setUserPhotos,
    addPhoto,
    updatePhoto,
    removePhoto,
    setCurrentPhoto,
    toggleLike,
    setLoading,
    setError,
  }
})
