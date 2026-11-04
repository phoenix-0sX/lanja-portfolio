<script setup lang="ts">
import { formatMonth } from '~/utils/format';

const { t, locale } = useI18n();
const portfolio = usePortfolio();
const about = computed(() => portfolio.value.about);
</script>

<template>
  <section id="about" class="section-y border-t border-line/60 bg-muted/40">
    <div class="container-page">
      <SectionTitle
        emoji="&#128587;"
        :title="t('about.title')"
        :subtitle="about.shortBio"
      />

      <div class="grid gap-6 lg:grid-cols-3">
        <div v-reveal class="card p-6 sm:p-8 lg:col-span-2">
          <p class="text-base leading-relaxed text-ink sm:text-lg">
            {{ about.fullBio }}
          </p>
          <p class="mt-4 leading-relaxed text-soft">
            {{ about.professionalSummary }}
          </p>

          <h3
            class="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-brand-deep dark:text-accent"
          >
            {{ t('about.educationTitle') }}
          </h3>
          <ol class="space-y-4 border-l-2 border-brand/30 pl-5">
            <li
              v-for="edu in about.education"
              :key="edu.qualification"
              class="relative"
            >
              <span
                class="absolute -left-[1.72rem] top-1.5 size-3 rounded-full bg-brand ring-4 ring-page"
                aria-hidden="true"
              />
              <p class="font-semibold text-ink">
                {{ edu.qualification }}, {{ edu.field }}
              </p>
              <p class="text-sm text-soft">
                {{ edu.institution }} · {{ edu.location }} ·
                {{ formatMonth(edu.graduationDate, locale) }}
              </p>
            </li>
          </ol>
        </div>

        <div class="space-y-6">
          <div v-reveal="80" class="card p-6">
            <h3
              class="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-deep dark:text-accent"
            >
              <Icon name="lucide:languages" class="size-4" />
              {{ t('about.languagesTitle') }}
            </h3>
            <ul class="space-y-2.5">
              <li
                v-for="lang in about.languages"
                :key="lang.name"
                class="flex items-center justify-between text-sm"
              >
                <span class="font-medium text-ink">{{ lang.name }}</span>
                <span class="text-soft">{{ lang.level }}</span>
              </li>
            </ul>
          </div>

          <div v-reveal="160" class="card p-6">
            <h3
              class="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-deep dark:text-accent"
            >
              <Icon name="lucide:heart" class="size-4" />
              {{ t('about.interestsTitle') }}
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="interest in about.interests"
                :key="interest"
                class="chip"
              >
                {{ interest }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(item, i) in about.other"
          :key="item.name"
          v-reveal="i * 60"
          class="card p-5"
        >
          <p class="font-semibold text-ink">{{ item.name }}</p>
          <p class="mt-1 text-sm leading-relaxed text-soft">
            {{ item.description }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
