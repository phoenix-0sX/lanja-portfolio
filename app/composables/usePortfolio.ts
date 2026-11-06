import { base } from '~/data/portfolio';
import type { LocaleCode, Portfolio } from '~/types/portfolio';

/**
 * Builds the full, localized `Portfolio` by merging the language-neutral data
 * (`data/portfolio.ts`) with the messages from `i18n/locales/*.json`.
 * Recomputes automatically when the visitor switches language.
 */
export function usePortfolio() {
  const { t, te, tm, rt, locale } = useI18n();

  return computed<Portfolio>(() => {
    const code = locale.value as LocaleCode;

    // Arrays of strings are stored as message objects by vue-i18n; resolve each one.
    const list = (key: string): string[] =>
      (tm(key) as unknown[]).map((message) =>
        rt(message as Parameters<typeof rt>[0]),
      );
    // Optional keys fall back to an empty string instead of printing the key.
    const opt = (key: string) => (te(key) ? t(key) : '');

    return {
      meta: { ...base.meta, title: t('meta.jobTitle') },

      navigation: base.navigation.map((id) => ({
        label: t(`nav.${id}`),
        href: `#${id}`,
      })),

      hero: {
        greeting: t('hero.greeting'),
        intro: t('hero.intro'),
        role: t('hero.role'),
        paragraph: t('hero.paragraph'),
        tags: list('hero.tags'),
        primaryCta: { label: t('hero.downloadCv'), href: '#' },
        secondaryCta: { label: t('hero.aboutMe'), href: '#about' },
      },

      about: {
        shortBio: t('about.shortBio', {
          fullname: base.meta.fullName,
          name: base.meta.name,
        }),
        fullBio: t('about.fullBio'),
        professionalSummary: t('about.summary'),
        education: base.about.education.map((edu) => ({
          qualification: t(`about.education.${edu.id}.qualification`),
          field: t(`about.education.${edu.id}.field`),
          institution: t('about.institution'),
          location: edu.location,
          graduationDate: edu.graduationDate,
        })),
        interests: list('about.interests'),
        languages: base.about.languages.map((id) => ({
          name: t(`about.languages.${id}.name`),
          level: t(`about.languages.${id}.level`),
        })),
        other: base.about.other.map((id) => ({
          name: t(`about.other.${id}.name`),
          description: t(`about.other.${id}.description`),
        })),
      },

      skillTiers: base.skillTiers.map((tier) => ({
        ...tier,
        badges: list(`skills.tiers.${tier.id}`),
      })),

      experience: base.experience.map((job) => {
        const key = `experience.items.${job.id}`;
        return {
          ...job,
          jobTitle: t(`${key}.jobTitle`),
          summary: t(`${key}.summary`),
          responsibilities: list(`${key}.responsibilities`),
          achievement: te(`${key}.metric`)
            ? {
                metric: t(`${key}.metric`),
                description: t(`${key}.achievement`),
              }
            : undefined,
        };
      }),

      projects: {
        title: t('projects.title'),
        description: t('projects.subtitle'),
        items: base.projects.map((project) => {
          const key = `projects.items.${project.id}`;
          return {
            ...project,
            title: t(`${key}.title`),
            description: t(`${key}.description`),
            problem: opt(`${key}.problem`),
            solution: opt(`${key}.solution`),
          };
        }),
      },

      contact: {
        ...base.contact,
        title: t('contact.title'),
        intro: t('contact.intro'),
        form: {
          submitLabel: t('contact.send'),
          successMessage: t('contact.success'),
        },
      },

      resume: {
        label: t('hero.downloadCv'),
        fileName: base.resume.fileName[code],
        fileUrl: base.resume.fileUrl[code],
      },
    };
  });
}
