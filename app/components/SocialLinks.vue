<script setup lang="ts">
import type { SocialLinks } from '~/types/portfolio';

const props = defineProps<{ links: SocialLinks }>();

const meta: Record<keyof SocialLinks, { label: string; icon: string }> = {
  github: { label: 'GitHub', icon: 'lucide:github' },
  gitlab: { label: 'GitLab', icon: 'lucide:gitlab' },
  linkedin: { label: 'LinkedIn', icon: 'lucide:linkedin' },
  facebook: { label: 'Facebook', icon: 'lucide:facebook' },
  website: { label: 'Website', icon: 'lucide:globe' },
};

// Only render networks that actually have a URL.
const items = computed(() =>
  (Object.keys(meta) as (keyof SocialLinks)[])
    .filter((key) => props.links[key])
    .map((key) => ({ key, url: props.links[key], ...meta[key] })),
);
</script>

<template>
  <ul v-if="items.length" class="flex items-center gap-2">
    <li v-for="item in items" :key="item.key">
      <a
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="grid size-10 place-items-center rounded-full border border-line bg-card/70 text-accent transition hover:border-brand hover:bg-brand hover:text-white"
        :aria-label="item.label"
        :title="item.label"
      >
        <Icon :name="item.icon" class="size-5" />
      </a>
    </li>
  </ul>
</template>
