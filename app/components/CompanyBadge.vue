<script setup lang="ts">
import { logosFor } from '~/data/companies'

const props = withDefaults(defineProps<{ company: string; size?: 'sm' | 'md' }>(), { size: 'md' })

const logos = computed(() => logosFor(props.company))
const h = computed(() => (props.size === 'sm' ? 'h-6' : 'h-9'))
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-x-2 gap-y-1.5">
    <span v-if="logos.length" class="inline-flex items-center gap-1.5">
      <!-- Decorative: the company name is written right next to the logos -->
      <img
        v-for="logo in logos"
        :key="logo.src"
        :src="logo.src"
        alt=""
        loading="lazy"
        decoding="async"
        class="w-auto shrink-0 rounded-md object-contain"
        :class="[h, logo.kind === 'plate' ? 'bg-white p-0.5 ring-1 ring-black/10' : 'ring-1 ring-black/10']"
      />
    </span>
    <span
      v-else
      class="grid shrink-0 place-items-center rounded-md bg-brand/15 text-brand-deep dark:text-accent"
      :class="size === 'sm' ? 'size-6' : 'size-9'"
    >
      <Icon name="lucide:landmark" :class="size === 'sm' ? 'size-3.5' : 'size-5'" />
    </span>
    <span class="min-w-0">{{ company }}</span>
  </span>
</template>
