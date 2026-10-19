import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the site from /cv/
export default defineConfig({
  base: '/cv/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        resume: fileURLToPath(new URL('./resume.html', import.meta.url)),
      },
    },
  },
})
