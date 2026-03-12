import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  followersCount: number
  followingCount: number
  photosCount: number
  followed: boolean
  createdAt: string
}

export interface CurrentUser {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<CurrentUser | null>(null)
  const userProfiles = ref<Map<number, UserProfile>>(new Map())
  const following = ref<Set<number>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const followingList = computed(() => Array.from(following.value))

  function setCurrentUser(user: CurrentUser | null) {
    currentUser.value = user
  }

  function getUserProfile(userId: number): UserProfile | undefined {
    return userProfiles.value.get(userId)
  }

  function setUserProfile(userId: number, profile: UserProfile) {
    userProfiles.value.set(userId, profile)
  }

  function updateUserProfile(userId: number, updates: Partial<UserProfile>) {
    const profile = userProfiles.value.get(userId)
    if (profile) {
      userProfiles.value.set(userId, { ...profile, ...updates })
    }
  }

  function toggleFollow(userId: number, shouldFollow: boolean) {
    if (shouldFollow) {
      following.value.add(userId)
    } else {
      following.value.delete(userId)
    }

    const profile = userProfiles.value.get(userId)
    if (profile) {
      profile.followed = shouldFollow
      profile.followersCount += shouldFollow ? 1 : -1
    }
  }

  function isFollowing(userId: number): boolean {
    return following.value.has(userId)
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    currentUser,
    userProfiles,
    following,
    loading,
    error,
    isLoggedIn,
    followingList,
    setCurrentUser,
    getUserProfile,
    setUserProfile,
    updateUserProfile,
    toggleFollow,
    isFollowing,
    setLoading,
    setError,
  }
})
