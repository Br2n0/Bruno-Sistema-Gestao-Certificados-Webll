<template>
  <div class="breadcrumb-section">
    <div class="breadcrumb-container">
      <div class="page-title">
        <h1>{{ title }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Título dinâmico baseado na rota atual
const title = computed(() => {
  const routeName = route.name as string
  const routeMap: Record<string, string> = {
    'home': 'Bem-vindo ao Hábeis Educacional',
    'cursos': 'Nossos Cursos',
    'meus-cursos': 'Meus Cursos',
    'curso-estudo': 'Ambiente de Aprendizagem',
    'certificados': 'Meus Certificados',
    'validar-certificado': 'Validar Certificado',
    'configuracoes': 'Configurações',
    'configuracoes-perfil': 'Configurações do Perfil',
    'configuracoes-notificacoes': 'Notificações',
    'configuracoes-seguranca': 'Segurança',
    'detalhe-certificado': 'Detalhes do Certificado',
    'admin-usuarios': 'Gestão de Usuários',
    'admin-cursos': 'Gestão de Cursos',
    'admin-certificados': 'Gestão de Certificados',
    'cadastro-curso': 'Cadastrar Curso',
    'lista-cursos': 'Lista de Cursos'
  }
  
  // Se não encontrar a rota, usar o path como fallback
  return routeMap[routeName] || route.path.charAt(1).toUpperCase() + route.path.slice(2).replace(/-/g, ' ')
})
</script>

<style scoped>
.breadcrumb-section {
  background: #fcfcfc;
  padding: 25px 0;
  margin-bottom: 20px;
}

.breadcrumb-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title h1 {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

/* Responsividade */
@media (max-width: 768px) {
  .breadcrumb-section {
    padding: 20px 0;
  }
  
  .breadcrumb-container {
    padding: 0 15px;
  }
  
  .page-title h1 {
    font-size: 28px;
  }
}

@media (max-width: 576px) {
  .breadcrumb-section {
    padding: 15px 0;
  }
  
  .page-title h1 {
    font-size: 24px;
  }
}
</style>