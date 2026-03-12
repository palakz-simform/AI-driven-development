<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '@/stores/photo'

const emit = defineEmits<{
  like: []
  comment: []
  view: []
}>()

interface Props {
  photo: Photo
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const date = new Date(props.photo.createdAt)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <!-- Photo Image -->
    <button
      type="button"
      class="relative block aspect-square w-full overflow-hidden bg-gray-100 text-left"
      @click="emit('view')"
    >
      <img
        :src="photo.imageUrl"
        :alt="photo.title"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </button>

    <!-- Photo Info -->
    <div class="p-4">
      <!-- User Info -->
      <div class="mb-3 flex items-center gap-3">
        <img
          :src="photo.userAvatar"
          :alt="photo.username"
          class="h-10 w-10 rounded-full"
        />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-gray-900">{{ photo.username }}</p>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Title and Description -->
      <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ photo.title }}</h3>
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ photo.description }}</p>

      <!-- Engagement Stats -->
      <div class="flex gap-4 mb-3 text-sm text-gray-600">
        <button
          class="flex items-center gap-1 hover:text-red-500 transition-colors"
          :class="{ 'text-red-500': photo.liked }"
          @click="emit('like')"
        >
          <svg
            class="h-4 w-4"
            :fill="photo.liked ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{{ photo.likes }}</span>
        </button>

        <button
          class="flex items-center gap-1 hover:text-blue-500 transition-colors"
          @click="emit('comment')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586a1 1 0 00-.707.293l-2.414 2.414z"
            />
          </svg>
          <span>{{ photo.comments }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
