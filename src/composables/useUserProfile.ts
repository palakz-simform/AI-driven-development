import { ref, computed } from 'vue'
import { userApi } from '@/api/users'
import { photoApi } from '@/api/photos'
import { useUserStore } from '@/stores/user'

export function useUserProfile(userId: number) {
  const userStore = useUserStore()
  const userPhotos = ref<any[]>([])
  const isLoading = ref(false)
  const isFollowingToggling = ref(false)
  const error = ref<string | null>(null)

  const profile = computed(() => userStore.getUserProfile(userId))
  const isFollowing = computed(() => userStore.isFollowing(userId))

  async function loadProfile() {
    try {
      isLoading.value = true
      error.value = null

      const profileData = await userApi.getById(userId)
      userStore.setUserProfile(userId, profileData)

      const photos = await photoApi.getByUserId(userId, 1, 12)
      userPhotos.value = photos
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load profile'
    } finally {
      isLoading.value = false
    }
  }

  async function toggleFollow() {
    if (!profile.value) return

    try {
      isFollowingToggling.value = true
      error.value = null

      if (isFollowing.value) {
        await userApi.unfollow(userId)
        userStore.toggleFollow(userId, false)
      } else {
        await userApi.follow(userId)
        userStore.toggleFollow(userId, true)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update follow'
    } finally {
      isFollowingToggling.value = false
    }
  }

  return {
    profile,
    userPhotos,
    isFollowing,
    isLoading: computed(() => isLoading.value),
    isFollowingToggling: computed(() => isFollowingToggling.value),
    error: computed(() => error.value),
    loadProfile,
    toggleFollow,
  }
}
