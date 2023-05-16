import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/eva-icons'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/eva-icons/eva-icons.css'

// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet: quasarIconSet,
})

app.use(createPinia())
app.use(router)

app.mount('#app')
