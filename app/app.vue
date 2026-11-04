<script setup lang="ts">
import seo from '~/data/seo'

const { t, locale } = useI18n()

// Language-dependent <head>: <html lang>, title, description and Open Graph tags.
useHead(
  computed(() => ({
    htmlAttrs: { lang: locale.value },
    title: t('meta.title'),
    meta: [
      { name: 'description', content: t('meta.description') },
      { name: 'keywords', content: seo.keywords.join(', ') },
      { property: 'og:title', content: t('meta.title') },
      { property: 'og:description', content: t('meta.description') },
      { property: 'og:locale', content: locale.value === 'fr' ? 'fr_FR' : 'en_US' },
    ],
  })),
)
</script>

<template>
  <div class="relative min-h-screen overflow-x-clip">
    <BackgroundSquares />
    <a
      href="#main"
      class="sr-only z-[60] rounded-md bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {{ t('a11y.skip') }}
    </a>
    <AppHeader />
    <main id="main">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
