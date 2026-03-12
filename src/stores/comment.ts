import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Comment {
  id: number
  photoId: number
  userId: number
  username: string
  userAvatar: string
  text: string
  likes: number
  createdAt: string
  updatedAt: string
}

export interface CommentCreatePayload {
  photoId: number
  text: string
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Map<number, Comment[]>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getPhotoComments(photoId: number): Comment[] {
    return comments.value.get(photoId) || []
  }

  function setComments(photoId: number, newComments: Comment[]) {
    comments.value.set(photoId, newComments)
  }

  function addComment(photoId: number, comment: Comment) {
    const photoComments = comments.value.get(photoId) || []
    photoComments.unshift(comment)
    comments.value.set(photoId, photoComments)
  }

  function updateComment(photoId: number, commentId: number, updates: Partial<Comment>) {
    const photoComments = comments.value.get(photoId) || []
    const commentIndex = photoComments.findIndex((c) => c.id === commentId)
    if (commentIndex !== -1) {
      photoComments[commentIndex] = { ...photoComments[commentIndex], ...updates } as Comment
    }
  }

  function removeComment(photoId: number, commentId: number) {
    const photoComments = comments.value.get(photoId) || []
    const filtered = photoComments.filter((c) => c.id !== commentId)
    comments.value.set(photoId, filtered)
  }

  function clearComments(photoId: number) {
    comments.value.delete(photoId)
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    comments,
    loading,
    error,
    getPhotoComments,
    setComments,
    addComment,
    updateComment,
    removeComment,
    clearComments,
    setLoading,
    setError,
  }
})
