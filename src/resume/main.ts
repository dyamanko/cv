import { createApp } from 'vue'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/golos-text'
import '../styles/tokens.css'
import '../styles/base.css'
import ResumePage from './ResumePage.vue'

// the resume is always printed on white, whatever the OS theme
document.documentElement.dataset.theme = 'light'

createApp(ResumePage).mount('#app')
