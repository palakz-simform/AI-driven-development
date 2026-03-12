<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isLiked: boolean
  count: number
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  toggle: []
}>()

const isAnimating = ref(false)

const handleClick = async () => {
  if (isAnimating.value) return

  isAnimating.value = true
  emit('toggle')

  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="isLoading"
    class="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      class="h-5 w-5 transition-transform duration-300"
      :class="{ 'scale-125': isAnimating && !isLiked }"
      :fill="isLiked ? 'currentColor' : 'none'"
      :style="{ color: isLiked ? '#ef4444' : 'inherit' }"
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
    <span class="text-sm font-medium">{{ count }}</span>
  </button>
</template>
