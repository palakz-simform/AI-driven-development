<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  upload: [{ title: string; description: string; imageUrl: string }]
}>()

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => title.value.trim() && imageUrl.value.trim())

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    emit('upload', {
      title: title.value,
      description: description.value,
      imageUrl: imageUrl.value,
    })
    // Reset form
    title.value = ''
    description.value = ''
    imageUrl.value = ''
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  title.value = ''
  description.value = ''
  imageUrl.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Upload Photo</h2>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Image URL Preview -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            v-model="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div v-if="imageUrl" class="mt-2 aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img :src="imageUrl" :alt="title || 'Preview'" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            v-model="title"
            type="text"
            placeholder="Photo title"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="description"
            placeholder="Add a caption..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-2">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
