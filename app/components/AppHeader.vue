<script setup lang="ts">
const { t } = useI18n()
const portfolio = usePortfolio()
const links = computed(() => portfolio.value.navigation)
const menuOpen = ref(false)
const active = ref('home')

let observer: IntersectionObserver | undefined

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  for (const link of links.value) {
    const el = document.getElementById(link.href.slice(1))
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line/60 bg-page/80 backdrop-blur-md">
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <a href="#home" class="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ink" :aria-label="t('a11y.backToTop')">
        <img src="/favicon.svg" alt="" width="32" height="32" class="size-8 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
        {{ portfolio.meta.name }}
      </a>

      <nav class="hidden items-center gap-1 md:flex" :aria-label="t('a11y.primaryNav')">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="rounded-full px-3.5 py-1.5 text-sm font-medium transition"
          :class="
            active === link.href.slice(1)
              ? 'bg-brand/15 text-brand-deep dark:text-accent'
              : 'text-soft hover:text-ink'
          "
          :aria-current="active === link.href.slice(1) ? 'true' : undefined"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-line bg-card/70 text-ink md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="absolute inset-x-0 top-full border-b border-line bg-page/95 px-5 pb-4 pt-2 shadow-soft backdrop-blur-md md:hidden"
        :aria-label="t('a11y.mobileNav')"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="block rounded-lg px-3 py-3 text-base font-medium"
          :class="active === link.href.slice(1) ? 'bg-brand/10 text-brand-deep dark:text-accent' : 'text-ink'"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </a>
      </nav>
    </Transition>
  </header>
</template>
