<template>
  <!-- Layout padrão COM HEADER para todas as rotas -->
  <div>
    <HeadBar />

    <div class="main-container">
      <div class="main-content">
        <BreadCrumb v-if="!isAuthRoute" />
        <router-view></router-view>
      </div>
    </div>

    <FooterBar v-if="!isAuthRoute" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeadBar from './layout/HeadBar.vue'
import FooterBar from './layout/FooterBar.vue'
import BreadCrumb from './layout/BreadCrumb.vue'
import { useAuth } from './composables/useAuth'

const { initialize } = useAuth()
const route = useRoute()

// Verificar se é uma rota de autenticação (apenas para esconder breadcrumb e footer)
const isAuthRoute = computed(() => {
  return route.path.startsWith('/login') || route.path.startsWith('/registro')
})

// Inicializar sistema de autenticação
onMounted(async () => {
  await initialize()
})
</script>

<style>
/* Reset e layout básico */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #fcfcfc;
}

/* === LAYOUT PRINCIPAL SEM SIDEBAR === */

/* === CONTAINER PRINCIPAL === */
.main-container {
  padding-top: 80px; /* Espaço para o header fixo */
  min-height: 100vh;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* === RESPONSIVIDADE === */

/* Tablet */
@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .main-container {
    padding-top: 70px;
  }
  
  .main-content {
    padding: 10px;
  }
}

/* === ANIMAÇÕES GLOBAIS === */
.main-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
