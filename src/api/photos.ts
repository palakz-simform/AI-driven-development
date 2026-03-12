import { api } from './index'
import type { Photo, PhotoUploadPayload } from '@/stores/photo'

const BASE_PATH = '/photos'

export const photoApi = {
  async getAll(page: number = 1, limit: number = 10): Promise<Photo[]> {
    const skip = (page - 1) * limit
    return api.get<Photo[]>(
      `${BASE_PATH}?_sort=-createdAt&_start=${skip}&_limit=${limit}`,
    )
  },

  async getById(id: number): Promise<Photo> {
    return api.get<Photo>(`${BASE_PATH}/${id}`)
  },

  async getTrending(limit: number = 12): Promise<Photo[]> {
    return api.get<Photo[]>(
      `${BASE_PATH}?_sort=-likes,-comments&_limit=${limit}`,
    )
  },

  async getByUserId(userId: number, page: number = 1, limit: number = 10): Promise<Photo[]> {
    const skip = (page - 1) * limit
    return api.get<Photo[]>(
      `${BASE_PATH}?userId=${userId}&_sort=-createdAt&_start=${skip}&_limit=${limit}`,
    )
  },

  async search(
    query: string,
    sortBy: 'recent' | 'popular' | 'trending' = 'recent',
    page: number = 1,
    limit: number = 10,
  ): Promise<Photo[]> {
    const skip = (page - 1) * limit
    const sortField =
      sortBy === 'popular' ? '-likes' : sortBy === 'trending' ? '-comments' : '-createdAt'
    return api.get<Photo[]>(
      `${BASE_PATH}?q=${query}&_sort=${sortField}&_start=${skip}&_limit=${limit}`,
    )
  },

  async create(payload: PhotoUploadPayload): Promise<Photo> {
    return api.post<Photo>(BASE_PATH, payload)
  },

  async update(id: number, payload: Partial<PhotoUploadPayload>): Promise<Photo> {
    return api.patch<Photo>(`${BASE_PATH}/${id}`, payload)
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`${BASE_PATH}/${id}`)
  },

  async updateLikes(id: number, likes: number): Promise<Photo> {
    return api.patch<Photo>(`${BASE_PATH}/${id}`, { likes })
  },

  async updateCommentCount(id: number, comments: number): Promise<Photo> {
    return api.patch<Photo>(`${BASE_PATH}/${id}`, { comments })
  },
}

export const photosApi = photoApi
