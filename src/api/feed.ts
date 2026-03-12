import { api } from './index'
import type { Photo } from '@/stores/photo'

type PhotoRecord = Omit<Partial<Photo>, 'id' | 'userId' | 'likes' | 'comments'> & {
  id?: string | number
  userId?: string | number
  likes?: string | number
  comments?: string | number
}

export interface PhotoFeedResponse {
  items: Photo[]
  hasMore: boolean
  total: number
}

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=800&auto=format&fit=crop'
const FALLBACK_AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'

const normalizeNumber = (value: string | number | undefined, fallback: number) => {
  const normalized = Number(value)
  return Number.isFinite(normalized) ? normalized : fallback
}

export function normalizePhoto(record: PhotoRecord): Photo {
  const now = new Date().toISOString()

  return {
    id: String(record.id ?? crypto.randomUUID()),
    title: record.title?.trim() || 'Untitled photo',
    description: record.description?.trim() || 'No description added yet.',
    imageUrl: record.imageUrl?.trim() || FALLBACK_IMAGE_URL,
    userId: normalizeNumber(record.userId, 0),
    username: record.username?.trim() || 'Unknown photographer',
    userAvatar: record.userAvatar?.trim() || FALLBACK_AVATAR_URL,
    likes: normalizeNumber(record.likes, 0),
    liked: Boolean(record.liked),
    comments: normalizeNumber(record.comments, 0),
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || record.createdAt || now,
  }
}

const sortByNewest = (left: Photo, right: Photo) => {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
}

export const feedApi = {
  async getPhotoFeed(page: number = 1, limit: number = 6): Promise<PhotoFeedResponse> {
    const allPhotos = await api.get<PhotoRecord[]>('/photos')
    const normalizedPhotos = allPhotos.map(normalizePhoto).sort(sortByNewest)
    const start = Math.max(0, (page - 1) * limit)
    const end = start + limit

    return {
      items: normalizedPhotos.slice(start, end),
      hasMore: end < normalizedPhotos.length,
      total: normalizedPhotos.length,
    }
  },
}