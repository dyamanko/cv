import { computed, ref, watch } from 'vue'
import { content, type Lang } from '../content'

const STORAGE_KEY = 'cv-lang'

function isLang(value: unknown): value is Lang {
  return value === 'ru' || value === 'en'
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * English opens first. ?lang=ru in a link wins, then the visitor's last choice.
 */
function detect(): Lang {
  const fromUrl = new URLSearchParams(location.search).get('lang')
  if (isLang(fromUrl)) return fromUrl
  const stored = readStored()
  if (isLang(stored)) return stored
  return 'en'
}

const lang = ref<Lang>(detect())

function syncDocument(value: Lang) {
  const c = content[value]
  document.documentElement.lang = value
  document.title = c.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', c.meta.description)
}

syncDocument(lang.value)

watch(lang, (value) => {
  syncDocument(value)
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // private mode: the choice just won't be remembered
  }
  const url = new URL(location.href)
  url.searchParams.set('lang', value)
  history.replaceState(null, '', url)
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
