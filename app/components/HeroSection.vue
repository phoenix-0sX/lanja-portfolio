<script setup lang="ts">
const { t } = useI18n();
const portfolio = usePortfolio();
const hero = computed(() => portfolio.value.hero);
const resume = computed(() => portfolio.value.resume);
const hasCv = computed(() => resume.value.fileUrl.trim().length > 0);
</script>

<template>
  <section id="home" class="relative overflow-hidden">
    <!-- Corner circle from the mockup -->
    <div
      class="pointer-events-none absolute -left-24 -top-28 size-60 rounded-full bg-art-2 sm:-left-20 sm:-top-24 sm:size-72"
      aria-hidden="true"
    />

    <div
      class="container-page relative grid items-center gap-8 py-12 sm:py-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2 xl:max-w-[88rem] xl:grid-cols-[1fr_1.1fr_0.62fr] 2xl:max-w-[100rem]"
    >
      <div class="animate-fade-up">
        <h1
          class="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl xl:text-[2.75rem] 2xl:text-5xl text-center lg:text-start"
        >
          <span class="block">
            <span
              class="inline-block origin-[70%_70%] animate-[wave_2.4s_ease-in-out_1]"
              aria-hidden="true"
              >&#128075;</span
            >
            {{ hero.greeting }}
          </span>
          <span class="mt-1 block">
            {{ hero.intro }}
            <span class="text-accent">{{ portfolio.meta.name }}</span>
          </span>
          <span
            class="mt-2 block text-xl font-light text-soft sm:text-2xl xl:text-2xl"
            >{{ hero.role }}</span
          >
        </h1>

        <p
          class="mt-6 hidden max-w-xl animate-fade-up text-base leading-relaxed text-soft lg:block lg:text-lg"
          style="animation-delay: 0.12s"
        >
          {{ hero.paragraph }}
        </p>

        <ul
          class="mt-6 hidden max-w-xl animate-fade-up flex-wrap gap-2.5 lg:flex"
          style="animation-delay: 0.22s"
          :aria-label="t('a11y.expertise')"
        >
          <li v-for="tag in hero.tags" :key="tag" class="chip">{{ tag }}</li>
        </ul>

        <div
          class="mt-8 flex animate-fade-up flex-wrap justify-center gap-3 lg:justify-start"
          style="animation-delay: 0.32s"
        >
          <a
            v-if="hasCv"
            :href="resume.fileUrl"
            :download="resume.fileName"
            class="btn-primary"
          >
            <Icon name="lucide:download" class="size-4" />
            {{ hero.primaryCta.label }}
          </a>
          <button
            v-else
            type="button"
            class="btn-primary cursor-not-allowed opacity-60 hover:bg-brand"
            aria-disabled="true"
            :title="t('hero.cvSoon')"
          >
            <Icon name="lucide:download" class="size-4" />
            {{ hero.primaryCta.label }}
          </button>
          <a :href="hero.secondaryCta.href" class="btn-outline">
            <Icon name="lucide:file-text" class="size-4" />
            {{ hero.secondaryCta.label }}
          </a>
        </div>
      </div>

      <HeroArt class="lg:justify-self-center" />

      <div
        class="hidden animate-fade-up xl:block"
        style="animation-delay: 0.5s"
      >
        <HeroProjects />
      </div>
    </div>
  </section>
</template>

<style>
@keyframes wave {
  0%,
  60%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30% {
    transform: rotate(14deg);
  }
  20%,
  40% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(10deg);
  }
}
</style>
