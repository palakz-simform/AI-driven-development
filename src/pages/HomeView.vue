<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePhotoFeed } from '@/composables/usePhotoFeed'
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import { useLike } from '@/composables/useLike'
import { useComments } from '@/composables/useComments'
import PhotoCard from '@/components/PhotoCard.vue'
import PhotoUploadModal from '@/components/PhotoUploadModal.vue'
import CommentSection from '@/components/CommentSection.vue'
import LikeButton from '@/components/LikeButton.vue'

const currentUserId = 1 // Mock user ID
const showUploadModal = ref(false)
const selectedPhotoId = ref<number | null>(null)

const { photos, loading, loadPhotos, loadMorePhotos } = usePhotoFeed()
const { uploadPhoto, isUploading } = usePhotoUpload()

onMounted(() => {
  loadPhotos()
})

const handlePhotoClick = (photoId: number) => {
  selectedPhotoId.value = photoId
}

const handleUpload = async (data: any) => {
  try {
    const currentUser = {
      id: currentUserId,
      username: 'John Doe',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    }

    await uploadPhoto(
      data.title,
      data.description,
      data.imageUrl,
      currentUser.id,
      currentUser.username,
      currentUser.userAvatar,
    )

    showUploadModal.value = false
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleLoadMore = async () => {
  await loadMorePhotos()
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Action Bar -->
    <div class="sticky top-16 bg-white border-b border-gray-200 px-4 py-4 z-30">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Your Feed</h2>
        <button
          @click="showUploadModal = true"
          class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Photo
        </button>
      </div>
    </div>

    <!-- Feed -->
    <main class="flex-1 px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading && photos.length === 0" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-4 text-gray-600">Loading photos...</p>
        </div>

        <!-- Photo Grid -->
        <div v-else-if="photos.length > 0" class="grid gap-6">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <PhotoCard :photo="photo" @view="handlePhotoClick(photo.id)" />

            <!-- Interactions Row -->
            <div class="px-4 py-3 border-t border-gray-200 flex items-center gap-4">
              <LikeButton
                :is-liked="photo.liked"
                :count="photo.likes"
                @toggle="useLike(photo.id, currentUserId).toggleLike()"
              />

              <button
                @click="selectedPhotoId = photo.id"
                class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
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

            <!-- Comments Section -->
            <div
              v-if="selectedPhotoId === photo.id"
              class="px-4 py-4 border-t border-gray-200 bg-gray-50"
            >
              <CommentSection
                :comments="useComments(photo.id).comments.value"
                :is-loading="useComments(photo.id).isLoading.value"
                :is-posting="useComments(photo.id).isPosting.value"
                :error="useComments(photo.id).error.value"
                @load-comments="useComments(photo.id).loadComments()"
                @post-comment="(data: any) => useComments(photo.id).addComment(data.text, currentUserId, 'You', 'https://api.dicebear.com/7.x/avataaars/svg?seed=1')"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600">No photos yet. Start following people or upload your own!</p>
        </div>

        <!-- Load More Button -->
        <div v-if="photos.length > 0" class="mt-8 text-center">
          <button
            @click="handleLoadMore"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load More
          </button>
        </div>
      </div>
    </main>

    <!-- Upload Modal -->
    <PhotoUploadModal
      :is-open="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleUpload"
    />
  </div>
</template>
