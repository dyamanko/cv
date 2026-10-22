# Dmitrii Iamanko, Senior Java Developer (Backend)

Personal resume site: [dyamanko.github.io/cv](https://dyamanko.github.io/cv/) (English) and [the Russian version](https://dyamanko.github.io/cv/ru/).

The first screen answers the recruiter's questions in order: role, experience, format, core stack, contacts and the PDF. Below it come the stack, four case studies, experience and education. The case studies are drawn in BPMN, the notation I work with every day, and each has one interactive diagram: failure scenarios for the retry mechanism, integration flows, diagram versions and roles, a monolith split into services.

## Stack

- Vue 3, TypeScript, Vite
- Hand-written CSS with design tokens, light and dark themes
- Inline SVG diagrams animated with the Web Animations API and CSS
- Technology logos from Simple Icons and Devicon, stored in `src/assets/icons`
- Static HTML rendered at build time with `vue/server-renderer`, so the text is there without JavaScript

## Run locally

```bash
npm install
npm run dev
```

## Content

All texts live in `src/content/en.ts` and `src/content/ru.ts`; the stack grid reads `src/content/stack.ts`. The resume PDFs in `public/cv/` are the resume files themselves, not generated.

The link preview `public/og.png` is rendered from `og.html` against the running dev server:

```bash
npm run og -- http://localhost:5173
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through GitHub Actions (`.github/workflows/deploy.yml`).
