<script setup lang="ts">
const portfolio = usePortfolio();

// Compact "Projects / Achievements" column from the home mockup.
const featured = computed(() =>
  portfolio.value.projects.items.filter((p) => p.featured).slice(0, 3),
);
</script>

<template>
  <aside class="w-full max-w-[300px]" aria-labelledby="hero-projects-title">
    <h2
      id="hero-projects-title"
      class="mb-4 flex flex-wrap items-center gap-x-2 text-base font-bold text-soft"
    >
      <span aria-hidden="true">&#128188;</span> {{ $t('hero.projects') }}
      <span aria-hidden="true">/</span>
      <span aria-hidden="true">&#127942;</span> {{ $t('hero.achievements') }}
    </h2>
    <ul class="space-y-3">
      <li v-for="project in featured" :key="project.id">
        <a
          href="#projects"
          class="card block p-4 transition hover:-translate-y-0.5 hover:border-brand"
        >
          <span class="block text-sm font-bold leading-snug text-ink">{{
            project.title
          }}</span>
          <span class="mt-1.5 block text-xs text-soft"
            ><CompanyBadge :company="project.company" size="sm"
          /></span>
          <span class="mt-3 flex flex-wrap gap-1.5">
            <TechIcon
              v-for="tech in project.technologies.slice(0, 5)"
              :key="tech"
              :name="tech"
            />
          </span>
        </a>
      </li>
    </ul>
    <a
      href="#projects"
      class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-4 hover:text-brand"
    >
      <Icon name="lucide:arrow-up-right" class="size-4" />
      {{ $t('hero.seeMore') }}
    </a>
  </aside>
</template>
