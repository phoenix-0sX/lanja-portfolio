# Lanja – Portfolio (Nuxt 3 + TypeScript + Tailwind CSS)

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static site -> .output/public
```

## Where to edit

- `app/data/portfolio.ts` – all content (bio, skills tiers, experience, projects, contact). Source: from a large ready to use json file, ie: `lanja_portfolio.json`.
- `app/data/tech-icons.ts` – technology name -> icon. Add new techs here.
- `app/data/seo.ts` – title / description / keywords.
- `tailwind.config.ts` + `app/assets/css/main.css` – colour tokens (light & dark).

## Before publishing

- **CV**: put the PDF in `app/public/` and set `resume.fileUrl` in `portfolio.ts` (button is disabled until then).
- **Contact form (Forminit)**: copy `.env.example` to `.env` (git-ignored) and set `NUXT_FORMINIT_API_KEY`. In production set the same variable in your host's environment settings and deploy with `nuxt build` (a server/serverless preset), not `nuxt generate`. Form id: `NUXT_PUBLIC_FORMINIT_FORM_ID` (default in `nuxt.config.ts`).
- **Social links / project links / screenshots**: fill them in `portfolio.ts`.

## Languages (EN / FR)

Built with `@nuxtjs/i18n`: English at `/`, French at `/fr`, both pre-rendered. First visit follows the browser language, then the choice is remembered (cookie `lanja_locale`).

- **All text** lives in `i18n/locales/en.json` and `fr.json`. Keep both files on the same keys.
- **Language-neutral facts** (ids, dates, technologies, links, contact) live in `app/data/portfolio.ts`; `usePortfolio()` merges them with the active language.
- Add a language: new JSON file, add it to `i18n.locales` in `nuxt.config.ts`, add its months in `app/utils/format.ts`.
- Message syntax: write a literal `|` as `{'|'}` and avoid `@`, `{`, `}` in messages.
- **CV per language**: put the PDFs in `app/public/cv/` and set `resume.fileUrl.en` / `.fr` in `app/data/portfolio.ts`.

## Look & feel

- **Animations**: drifting squares (`app/components/BackgroundSquares.vue`, edit the `squares` array), entrance and hover motion via Tailwind keyframes in `tailwind.config.ts`. All motion is disabled for visitors who prefer reduced motion.
- **Company logos**: `app/data/companies.ts` maps company names to `app/public/images/companies/*.webp`. Companies without an entry get a neutral icon. Logos are trademarks of their owners, shown only to say where the work was done.
- **Photo**: `app/public/images/profile.webp`. **Favicon**: `app/public/favicon.svg` (+ `.ico`, `apple-touch-icon.png`, `icon-192/512.png`).
- **Adding new emojis later**: use `noto:` icon names (browse them at [icones.js.org](https://icones.js.org) under "Noto Emoji"). Add each new name to `emojiIcons` in `nuxt.config.ts`, otherwise it won't be bundled. Typing a raw emoji character into the page would bring the missing-glyph problem back.
