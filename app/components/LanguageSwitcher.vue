<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// Keep the visitor exactly where they were when the page switches language.
async function switchTo(code: (typeof items.value)[number]['code']) {
  const top = window.scrollY
  await setLocale(code)
  await nextTick()
  window.scrollTo({ top, left: 0, behavior: 'instant' })
}

const items = computed(() =>
  locales.value.map((item) => (typeof item === 'string' ? { code: item, name: item } : item)),
)
</script>

<template>
  <!-- Real links (crawlable, work without JS); the click handler switches without a full reload. -->
  <div
    role="group"
    :aria-label="t('a11y.language')"
    class="inline-flex h-10 items-center rounded-full border border-line bg-card/70 p-1 text-xs font-bold"
  >
    <a
      v-for="item in items"
      :key="item.code"
      :href="switchLocalePath(item.code)"
      :hreflang="item.code"
      :lang="item.code"
      :title="item.name"
      :aria-label="t('a11y.switchLanguage', { language: item.name })"
      :aria-current="locale === item.code ? 'true' : undefined"
      class="grid h-8 min-w-9 place-items-center rounded-full px-2 uppercase tracking-wide transition"
      :class="locale === item.code ? 'bg-brand text-white shadow-soft' : 'text-soft hover:text-ink'"
      @click.prevent="switchTo(item.code)"
    >
      {{ item.code }}
    </a>
  </div>
</template>
