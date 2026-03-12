import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type CommentId = string

export interface Comment {
  id: CommentId
  photoId: string
  userId: number
  username: string
  userAvatar: string
  text: string
  likes: number
  createdAt: string
  updatedAt: string
}

export interface CommentCreatePayload {
  photoId: string
  text: string
}

const normalizePhotoKey = (photoId: string | number) => String(photoId)
const normalizeCommentKey = (commentId: string | number) => String(commentId)

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Map<string, Comment[]>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getPhotoComments(photoId: string | number): Comment[] {
    return comments.value.get(normalizePhotoKey(photoId)) || []
  }

  function setComments(photoId: string | number, newComments: Comment[]) {
    comments.value.set(normalizePhotoKey(photoId), newComments)
  }

  function addComment(photoId: string | number, comment: Comment) {
    const photoKey = normalizePhotoKey(photoId)
    const photoComments = comments.value.get(photoKey) || []
    photoComments.unshift(comment)
    comments.value.set(photoKey, photoComments)
  }

  function updateComment(
    photoId: string | number,
    commentId: string | number,
    updates: Partial<Comment>,
  ) {
    const photoKey = normalizePhotoKey(photoId)
    const photoComments = comments.value.get(photoKey) || []
    const commentIndex = photoComments.findIndex((comment) => {
      return normalizeCommentKey(comment.id) === normalizeCommentKey(commentId)
    })
    if (commentIndex !== -1) {
      photoComments[commentIndex] = { ...photoComments[commentIndex], ...updates } as Comment
    }
  }

  function removeComment(photoId: string | number, commentId: string | number) {
    const photoKey = normalizePhotoKey(photoId)
    const photoComments = comments.value.get(photoKey) || []
    const filtered = photoComments.filter((comment) => {
      return normalizeCommentKey(comment.id) !== normalizeCommentKey(commentId)
    })
    comments.value.set(photoKey, filtered)
  }

  function clearComments(photoId: string | number) {
    comments.value.delete(normalizePhotoKey(photoId))
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
