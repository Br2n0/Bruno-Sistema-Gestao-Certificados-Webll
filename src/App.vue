<template>
  <LoaderBg />
  <NavSideBar />
  <HeadBar />

  <div class="pc-container">
    <div class="pc-content">
      <BreadCrumb />

      <router-view></router-view>
    </div>
  </div>

  <FooterBar />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavSideBar from './layout/NavSideBar.vue'
import HeadBar from './layout/HeadBar.vue'
import FooterBar from './layout/FooterBar.vue'
import BreadCrumb from './layout/BreadCrumb.vue'
import LoaderBg from './layout/LoaderBg.vue'
</script>

<style>
/* Estilos globais para funcionalidade de sidebar */
.pc-sidebar {
  transition: transform 0.3s ease-in-out;
}

/* Estado escondido */
.pc-sidebar-hide {
  transform: translateX(-100%);
}

/* Ajustes para o container principal */
.pc-container {
  transition: margin-left 0.3s ease-in-out;
}

/* Em telas maiores que 992px */
@media (min-width: 992px) {
  .pc-sidebar {
    position: relative;
  }
  
  .pc-sidebar-hide {
    transform: translateX(-100%);
  }
}

/* Em telas menores que 992px */
@media (max-width: 991.98px) {
  .pc-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1050;
    background: white;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    transform: translateX(-100%);
  }
  
  .pc-sidebar:not(.pc-sidebar-hide) {
    transform: translateX(0);
  }
}
</style><style scoped></style>

->

<style>
/* Estilos globais para funcionalidade de sidebar */
.pc-sidebar {
  transition: transform 0.3s ease, width 0.3s ease;
}

.pc-sidebar-hide {
  transform: translateX(-100%);
}

/* Para telas menores (mobile) */
@media (max-width: 991.98px) {
  .pc-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1050;
    transform: translateX(-100%);
  }
  
  .pc-sidebar:not(.pc-sidebar-hide) {
    transform: translateX(0);
  }
}

/* Para telas maiores (desktop) */
@media (min-width: 992px) {
  .pc-sidebar-hide {
    width: 70px;
    transform: none;
  }
  
  .pc-sidebar-hide .pc-mtext,
  .pc-sidebar-hide .pc-arrow {
    opacity: 0;
    visibility: hidden;
  }
  
  .pc-container {
    transition: margin-left 0.3s ease;
  }
  
  .pc-sidebar-hide ~ .pc-container {
    margin-left: 70px;
  }
}
</style>
