import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'emailProLight',
    themes: {
      emailProLight: {
        dark: false,
        colors: {
          primary: '#2962FF',
          secondary: '#C9A227',
          'on-secondary': '#111827',
          navy: '#111827',
          background: '#FAF9F6',
          surface: '#FFFFFF',
          'on-surface': '#111827',
        },
      },
      emailProDark: {
        dark: true,
        colors: {
          primary: '#2962FF',
          secondary: '#C9A227',
          'on-secondary': '#111827',
          navy: '#111827',
          background: '#111827',
          surface: '#1F2937',
        },
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
