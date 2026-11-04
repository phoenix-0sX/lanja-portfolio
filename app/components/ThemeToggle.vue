<script setup lang="ts">
const { t } = useI18n()
const { theme, toggle, sync } = useTheme()
onMounted(sync)
</script>

<template>
  <button
    type="button"
    class="grid size-10 place-items-center rounded-full border border-line bg-card/70 text-ink transition hover:border-brand hover:text-brand"
    :aria-label="theme === 'dark' ? t('a11y.switchToLight') : t('a11y.switchToDark')"
    :title="theme === 'dark' ? t('a11y.lightTheme') : t('a11y.darkTheme')"
    @click="toggle"
  >
    <ClientOnly>
      <Icon :name="theme === 'dark' ? 'lucide:moon' : 'lucide:sun'" class="size-5" :class="theme === 'dark' ? '' : 'text-amber-500'" />
      <template #fallback>
        <Icon name="lucide:sun" class="size-5 text-amber-500" />
      </template>
    </ClientOnly>
  </button>
</template>
