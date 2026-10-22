import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { useLang } from './composables/useLang'
import { content, type Lang } from './content'

/** Renders one language of the page to static HTML, so the text is there before any JavaScript runs. */
export async function render(lang: Lang): Promise<{ html: string; meta: { title: string; description: string } }> {
  useLang().setLang(lang)
  const html = await renderToString(createSSRApp(App))
  return { html, meta: content[lang].meta }
}
