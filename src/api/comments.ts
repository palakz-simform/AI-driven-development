import { api } from './index'
import type { Comment, CommentCreatePayload } from '@/stores/comment'
import type { PhotoId } from '@/stores/photo'

const BASE_PATH = '/comments'

const normalizeComment = (comment: Comment): Comment => ({
  ...comment,
  id: String(comment.id),
  photoId: String(comment.photoId),
})

export const commentApi = {
  async getByPhotoId(photoId: PhotoId): Promise<Comment[]> {
    const comments = await api.get<Comment[]>(`${BASE_PATH}?photoId=${photoId}`)
    return comments
      .map(normalizeComment)
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
  },

  async getById(id: string | number): Promise<Comment> {
    const comment = await api.get<Comment>(`${BASE_PATH}/${id}`)
    return normalizeComment(comment)
  },

  async create(photoId: PhotoId, payload: Omit<CommentCreatePayload, 'photoId'>): Promise<Comment> {
    const comment = await api.post<Comment>(BASE_PATH, {
      photoId,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return normalizeComment(comment)
  },

  async update(id: string | number, text: string): Promise<Comment> {
    const comment = await api.patch<Comment>(`${BASE_PATH}/${id}`, {
      text,
      updatedAt: new Date().toISOString(),
    })
    return normalizeComment(comment)
  },

  async delete(id: string | number): Promise<void> {
    return api.delete<void>(`${BASE_PATH}/${id}`)
  },

  async updateLikes(id: string | number, likes: number): Promise<Comment> {
    const comment = await api.patch<Comment>(`${BASE_PATH}/${id}`, { likes })
    return normalizeComment(comment)
  },
}
