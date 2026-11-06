<script setup lang="ts">
import seo from '~/data/seo';

const { t, locale } = useI18n();
const portfolio = usePortfolio();
const {
  public: { siteUrl },
} = useRuntimeConfig();

const origin = String(siteUrl).replace(/\/$/, '');
const urlFor = (code: string) =>
  code === 'en' ? `${origin}/` : `${origin}/${code}`;
const ogImage = `${origin}/og-image.png`;

// Language-dependent <head>: <html lang>, title, description, canonical/hreflang, Open Graph, Twitter and JSON-LD.
useHead(
  computed(() => {
    const url = urlFor(locale.value);
    const contact = portfolio.value.contact;
    const sameAs = Object.values(contact.socialLinks ?? {}).filter(Boolean);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lanja',
      alternateName: portfolio.value.meta.fullName,
      url: urlFor('en'),
      image: `${origin}/images/profile.webp`,
      jobTitle: t('meta.jobTitle'),
      description: t('meta.description'),
      email: `mailto:${contact.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Antananarivo',
        addressCountry: 'MG',
      },
      knowsAbout: seo.keywords,
      knowsLanguage: ['en', 'fr'],
      ...(sameAs.length ? { sameAs } : {}),
    };

    return {
      htmlAttrs: { lang: locale.value },
      title: t('meta.title'),
      meta: [
        { name: 'description', content: t('meta.description') },
        { name: 'keywords', content: seo.keywords.join(', ') },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { property: 'og:site_name', content: 'Lanja' },
        { property: 'og:title', content: t('meta.title') },
        { property: 'og:description', content: t('meta.description') },
        { property: 'og:url', content: url },
        {
          property: 'og:locale',
          content: locale.value === 'fr' ? 'fr_FR' : 'en_US',
        },
        {
          property: 'og:locale:alternate',
          content: locale.value === 'fr' ? 'en_US' : 'fr_FR',
        },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: t('meta.title') },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: t('meta.title') },
        { name: 'twitter:description', content: t('meta.description') },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [
        { rel: 'canonical', href: url },
        { rel: 'alternate', hreflang: 'en', href: urlFor('en') },
        { rel: 'alternate', hreflang: 'fr', href: urlFor('fr') },
        { rel: 'alternate', hreflang: 'x-default', href: urlFor('en') },
      ],
      script: [
        { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) },
      ],
    };
  }),
);
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
