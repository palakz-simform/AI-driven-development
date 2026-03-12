import { api } from './index'
import type { Comment, CommentCreatePayload } from '@/stores/comment'

const BASE_PATH = '/comments'

export const commentApi = {
  async getByPhotoId(photoId: number): Promise<Comment[]> {
    return api.get<Comment[]>(`${BASE_PATH}?photoId=${photoId}&_sort=-createdAt`)
  },

  async getById(id: number): Promise<Comment> {
    return api.get<Comment>(`${BASE_PATH}/${id}`)
  },

  async create(photoId: number, payload: Omit<CommentCreatePayload, 'photoId'>): Promise<Comment> {
    return api.post<Comment>(BASE_PATH, {
      photoId,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  async update(id: number, text: string): Promise<Comment> {
    return api.patch<Comment>(`${BASE_PATH}/${id}`, {
      text,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`${BASE_PATH}/${id}`)
  },

  async updateLikes(id: number, likes: number): Promise<Comment> {
    return api.patch<Comment>(`${BASE_PATH}/${id}`, { likes })
  },
}
