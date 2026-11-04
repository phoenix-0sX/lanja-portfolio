<script setup lang="ts">
const { t } = useI18n();
const portfolio = usePortfolio();
const projects = computed(() => portfolio.value.projects);
</script>

<template>
  <section id="projects" class="section-y">
    <div class="container-page">
      <SectionTitle
        emoji="&#128188;"
        :title="projects.title"
        :subtitle="projects.description"
      />

      <ul class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="(project, i) in projects.items"
          :key="project.id"
          v-reveal="(i % 3) * 70"
          class="flex"
        >
          <article
            class="card group flex w-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-brand"
          >
            <!-- Placeholder cover until real screenshots are supplied -->
            <div
              class="relative h-28 overflow-hidden bg-gradient-to-br from-brand/25 via-brand-light/20 to-transparent"
            >
              <span
                class="absolute -right-6 -top-8 size-28 animate-breathe rounded-full bg-art-1/40"
                aria-hidden="true"
              />
              <span
                class="absolute -bottom-10 left-8 size-24 animate-breathe rounded-full bg-art-2/40"
                style="animation-delay: -4s"
                aria-hidden="true"
              />
              <span
                class="chip absolute left-4 top-4 bg-card/80 backdrop-blur"
                >{{ t(`projects.types.${project.type}`) }}</span
              >
              <span
                v-if="project.featured"
                class="absolute right-4 top-4 text-lg"
                :title="t('a11y.featured')"
                :aria-label="t('a11y.featuredProject')"
                role="img"
                >&#127942;</span
              >
            </div>

            <div class="flex flex-1 flex-col p-5 sm:p-6">
              <h3 class="text-lg font-bold leading-snug text-ink">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-xs font-medium text-soft">
                <CompanyBadge :company="project.company" />
              </p>
              <p class="mt-3 text-sm leading-relaxed text-soft">
                {{ project.description }}
              </p>

              <dl v-if="project.problem" class="mt-4 space-y-2 text-sm">
                <div>
                  <dt class="font-semibold text-ink">
                    {{ t('projects.problem') }}
                  </dt>
                  <dd class="text-soft">{{ project.problem }}</dd>
                </div>
                <div>
                  <dt class="font-semibold text-ink">
                    {{ t('projects.solution') }}
                  </dt>
                  <dd class="text-soft">{{ project.solution }}</dd>
                </div>
              </dl>

              <div class="mt-auto flex items-end justify-between gap-3 pt-5">
                <ul
                  class="flex flex-wrap gap-2"
                  :aria-label="t('a11y.technologies')"
                >
                  <li v-for="tech in project.technologies" :key="tech">
                    <TechIcon :name="tech" />
                  </li>
                </ul>
                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-deep"
                  :aria-label="t('a11y.openProject', { title: project.title })"
                >
                  <Icon name="lucide:arrow-up-right" class="size-4" />
                </a>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
