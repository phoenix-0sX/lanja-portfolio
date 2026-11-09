<script setup lang="ts">
import { formatRange } from '~/utils/format';

const { t, locale } = useI18n();
const portfolio = usePortfolio();
const jobs = computed(() => portfolio.value.experience);
const expanded = ref<Record<string, boolean>>({});

function toggle(id: string) {
  expanded.value[id] = !expanded.value[id];
}
</script>

<template>
  <section
    id="experience"
    class="section-y border-t border-line/60 bg-muted/40"
  >
    <div class="container-page">
      <SectionTitle
        emoji="noto:open-file-folder"
        :title="t('experience.title')"
        :subtitle="t('experience.subtitle')"
      />

      <ol class="relative space-y-6 border-l-2 border-brand/30 pl-6 sm:pl-10">
        <li
          v-for="(job, i) in jobs"
          :key="job.id"
          v-reveal="i * 60"
          class="relative"
        >
          <span
            class="absolute -left-[1.95rem] top-6 size-4 rounded-full ring-4 ring-page sm:-left-[2.95rem]"
            :class="job.isCurrent ? 'bg-brand' : 'bg-brand-light'"
            aria-hidden="true"
          >
            <span
              v-if="job.isCurrent"
              class="absolute inset-0 animate-ping rounded-full bg-brand/60"
            />
          </span>

          <article class="card p-5 sm:p-7">
            <div
              class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2"
            >
              <div>
                <h3 class="text-xl font-bold text-ink sm:text-2xl">
                  {{ job.jobTitle }}
                </h3>
                <p
                  class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm font-medium text-soft"
                >
                  <CompanyBadge :company="job.company" />
                  <span class="text-line" aria-hidden="true">|</span>
                  <span>{{ job.location }}</span>
                </p>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span v-if="job.isCurrent" class="chip">{{
                  t('experience.current')
                }}</span>
                <span
                  v-else-if="job.employmentType === 'Internship'"
                  class="chip"
                  >{{ t('experience.internship') }}</span
                >
                <time class="font-medium text-soft">{{
                  formatRange(
                    job.startDate,
                    job.endDate,
                    locale,
                    t('experience.now'),
                  )
                }}</time>
              </div>
            </div>

            <p class="mt-4 leading-relaxed text-soft">{{ job.summary }}</p>

            <p
              v-if="job.achievement"
              class="mt-4 inline-flex items-baseline gap-2 rounded-lg bg-brand/10 px-3 py-2"
            >
              <span
                class="text-lg font-extrabold text-brand-deep dark:text-accent"
                >{{ job.achievement.metric }}</span
              >
              <span class="text-sm text-soft">{{
                job.achievement.description
              }}</span>
            </p>

            <ul
              class="mt-5 flex flex-wrap gap-2.5"
              :aria-label="t('a11y.technologies')"
            >
              <li v-for="tech in job.technologies" :key="tech">
                <TechIcon :name="tech" />
              </li>
            </ul>

            <button
              type="button"
              class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline dark:text-accent"
              :aria-expanded="!!expanded[job.id]"
              :aria-controls="`resp-${job.id}`"
              @click="toggle(job.id)"
            >
              <Icon
                name="lucide:chevron-down"
                class="size-4 transition"
                :class="expanded[job.id] ? 'rotate-180' : ''"
              />
              {{
                expanded[job.id]
                  ? t('experience.hideDetails')
                  : t('experience.showDetails')
              }}
            </button>

            <ul
              v-show="expanded[job.id]"
              :id="`resp-${job.id}`"
              class="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-soft marker:text-brand"
            >
              <li v-for="item in job.responsibilities" :key="item">
                {{ item }}
              </li>
            </ul>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>
