<script setup lang="ts">
import { techIcons, fallbackTechIcon } from '~/data/tech-icons'

const props = withDefaults(
  defineProps<{
    name: string
    /** `sm` for dense rows, `md` for skill tiles */
    size?: 'sm' | 'md'
    /** Show the technology name under the icon */
    label?: boolean
  }>(),
  { size: 'sm', label: false },
)

const { t } = useI18n()
const meta = computed(() => techIcons[props.name] ?? fallbackTechIcon)
// Display name: only "REST API" is spelled differently in French ("API REST").
const display = computed(() => (props.name === 'REST API' ? t('skills.restApi') : props.name))
</script>

<template>
  <span
    v-if="label"
    class="group flex flex-col items-center gap-1.5 rounded-xl p-2 text-center transition duration-200 hover:-translate-y-1 hover:bg-brand/10"
  >
    <Icon
      :name="meta.icon"
      class="size-8 transition duration-200 group-hover:scale-125 group-hover:-rotate-6"
      :class="meta.invertInDark ? 'dark:invert' : ''"
      aria-hidden="true"
    />
    <span class="text-[11px] font-medium leading-tight text-soft">{{ display }}</span>
  </span>
  <span v-else :title="display" class="inline-grid place-items-center">
    <Icon
      :name="meta.icon"
      :class="[size === 'md' ? 'size-8' : 'size-6', meta.invertInDark ? 'dark:invert' : '']"
      :aria-label="display"
      role="img"
    />
  </span>
</template>
