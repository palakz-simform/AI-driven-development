<script setup lang="ts">
import CommentSection from '@/components/CommentSection.vue'
import LikeButton from '@/components/LikeButton.vue'
import PhotoCard from '@/components/PhotoCard.vue'
import type { Comment, CommentId } from '@/stores/comment'
import type { Photo, PhotoId } from '@/stores/photo'

interface Props {
  photo: Photo
  comments: Comment[]
  isCommentsOpen: boolean
  isCommentsLoading: boolean
  isCommentPosting: boolean
  isLikePending: boolean
  error: string | null
}

defineProps<Props>()

defineEmits<{
  'toggle-like': [photoId: PhotoId]
  'toggle-comments': [photoId: PhotoId]
  'post-comment': [{ photoId: PhotoId; text: string }]
  'delete-comment': [{ photoId: PhotoId; commentId: CommentId }]
}>()
</script>

<template>
  <article class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
    <PhotoCard :photo="photo" @view="$emit('toggle-comments', photo.id)" />

    <div class="flex flex-wrap items-center gap-3 border-t border-slate-200 px-5 py-4">
      <LikeButton
        :is-liked="photo.liked"
        :count="photo.likes"
        :is-loading="isLikePending"
        @toggle="$emit('toggle-like', photo.id)"
      />

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
        @click="$emit('toggle-comments', photo.id)"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586a1 1 0 00-.707.293l-2.414 2.414z"
          />
        </svg>
        <span>{{ isCommentsOpen ? 'Hide comments' : 'Show comments' }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {{ photo.comments }}
        </span>
      </button>
    </div>

    <div v-if="error" class="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="isCommentsOpen" class="border-t border-slate-200 bg-slate-50 px-5 py-5">
      <CommentSection
        :comments="comments"
        :is-loading="isCommentsLoading"
        :is-posting="isCommentPosting"
        :error="error"
        @post-comment="$emit('post-comment', { photoId: photo.id, text: $event.text })"
        @delete-comment="$emit('delete-comment', { photoId: photo.id, commentId: $event.id })"
      />
    </div>
  </article>
</template>