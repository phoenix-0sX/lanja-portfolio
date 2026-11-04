<script setup lang="ts">
defineProps<{
  emoji?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div v-reveal class="mb-10 max-w-2xl sm:mb-14">
    <h2 class="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
      <span v-if="emoji" aria-hidden="true">{{ emoji }}</span>
      {{ title }}
    </h2>
    <span class="title-bar mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand to-brand-light" aria-hidden="true" />
    <p v-if="subtitle" class="mt-4 text-base leading-relaxed text-soft sm:text-lg">{{ subtitle }}</p>
  </div>
</template>
