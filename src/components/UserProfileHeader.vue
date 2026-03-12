<script setup lang="ts">
import type { UserProfile } from '@/stores/user'

interface Props {
  profile: UserProfile | undefined
  isLoading: boolean
  isFollowing: boolean
  isFollowingToggling: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'toggle-follow': []
}>()
</script>

<template>
  <div>
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="profile" class="space-y-6">
      <!-- Profile Header -->
      <div class="flex flex-col items-center text-center gap-4">
        <img
          :src="profile.avatar"
          :alt="profile.username"
          class="h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ profile.username }}</h1>
          <p class="text-gray-600">@{{ profile.username }}</p>
          <p class="mt-2 text-gray-700 max-w-md mx-auto">{{ profile.bio }}</p>
        </div>

        <!-- Follow Button -->
        <button
          @click="$emit('toggle-follow')"
          :disabled="isFollowingToggling"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50',
            isFollowing
              ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600',
          ]"
        >
          {{ isFollowing ? 'Following' : 'Follow' }}
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 border-t border-b border-gray-200 py-4">
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ profile.photosCount }}</p>
          <p class="text-sm text-gray-600">Photos</p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ profile.followersCount }}</p>
          <p class="text-sm text-gray-600">Followers</p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-gray-900">{{ profile.followingCount }}</p>
          <p class="text-sm text-gray-600">Following</p>
        </div>
      </div>
    </div>
  </div>
</template>
