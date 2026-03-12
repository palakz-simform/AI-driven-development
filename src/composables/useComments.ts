import { ref, computed } from 'vue'
import { commentApi } from '@/api/comments'
import { photoApi } from '@/api/photos'
import { useCommentStore } from '@/stores/comment'
import { usePhotoStore, type PhotoId } from '@/stores/photo'

export function useComments(photoId: PhotoId) {
  const commentStore = useCommentStore()
  const photoStore = usePhotoStore()
  const isLoading = ref(false)
  const isPosting = ref(false)
  const error = ref<string | null>(null)

  const comments = computed(() => commentStore.getPhotoComments(photoId))
  const commentCount = computed(() => comments.value.length)

  async function loadComments() {
    try {
      isLoading.value = true
      error.value = null
      const fetchedComments = await commentApi.getByPhotoId(photoId)
      commentStore.setComments(photoId, fetchedComments)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load comments'
    } finally {
      isLoading.value = false
    }
  }

  async function addComment(text: string, userId: number, username: string, userAvatar: string) {
    try {
      isPosting.value = true
      error.value = null

      const newComment = await commentApi.create(photoId, { text })
      const commentWithUserData = {
        ...newComment,
        userId,
        username,
        userAvatar,
        likes: 0,
      }

      commentStore.addComment(photoId, commentWithUserData)
      const newCount = commentCount.value + 1
      photoStore.updatePhoto(photoId, { comments: newCount })
      await photoApi.updateCommentCount(photoId, newCount)

      return commentWithUserData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to post comment'
      throw err
    } finally {
      isPosting.value = false
    }
  }

  async function deleteComment(commentId: string | number) {
    try {
      error.value = null
      await commentApi.delete(commentId)
      commentStore.removeComment(photoId, commentId)
      const newCount = Math.max(0, commentCount.value - 1)
      photoStore.updatePhoto(photoId, { comments: newCount })
      await photoApi.updateCommentCount(photoId, newCount)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete comment'
      throw err
    }
  }

  return {
    comments,
    commentCount,
    isLoading: computed(() => isLoading.value),
    isPosting: computed(() => isPosting.value),
    error: computed(() => error.value),
    loadComments,
    addComment,
    deleteComment,
  }
}
