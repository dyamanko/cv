import { computed, ref, watch } from 'vue'
import { content, type Lang } from '../content'

// the page is also rendered to static HTML at build time, where there is no window
const isBrowser = typeof window !== 'undefined'
const BASE = import.meta.env.BASE_URL

function isLang(value: unknown): value is Lang {
  return value === 'ru' || value === 'en'
}

/** /cv/ is English, /cv/ru/ is Russian; both are prerendered pages */
const pathFor = (value: Lang) => (value === 'ru' ? `${BASE}ru/` : BASE)

/**
 * The address decides: /cv/ is English, /cv/ru/ is Russian, so a link always
 * opens in the language it was sent in. ?lang= from older links and the PDFs still works.
 */
function detect(): Lang {
  if (!isBrowser) return 'en'
  const fromUrl = new URLSearchParams(location.search).get('lang')
  if (isLang(fromUrl)) return fromUrl
  return location.pathname.startsWith(pathFor('ru')) ? 'ru' : 'en'
}

const lang = ref<Lang>(detect())

function syncDocument(value: Lang) {
  if (!isBrowser) return
  const c = content[value]
  document.documentElement.lang = value
  document.title = c.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', c.meta.description)
}

/** keep the address on the page that matches the language, without a reload */
function syncUrl(value: Lang) {
  if (!isBrowser) return
  const url = new URL(location.href)
  url.pathname = pathFor(value)
  url.searchParams.delete('lang')
  if (url.href !== location.href) history.replaceState(null, '', url)
}

syncDocument(lang.value)
syncUrl(lang.value)

watch(lang, (value) => {
  if (!isBrowser) return
  syncDocument(value)
  syncUrl(value)
})

export function useLang() {
  return {
    lang,
    t: computed(() => content[lang.value]),
    setLang: (value: Lang) => {
      lang.value = value
    },
  }
}
