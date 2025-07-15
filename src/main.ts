// Importar Bootstrap CSS e JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/fonts/tabler-icons.min.css'
import './assets/fonts/feather.css'
import './assets/fonts/fontawesome.css'
import './assets/fonts/material.css'
import './assets/css/style-preset.css'
import './assets/css/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Inicialização assíncrona para aguardar configurações
const initializeApp = async () => {
  const app = createApp(App)
  
  app.use(router)
  
  // Mount da aplicação
  app.mount('#app')
}

// Inicializar aplicação
initializeApp().catch(error => {
  console.error('Erro ao inicializar aplicação:', error)
})
