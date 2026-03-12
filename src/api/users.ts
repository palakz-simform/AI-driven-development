import { api } from './index'
import type { UserProfile, CurrentUser } from '@/stores/user'

const BASE_PATH = '/users'

export const userApi = {
  async getCurrentUser(): Promise<CurrentUser> {
    return api.get<CurrentUser>(`${BASE_PATH}/me`)
  },

  async getById(id: number): Promise<UserProfile> {
    return api.get<UserProfile>(`${BASE_PATH}/${id}`)
  },

  async getByUsername(username: string): Promise<UserProfile | null> {
    const results = await api.get<UserProfile[]>(`${BASE_PATH}?username=${username}`)
    return (results && results.length > 0) ? results[0]! : null
  },

  async search(query: string): Promise<UserProfile[]> {
    return api.get<UserProfile[]>(`${BASE_PATH}?q=${query}`)
  },

  async updateProfile(id: number, updates: Partial<CurrentUser>): Promise<CurrentUser> {
    return api.patch<CurrentUser>(`${BASE_PATH}/${id}`, updates)
  },

  async follow(userId: number): Promise<void> {
    return api.post<void>(`${BASE_PATH}/${userId}/follow`, {})
  },

  async unfollow(userId: number): Promise<void> {
    return api.post<void>(`${BASE_PATH}/${userId}/unfollow`, {})
  },

  async getFollowers(userId: number): Promise<UserProfile[]> {
    return api.get<UserProfile[]>(`${BASE_PATH}/${userId}/followers`)
  },

  async getFollowing(userId: number): Promise<UserProfile[]> {
    return api.get<UserProfile[]>(`${BASE_PATH}/${userId}/following`)
  },
}
