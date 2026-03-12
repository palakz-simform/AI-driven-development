import { api } from './index'
import type { PhotoId } from '@/stores/photo'

const BASE_PATH = '/likes'

export interface Like {
  id: string
  photoId: PhotoId
  userId: number
  createdAt: string
}

const normalizeLike = (like: Like): Like => ({
  ...like,
  id: String(like.id),
  photoId: String(like.photoId),
})

export const likeApi = {
  async getPhotoLikes(photoId: PhotoId): Promise<Like[]> {
    const likes = await api.get<Like[]>(`${BASE_PATH}?photoId=${photoId}`)
    return likes.map(normalizeLike)
  },

  async getUserLikes(userId: number): Promise<Like[]> {
    const likes = await api.get<Like[]>(`${BASE_PATH}?userId=${userId}`)
    return likes.map(normalizeLike)
  },

  async hasUserLiked(photoId: PhotoId, userId: number): Promise<boolean> {
    const likes = await api.get<Like[]>(
      `${BASE_PATH}?photoId=${photoId}&userId=${userId}`,
    )
    return likes.length > 0
  },

  async create(photoId: PhotoId, userId: number): Promise<Like> {
    const like = await api.post<Like>(BASE_PATH, {
      photoId,
      userId,
      createdAt: new Date().toISOString(),
    })
    return normalizeLike(like)
  },

  async delete(photoId: PhotoId, userId: number): Promise<void> {
    const likes = await api.get<Like[]>(
      `${BASE_PATH}?photoId=${photoId}&userId=${userId}`,
    )
    if (likes && likes.length > 0) {
      return api.delete<void>(`${BASE_PATH}/${likes[0]!.id}`)
    }
  },
}
