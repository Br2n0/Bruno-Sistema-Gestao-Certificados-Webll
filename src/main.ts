import './assets/fonts/tabler-icons.min.css'
import './assets/fonts/feather.css'
import './assets/fonts/fontawesome.css'
import './assets/fonts/material.css'
import './assets/css/style-preset.css'
import './assets/css/style.css'



import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
