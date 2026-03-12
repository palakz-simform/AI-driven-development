import { api } from './index'

const BASE_PATH = '/likes'

export interface Like {
  id: number
  photoId: number
  userId: number
  createdAt: string
}

export const likeApi = {
  async getPhotoLikes(photoId: number): Promise<Like[]> {
    return api.get<Like[]>(`${BASE_PATH}?photoId=${photoId}`)
  },

  async getUserLikes(userId: number): Promise<Like[]> {
    return api.get<Like[]>(`${BASE_PATH}?userId=${userId}`)
  },

  async hasUserLiked(photoId: number, userId: number): Promise<boolean> {
    const likes = await api.get<Like[]>(
      `${BASE_PATH}?photoId=${photoId}&userId=${userId}`,
    )
    return likes.length > 0
  },

  async create(photoId: number, userId: number): Promise<Like> {
    return api.post<Like>(BASE_PATH, {
      photoId,
      userId,
      createdAt: new Date().toISOString(),
    })
  },

  async delete(photoId: number, userId: number): Promise<void> {
    const likes = await api.get<Like[]>(
      `${BASE_PATH}?photoId=${photoId}&userId=${userId}`,
    )
    if (likes && likes.length > 0) {
      return api.delete<void>(`${BASE_PATH}/${likes[0]!.id}`)
    }
  },
}
