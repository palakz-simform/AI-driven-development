<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '@/stores/comment'

interface Props {
  comments: Comment[]
  isLoading: boolean
  isPosting: boolean
  error: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  'load-comments': []
  'post-comment': [{ text: string }]
  'delete-comment': [{ id: number }]
}>()

const commentText = ref('')
const showForm = ref(false)

const handleSubmit = async () => {
  if (!commentText.value.trim()) return

  emit('post-comment', { text: commentText.value })
  commentText.value = ''
  showForm.value = false
}

const deleteComment = (id: number) => {
  if (confirm('Delete this comment?')) {
    emit('delete-comment', { id })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-900">Comments</h3>
      <button
        v-if="!isLoading"
        @click="() => { showForm = !showForm; $emit('load-comments') }"
        class="text-sm text-blue-500 hover:text-blue-600"
      >
        {{ comments.length === 0 ? 'Load' : `${comments.length}` }}
      </button>
    </div>

    <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
      {{ error }}
    </div>

    <!-- Comments List -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div v-if="isLoading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>

      <div v-else v-for="comment in comments" :key="comment.id" class="flex gap-3">
        <img :src="comment.userAvatar" :alt="comment.username" class="h-8 w-8 rounded-full" />
        <div class="flex-1">
          <div class="bg-gray-100 rounded-lg p-3">
            <p class="font-semibold text-sm text-gray-900">{{ comment.username }}</p>
            <p class="text-sm text-gray-700">{{ comment.text }}</p>
          </div>
          <div class="mt-1 flex gap-4 text-xs text-gray-500">
            <button class="hover:text-gray-700">Like</button>
            <button @click="deleteComment(comment.id)" class="hover:text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <div v-if="showForm" class="border-t pt-4">
      <form @submit.prevent="handleSubmit" class="space-y-2">
        <textarea
          v-model="commentText"
          placeholder="Add a comment..."
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
        <div class="flex gap-2 justify-end">
          <button
            type="button"
            @click="() => { showForm = false; commentText = '' }"
            class="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!commentText.trim() || isPosting"
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isPosting ? '...' : 'Post' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
