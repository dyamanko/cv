// Puts the server-rendered markup into the built pages after `vite build`:
// dist/index.html in English and dist/ru/index.html in Russian. Applicant
// tracking systems and link previews that skip JavaScript then see the whole
// resume in the right language; in the browser the client app renders over it.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SITE = 'https://dyamanko.github.io/cv/'
const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const template = readFileSync('dist/index.html', 'utf8')
if (!template.includes('<div id="app"></div>')) throw new Error('mount point not found in dist/index.html')

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function page(lang, { html, meta }) {
  let out = template.replace('<div id="app"></div>', `<div id="app">${html}</div>`)
  if (lang === 'en') return out
  const url = `${SITE}ru/`
  const swaps = [
    [/<html lang="en">/, '<html lang="ru">'],
    [/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`],
    [/(<meta name="description" content=")[^"]*"/, `$1${escape(meta.description)}"`],
    [/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`],
    [/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`],
    [/(<meta property="og:title" content=")[^"]*"/, `$1${escape(meta.title)}"`],
    [/(<meta property="og:description" content=")[^"]*"/, `$1${escape(meta.description)}"`],
    [/(<meta property="og:locale" content=")[^"]*"/, '$1ru_RU"'],
    [/(<meta property="og:locale:alternate" content=")[^"]*"/, '$1en_US"'],
  ]
  for (const [pattern, value] of swaps) {
    if (!pattern.test(out)) throw new Error(`not found in template: ${pattern}`)
    out = out.replace(pattern, value)
  }
  return out
}

const en = await render('en')
writeFileSync('dist/index.html', page('en', en))

const ru = await render('ru')
mkdirSync('dist/ru', { recursive: true })
writeFileSync('dist/ru/index.html', page('ru', ru))

rmSync('dist-ssr', { recursive: true, force: true })
console.log(`prerendered dist/index.html (${(en.html.length / 1024).toFixed(1)} KB) and dist/ru/index.html (${(ru.html.length / 1024).toFixed(1)} KB)`)
