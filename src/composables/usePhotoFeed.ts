import { computed, ref } from 'vue'
import { commentApi } from '@/api/comments'
import { feedApi } from '@/api/feed'
import { likeApi } from '@/api/likes'
import { photoApi } from '@/api/photos'
import { useCommentStore, type CommentId } from '@/stores/comment'
import { usePhotoStore, type PhotoId } from '@/stores/photo'

interface FeedUser {
  id: number
  username: string
  avatar: string
}

const toKey = (value: string | number) => String(value)

export function usePhotoFeed() {
  const photoStore = usePhotoStore()
  const commentStore = useCommentStore()
  const page = ref(1)
  const limit = ref(4)
  const hasMore = ref(true)
  const isLoadingMore = ref(false)
  const isRefreshing = ref(false)
  const selectedPhotoId = ref<PhotoId | null>(null)
  const actionError = ref<string | null>(null)
  const pendingLikeIds = ref<Set<string>>(new Set())
  const loadingCommentIds = ref<Set<string>>(new Set())
  const postingCommentIds = ref<Set<string>>(new Set())

  const addToSet = (collection: Set<string>, id: PhotoId) => {
    const next = new Set(collection)
    next.add(toKey(id))
    return next
  }

  const removeFromSet = (collection: Set<string>, id: PhotoId) => {
    const next = new Set(collection)
    next.delete(toKey(id))
    return next
  }

  const clearActionError = () => {
    actionError.value = null
  }

  async function loadPhotos() {
    try {
      photoStore.setLoading(true)
      photoStore.setError(null)
      clearActionError()

      const response = await feedApi.getPhotoFeed(page.value, limit.value)
      photoStore.setPhotos(response.items)
      hasMore.value = response.hasMore
      photoStore.setError(null)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load photos'
      photoStore.setError(error)
    } finally {
      photoStore.setLoading(false)
    }
  }

  async function loadMorePhotos() {
    if (!hasMore.value || isLoadingMore.value) return

    try {
      isLoadingMore.value = true
      page.value++
      clearActionError()

      const response = await feedApi.getPhotoFeed(page.value, limit.value)
      if (response.items.length > 0) {
        photoStore.appendPhotos(response.items)
        hasMore.value = response.hasMore
      } else {
        page.value-- // Reset if no more photos
        hasMore.value = false
      }
      photoStore.setError(null)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to load more photos'
      photoStore.setError(error)
      page.value--
    } finally {
      isLoadingMore.value = false
    }
  }

  async function refreshPhotos() {
    try {
      isRefreshing.value = true
      page.value = 1
      hasMore.value = true
      await loadPhotos()
    } finally {
      isRefreshing.value = false
    }
  }

  async function toggleLike(photoId: PhotoId, currentUserId: number) {
    const targetPhoto = photoStore.photos.find((photo) => photo.id === toKey(photoId))
    if (!targetPhoto) return

    const wasLiked = targetPhoto.liked

    try {
      clearActionError()
      pendingLikeIds.value = addToSet(pendingLikeIds.value, photoId)
      photoStore.toggleLike(photoId)

      if (wasLiked) {
        await likeApi.delete(photoId, currentUserId)
      } else {
        await likeApi.create(photoId, currentUserId)
      }

      const updatedPhoto = photoStore.photos.find((photo) => photo.id === toKey(photoId))
      if (updatedPhoto) {
        await photoApi.updateLikes(photoId, updatedPhoto.likes)
      }
    } catch (err) {
      photoStore.toggleLike(photoId)
      actionError.value = err instanceof Error ? err.message : 'Failed to update like'
    } finally {
      pendingLikeIds.value = removeFromSet(pendingLikeIds.value, photoId)
    }
  }

  async function loadComments(photoId: PhotoId) {
    try {
      clearActionError()
      loadingCommentIds.value = addToSet(loadingCommentIds.value, photoId)
      const comments = await commentApi.getByPhotoId(photoId)
      commentStore.setComments(photoId, comments)
    } catch (err) {
      actionError.value = err instanceof Error ? err.message : 'Failed to load comments'
    } finally {
      loadingCommentIds.value = removeFromSet(loadingCommentIds.value, photoId)
    }
  }

  async function toggleComments(photoId: PhotoId) {
    if (selectedPhotoId.value === toKey(photoId)) {
      selectedPhotoId.value = null
      return
    }

    selectedPhotoId.value = toKey(photoId)

    if (commentStore.getPhotoComments(photoId).length === 0) {
      await loadComments(photoId)
    }
  }

  async function addComment(photoId: PhotoId, text: string, currentUser: FeedUser) {
    try {
      clearActionError()
      postingCommentIds.value = addToSet(postingCommentIds.value, photoId)

      const newComment = await commentApi.create(photoId, { text })
      const commentWithUserData = {
        ...newComment,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        likes: newComment.likes ?? 0,
      }

      commentStore.addComment(photoId, commentWithUserData)

      const photo = photoStore.photos.find((entry) => entry.id === toKey(photoId))
      if (photo) {
        const nextCommentCount = photo.comments + 1
        photoStore.updatePhoto(photoId, { comments: nextCommentCount })
        await photoApi.updateCommentCount(photoId, nextCommentCount)
      }
    } catch (err) {
      actionError.value = err instanceof Error ? err.message : 'Failed to post comment'
      throw err
    } finally {
      postingCommentIds.value = removeFromSet(postingCommentIds.value, photoId)
    }
  }

  async function deleteComment(photoId: PhotoId, commentId: CommentId) {
    try {
      clearActionError()
      await commentApi.delete(commentId)
      commentStore.removeComment(photoId, commentId)

      const photo = photoStore.photos.find((entry) => entry.id === toKey(photoId))
      if (photo) {
        const nextCommentCount = Math.max(0, photo.comments - 1)
        photoStore.updatePhoto(photoId, { comments: nextCommentCount })
        await photoApi.updateCommentCount(photoId, nextCommentCount)
      }
    } catch (err) {
      actionError.value = err instanceof Error ? err.message : 'Failed to delete comment'
      throw err
    }
  }

  const getPhotoComments = (photoId: PhotoId) => {
    return commentStore.getPhotoComments(photoId)
  }

  const isCommentsOpen = (photoId: PhotoId) => selectedPhotoId.value === toKey(photoId)
  const isCommentsLoading = (photoId: PhotoId) => loadingCommentIds.value.has(toKey(photoId))
  const isCommentPosting = (photoId: PhotoId) => postingCommentIds.value.has(toKey(photoId))
  const isLikePending = (photoId: PhotoId) => pendingLikeIds.value.has(toKey(photoId))
  const getPhotoError = (_photoId: PhotoId) => actionError.value

  const photos = computed(() => photoStore.photos)
  const loading = computed(() => photoStore.loading)
  const error = computed(() => photoStore.error)

  async function retryLoad() {
    page.value = 1
    hasMore.value = true
    await loadPhotos()
  }

  return {
    page,
    limit,
    hasMore,
    isLoadingMore,
    isRefreshing,
    selectedPhotoId,
    loadPhotos,
    loadMorePhotos,
    refreshPhotos,
    retryLoad,
    toggleLike,
    toggleComments,
    loadComments,
    addComment,
    deleteComment,
    getPhotoComments,
    isCommentsOpen,
    isCommentsLoading,
    isCommentPosting,
    isLikePending,
    getPhotoError,
    photos,
    loading,
    error,
  }
}
