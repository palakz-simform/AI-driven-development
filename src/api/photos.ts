import { api } from './index'
import type { Photo } from '@/stores/photo'

export const photosApi = {
  getAll: () => api.get<Photo[]>('/photos'),
  getById: (id: number) => api.get<Photo>(`/photos/${id}`),
  create: (photo: Omit<Photo, 'id'>) => api.post<Photo>('/photos', photo),
  update: (id: number, photo: Partial<Photo>) => api.patch<Photo>(`/photos/${id}`, photo),
  remove: (id: number) => api.delete<void>(`/photos/${id}`),
}
