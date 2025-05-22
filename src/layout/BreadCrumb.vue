<template>
<div class="page-header">
        <div class="page-block">
          <div class="row align-items-center">
            <div class="col-md-12">
              <div class="page-header-title">
                <h5 class="m-b-10">{{ title }}</h5>
              </div>
              <ul class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                <li v-if="parentRoute" class="breadcrumb-item">
                  <router-link :to="parentPath">{{ parentRoute }}</router-link>
                </li>
                <li class="breadcrumb-item" aria-current="page">{{ currentRoute }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Título dinâmico baseado na rota atual
const title = computed(() => {
  const routeName = route.name as string;
  const routeMap: Record<string, string> = {
    'home': 'Página Inicial',
    'certificados': 'Certificados',
    'cursos': 'Cursos',
    // Adicione mais rotas conforme necessário
  };
  
  return routeMap[routeName] || 'Página';
});

// Nome da rota atual
const currentRoute = computed(() => {
  const routeName = route.name as string;
  const routeMap: Record<string, string> = {
    'home': 'Página Inicial',
    'certificados': 'Certificados',
    'cursos': 'Cursos',
    // Adicione mais rotas conforme necessário
  };
  
  return routeMap[routeName] || 'Página';
});

// Nome da rota pai (se existir)
const parentRoute = computed(() => {
  if (route.path === '/cursos') {
    return null;
  }
  
  if (route.path.includes('/certificados')) {
    return 'Certificados';
  }
  
  return null;
});

// Caminho da rota pai
const parentPath = computed(() => {
  if (route.path.includes('/certificados')) {
    return '/certificados';
  }
  
  return '/';
});
</script>