# Dmitrii Iamanko, Senior Java Backend Developer

Personal resume site: [dyamanko.github.io/cv](https://dyamanko.github.io/cv/) (English) and [the Russian version](https://dyamanko.github.io/cv/?lang=ru).

The page is built around BPMN, the notation I work with every day. The hero shows a request running through a Camunda-style process: approvers sign off, an external call fails with an incident, the automatic retry picks it up. Case studies, the career timeline and the stack use the same visual language.

## Stack

- Vue 3, TypeScript, Vite
- Hand-written CSS with design tokens, light and dark themes
- Inline SVG diagrams, animated with the Web Animations API
- Unbounded and Golos Text, self-hosted through Fontsource

## Run locally

```bash
npm install
npm run dev
```

## Content

All texts live in `src/content/en.ts` and `src/content/ru.ts`. The site, the printable resume and the PDFs are rendered from them.

After changing the content, regenerate the PDFs and the link preview against the running dev server:

```bash
npm run pdf -- http://localhost:5173
npm run og -- http://localhost:5173
```

Both scripts use the local Google Chrome in headless mode.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through GitHub Actions (`.github/workflows/deploy.yml`).
