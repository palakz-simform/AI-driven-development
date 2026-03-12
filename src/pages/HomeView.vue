<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePhotoFeed } from '@/composables/usePhotoFeed'
import { usePhotoUpload } from '@/composables/usePhotoUpload'
import PhotoFeedHero from '@/components/PhotoFeedHero.vue'
import PhotoFeedItem from '@/components/PhotoFeedItem.vue'
import PhotoUploadModal from '@/components/PhotoUploadModal.vue'

const currentUserId = 1 // Mock user ID
const showUploadModal = ref(false)
const currentUser = {
  id: currentUserId,
  username: 'john_doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
}

const {
  photos,
  loading,
  error,
  hasMore,
  isLoadingMore,
  isRefreshing,
  loadPhotos,
  loadMorePhotos,
  refreshPhotos,
  retryLoad,
  toggleLike,
  toggleComments,
  addComment,
  deleteComment,
  getPhotoComments,
  isCommentsOpen,
  isCommentsLoading,
  isCommentPosting,
  isLikePending,
  getPhotoError,
} = usePhotoFeed()
const { uploadPhoto, isUploading, uploadError } = usePhotoUpload()

onMounted(() => {
  loadPhotos()
})

const handleUpload = async (data: any) => {
  try {
    await uploadPhoto(
      data.title,
      data.description,
      data.imageUrl,
      currentUser.id,
      currentUser.username,
      currentUser.avatar,
    )

    showUploadModal.value = false
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleLoadMore = async () => {
  await loadMorePhotos()
}

const handleRefresh = async () => {
  await refreshPhotos()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <PhotoFeedHero
        :photo-count="photos.length"
        :is-refreshing="isRefreshing"
        :is-uploading="isUploading"
        @refresh="handleRefresh"
        @upload="showUploadModal = true"
      />

      <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-semibold">Unable to load the photo feed</p>
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            @click="retryLoad"
          >
            Try again
          </button>
        </div>
      </div>

      <div v-if="loading && photos.length === 0" class="grid gap-6">
        <div
          v-for="index in 3"
          :key="index"
          class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="aspect-square animate-pulse bg-slate-200"></div>
          <div class="space-y-3 px-5 py-5">
            <div class="h-4 w-1/3 animate-pulse rounded bg-slate-200"></div>
            <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
            <div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
      </div>

      <div v-else-if="photos.length > 0" class="grid gap-6">
        <PhotoFeedItem
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          :comments="getPhotoComments(photo.id)"
          :is-comments-open="isCommentsOpen(photo.id)"
          :is-comments-loading="isCommentsLoading(photo.id)"
          :is-comment-posting="isCommentPosting(photo.id)"
          :is-like-pending="isLikePending(photo.id)"
          :error="getPhotoError(photo.id)"
          @toggle-like="toggleLike($event, currentUserId)"
          @toggle-comments="toggleComments"
          @post-comment="addComment($event.photoId, $event.text, currentUser)"
          @delete-comment="deleteComment($event.photoId, $event.commentId)"
        />

        <div class="flex justify-center pt-2" v-if="hasMore">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoadingMore"
            @click="handleLoadMore"
          >
            {{ isLoadingMore ? 'Loading more...' : 'Load more photos' }}
          </button>
        </div>
      </div>

      <div
        v-else
        class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"
      >
        <h2 class="text-xl font-semibold text-slate-900">Your feed is ready for its first story</h2>
        <p class="mt-2 text-sm text-slate-600">
          Upload a photo to populate the feed and start engaging with the community.
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          @click="showUploadModal = true"
        >
          Upload your first photo
        </button>
      </div>
    </main>

    <PhotoUploadModal
      :is-open="showUploadModal"
      :is-uploading="isUploading"
      :error="uploadError"
      @close="showUploadModal = false"
      @upload="handleUpload"
    />
  </div>
</template>
