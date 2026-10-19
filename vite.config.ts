import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the site from /cv/
export default defineConfig({
  base: '/cv/',
  plugins: [vue()],
})
