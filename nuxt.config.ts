import { techIcons, fallbackTechIcon } from './app/data/tech-icons';

const bundledIcons = [
  ...new Set([
    ...Object.values(techIcons).map((t) => t.icon),
    fallbackTechIcon.icon,
  ]),
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'app',
  // Keep API routes in <project>/server (srcDir is 'app', so Nuxt would otherwise look in app/server).
  serverDir: 'server',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/i18n'],

  css: ['@fontsource-variable/inter'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~~/tailwind.config.ts',
  },

  icon: {
    // Icons come from locally installed Iconify sets: no runtime API calls.
    serverBundle: 'local',
    // Icons are picked dynamically from data, so list them explicitly.
    clientBundle: { scan: true, icons: bundledIcons },
  },

  // English at `/`, French at `/fr`. Both are pre-rendered by `nuxt generate`.
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      // First visit on `/`: use the browser language, then remember the visitor's choice.
      useCookie: true,
      cookieKey: 'lanja_locale',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },

  typescript: { strict: true },

  runtimeConfig: {
    // PRIVATE (server only). Set the env var NUXT_FORMINIT_API_KEY.
    forminitApiKey: '',
    public: {
      // Public by design (it is in the page anyway). Override with NUXT_PUBLIC_FORMINIT_FORM_ID.
      forminitFormId: '1pnsjgyk801',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#00BE63' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          sizes: '48x48',
        },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          // Apply the saved/system theme before first paint to avoid a flash.
          innerHTML:
            "(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()",
          tagPosition: 'head',
        },
      ],
    },
  },

  nitro: { prerender: { routes: ['/', '/fr'] } },
});
