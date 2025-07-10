<template>
  <!-- Layout para rotas de autenticação -->
  <div v-if="isAuthRoute">
    <router-view></router-view>
  </div>
  
  <!-- Layout padrão para outras rotas -->
  <div v-else>
    <NavSideBar />
    <HeadBar />

    <div class="pc-container" :class="{ 'sidebar-collapsed': isCollapsed && !isMobile }">
      <div class="pc-content">
        <BreadCrumb />

        <router-view></router-view>
      </div>
    </div>

    <FooterBar />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavSideBar from './layout/NavSideBar.vue'
import HeadBar from './layout/HeadBar.vue'
import FooterBar from './layout/FooterBar.vue'
import BreadCrumb from './layout/BreadCrumb.vue'
import { useSidebar } from './composables/useSidebar'
import { useAuth } from './composables/useAuth'

const { isCollapsed, isMobile } = useSidebar()
const { initialize } = useAuth()
const route = useRoute()

// Verificar se é uma rota de autenticação
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
}

/* === LAYOUT PRINCIPAL === */

/* === HEADER STYLES === */
.pc-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 70px;
  z-index: 1040;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  transition: left 0.3s ease;
}

/* === CONTAINER STYLES === */
.pc-container {
  margin-left: 280px;
  padding-top: 70px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

/* === SIDEBAR COLLAPSED STATE === */
.pc-container.sidebar-collapsed {
  margin-left: 70px;
}

.pc-header.sidebar-collapsed {
  left: 70px;
}

.pc-content {
  padding: 20px;
  min-height: calc(100vh - 90px);
}

/* === RESPONSIVE BEHAVIOR === */

/* Mobile (sidebar overlay) */
@media (max-width: 991px) {
  .pc-header {
    left: 0 !important;
  }
  
  .pc-container {
    margin-left: 0 !important;
  }
  
  .pc-container.sidebar-collapsed {
    margin-left: 0 !important;
  }
}

/* Desktop (sidebar collapsed) */
@media (min-width: 992px) {
  /* Ajustar header quando sidebar minimizada */
  .pc-header.sidebar-collapsed {
    left: 70px;
  }
  
  /* Ajustar container quando sidebar minimizada */
  .pc-container.sidebar-collapsed {
    margin-left: 70px;
  }
}

/* === ANIMAÇÕES GLOBAIS === */
.pc-header,
.pc-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
