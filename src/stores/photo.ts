import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type PhotoId = string

export interface Photo {
  id: PhotoId
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
  userId: number
  username: string
  userAvatar: string
  likes: number
  liked: boolean
  comments: number
  createdAt: string
  updatedAt: string
}

const isSamePhotoId = (left: string | number, right: string | number) => String(left) === String(right)

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

  function appendPhotos(newPhotos: Photo[]) {
    const existingIds = new Set(photos.value.map((photo) => photo.id))
    const uniquePhotos = newPhotos.filter((photo) => !existingIds.has(photo.id))
    photos.value.push(...uniquePhotos)
  }

  function setUserPhotos(newPhotos: Photo[]) {
    userPhotos.value = newPhotos
  }

  function addPhoto(photo: Photo) {
    photos.value.unshift(photo)
  }

  function updatePhoto(id: string | number, updates: Partial<Photo>) {
    const photoIndex = photos.value.findIndex((photo) => isSamePhotoId(photo.id, id))
    if (photoIndex !== -1) {
      photos.value[photoIndex] = { ...photos.value[photoIndex], ...updates } as Photo
    }

    const userPhotoIndex = userPhotos.value.findIndex((photo) => isSamePhotoId(photo.id, id))
    if (userPhotoIndex !== -1) {
      userPhotos.value[userPhotoIndex] = {
        ...userPhotos.value[userPhotoIndex],
        ...updates,
      } as Photo
    }
  }

  function removePhoto(id: string | number) {
    photos.value = photos.value.filter((photo) => !isSamePhotoId(photo.id, id))
    userPhotos.value = userPhotos.value.filter((photo) => !isSamePhotoId(photo.id, id))
  }

  function setCurrentPhoto(photo: Photo | null) {
    currentPhoto.value = photo
  }

  function toggleLike(photoId: string | number) {
    const photo = photos.value.find((entry) => isSamePhotoId(entry.id, photoId))
    if (photo) {
      photo.liked = !photo.liked
      photo.likes += photo.liked ? 1 : -1
    }

    const userPhoto = userPhotos.value.find((entry) => isSamePhotoId(entry.id, photoId))
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
    appendPhotos,
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
