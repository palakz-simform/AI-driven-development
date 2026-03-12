<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserProfile } from '@/composables/useUserProfile'
import UserProfileHeader from '@/components/UserProfileHeader.vue'
import PhotoCard from '@/components/PhotoCard.vue'
import LikeButton from '@/components/LikeButton.vue'
import { useLike } from '@/composables/useLike'

const route = useRoute()
const userId = parseInt(route.params.id as string) || 1
const currentUserId = 1

const { profile, userPhotos, isLoading, isFollowing, toggleFollow, loadProfile } =
  useUserProfile(userId)

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Profile Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <UserProfileHeader
          :profile="profile"
          :is-loading="isLoading"
          :is-following="isFollowing"
          :is-following-toggling="false"
          @toggle-follow="toggleFollow"
        />
      </div>
    </div>

    <!-- Photos Section -->
    <main class="flex-1 px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Photos</h3>

        <!-- Loading State -->
        <div v-if="isLoading && userPhotos.length === 0" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Photo Grid -->
        <div v-else-if="userPhotos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="photo in userPhotos"
            :key="photo.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <PhotoCard :photo="photo" />

            <!-- Interactions Row -->
            <div class="px-4 py-3 border-t border-gray-200 flex items-center gap-4">
              <LikeButton
                :is-liked="photo.liked"
                :count="photo.likes"
                @toggle="useLike(photo.id, currentUserId).toggleLike()"
              />

              <button class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586a1 1 0 00-.707.293l-2.414 2.414z"
                  />
                </svg>
                <span class="text-sm">{{ photo.comments }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-600">
          <p>No photos yet.</p>
        </div>
      </div>
    </main>
  </div>
</template>
