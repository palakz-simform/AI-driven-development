<script setup lang="ts">
interface Props {
  photoCount: number
  isRefreshing: boolean
  isUploading: boolean
}

defineProps<Props>()

defineEmits<{
  refresh: []
  upload: []
}>()
</script>

<template>
  <section
    class="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-blue-700 px-6 py-8 text-white shadow-lg sm:px-8"
  >
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl space-y-3">
        <span
          class="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100"
        >
          Photo feed
        </span>
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            Discover fresh stories from your creative community
          </h1>
          <p class="max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            Browse the latest uploads, jump into conversations, and share a new moment from your camera roll.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
          <p class="text-xs uppercase tracking-[0.2em] text-blue-100">Photos loaded</p>
          <p class="mt-1 text-2xl font-semibold">{{ photoCount }}</p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isRefreshing"
            @click="$emit('refresh')"
          >
            {{ isRefreshing ? 'Refreshing...' : 'Refresh feed' }}
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isUploading"
            @click="$emit('upload')"
          >
            {{ isUploading ? 'Uploading...' : 'Upload photo' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>