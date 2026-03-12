import { api } from './index'
import type { Photo, PhotoUploadPayload } from '@/stores/photo'
import { normalizePhoto } from './feed'

const BASE_PATH = '/photos'

export const photoApi = {
  async getAll(page: number = 1, limit: number = 10): Promise<Photo[]> {
    const photos = await api.get<Photo[]>(BASE_PATH)
    const normalizedPhotos = photos.map(normalizePhoto).sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    })
    const start = Math.max(0, (page - 1) * limit)
    return normalizedPhotos.slice(start, start + limit)
  },

  async getById(id: string | number): Promise<Photo> {
    const photo = await api.get<Photo>(`${BASE_PATH}/${id}`)
    return normalizePhoto(photo)
  },

  async getTrending(limit: number = 12): Promise<Photo[]> {
    const photos = await api.get<Photo[]>(BASE_PATH)
    return photos
      .map(normalizePhoto)
      .sort((left, right) => {
        const engagementDelta = right.likes + right.comments - (left.likes + left.comments)
        if (engagementDelta !== 0) {
          return engagementDelta
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      })
      .slice(0, limit)
  },

  async getByUserId(userId: number, page: number = 1, limit: number = 10): Promise<Photo[]> {
    const photos = await api.get<Photo[]>(`${BASE_PATH}?userId=${userId}`)
    const normalizedPhotos = photos.map(normalizePhoto).sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    })
    const start = Math.max(0, (page - 1) * limit)
    return normalizedPhotos.slice(start, start + limit)
  },

  async search(
    query: string,
    sortBy: 'recent' | 'popular' | 'trending' = 'recent',
    page: number = 1,
    limit: number = 10,
  ): Promise<Photo[]> {
    const normalizedQuery = query.trim().toLowerCase()
    const photos = (await api.get<Photo[]>(BASE_PATH))
      .map(normalizePhoto)
      .filter((photo) => {
        const haystack = [photo.title, photo.description, photo.username].join(' ').toLowerCase()
        return haystack.includes(normalizedQuery)
      })
      .sort((left, right) => {
        if (sortBy === 'popular') {
          return right.likes - left.likes
        }

        if (sortBy === 'trending') {
          return right.comments - left.comments
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      })

    const start = Math.max(0, (page - 1) * limit)
    return photos.slice(start, start + limit)
  },

  async create(payload: PhotoUploadPayload): Promise<Photo> {
    const photo = await api.post<Photo>(BASE_PATH, payload)
    return normalizePhoto(photo)
  },

  async update(id: string | number, payload: Partial<PhotoUploadPayload>): Promise<Photo> {
    const photo = await api.patch<Photo>(`${BASE_PATH}/${id}`, payload)
    return normalizePhoto(photo)
  },

  async delete(id: string | number): Promise<void> {
    return api.delete<void>(`${BASE_PATH}/${id}`)
  },

  async updateLikes(id: string | number, likes: number): Promise<Photo> {
    const photo = await api.patch<Photo>(`${BASE_PATH}/${id}`, { likes })
    return normalizePhoto(photo)
  },

  async updateCommentCount(id: string | number, comments: number): Promise<Photo> {
    const photo = await api.patch<Photo>(`${BASE_PATH}/${id}`, { comments })
    return normalizePhoto(photo)
  },
}

export const photosApi = photoApi
