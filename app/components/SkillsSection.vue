<script setup lang="ts">
import type { SkillTone } from '~/types/portfolio';

const { t } = useI18n();
const portfolio = usePortfolio();
const tiers = computed(() => portfolio.value.skillTiers);

// Badge colours mirror the mockup: green / blue / amber / red.
const badgeTone: Record<SkillTone, string> = {
  green:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  amber:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  red: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
};

const railTone: Record<SkillTone, string> = {
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};
</script>

<template>
  <section id="skills" class="section-y">
    <div class="container-page">
      <SectionTitle
        emoji="&#128736;&#65039;"
        :title="t('skills.title')"
        :subtitle="t('skills.subtitle')"
      />

      <div class="grid gap-5 md:grid-cols-2">
        <article
          v-for="(tier, i) in tiers"
          :key="tier.id"
          v-reveal="i * 70"
          class="card relative overflow-hidden p-5 pl-6 sm:p-6 sm:pl-7"
        >
          <span
            class="absolute inset-y-0 left-0 w-1.5"
            :class="railTone[tier.tone]"
            aria-hidden="true"
          />

          <ul class="grid grid-cols-3 gap-1 sm:grid-cols-4 xl:grid-cols-5">
            <li v-for="skill in tier.skills" :key="skill">
              <TechIcon :name="skill" label />
            </li>
          </ul>

          <ul class="mt-4 flex flex-wrap gap-2" :aria-label="t('a11y.level')">
            <li
              v-for="badge in tier.badges"
              :key="badge"
              class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold before:size-1.5 before:rounded-full before:bg-current before:content-['']"
              :class="badgeTone[tier.tone]"
            >
              {{ badge }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
