import { defineStore } from 'pinia'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [] as Photo[],
  }),
  actions: {
    setPhotos(photos: Photo[]) {
      this.photos = photos
    },
  },
})

export interface Photo {
  id: number
  title: string
  url: string
  userId: number
  createdAt: string
}
