<template>
  <div class="home-container">
    <!-- Hero Section para usuários não logados -->
    <HeroSection v-if="!isAuthenticated" />

    <!-- Dashboard para usuários logados -->
    <UserDashboard 
      v-else
      :user-name="currentUser?.nome?.split(' ')[0] || 'Usuário'"
      :cursos-em-andamento="cursosEmAndamento"
      :certificados-obtidos="certificadosObtidos"
      :horas-totais-estudadas="horasTotaisEstudadas"
      :ultimo-curso-em-andamento="ultimoCursoEmAndamento"
    />

    <!-- Cursos em Destaque -->
    <CoursesHighlight 
      :cursos="cursosDestaque"
      :section-title="isAuthenticated ? 'Descubra Novos Cursos' : 'Cursos em Destaque'"
      :button-text="'Começar Curso'"
    />

    <!-- Hero Section para usuários logados (após os cursos) -->
    <HeroSection v-if="isAuthenticated" />

    <!-- Benefícios (apenas para não logados) -->
    <BenefitsSection v-if="!isAuthenticated" />

    <!-- CTA Final (apenas para não logados) -->
    <CtaSection v-if="!isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'
import apiService from '@/services/apiService'

// Componentes
import HeroSection from '@/components/home/HeroSection.vue'
import UserDashboard from '@/components/home/UserDashboard.vue'
import CoursesHighlight from '@/components/home/CoursesHighlight.vue'
import BenefitsSection from '@/components/home/BenefitsSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'

// Composables
const { isAuthenticated, currentUser } = useAuth()
const { 
  cursosEmAndamento, 
  certificadosObtidos, 
  ultimoCursoEmAndamento, 
  horasTotaisEstudadas,
  carregarDadosUsuario
} = useUserData()

// Estados
const loading = ref(true)
const cursosDisponiveis = ref<any[]>([])

// Computed properties
const cursosDestaque = computed(() => {
  if (cursosDisponiveis.value.length === 0) return []
  
  // Funções auxiliares para cores e ícones
  const getHeaderColor = (id: number): string => {
    const colors = ['bg-primary', 'bg-warning', 'bg-info', 'bg-success', 'bg-danger', 'bg-dark']
    return colors[id % colors.length]
  }

  const getIconClass = (id: number): string => {
    const icons = ['ti-code', 'ti-book', 'ti-database', 'ti-chart-line', 'ti-users', 'ti-settings']
    return icons[id % icons.length]
  }
  
  if (isAuthenticated.value) {
    const cursosMatriculados = cursosEmAndamento.value.map((m: any) => m.cursoId)
      .concat(certificadosObtidos.value.map((c: any) => c.id))
    
    return cursosDisponiveis.value
      .filter((curso: any) => !cursosMatriculados.includes(curso.ID))
      .slice(0, 3)
      .map((curso: any) => ({
        id: curso.ID,
        titulo: curso.Titulo,
        descricao: curso.Descricao || 'Descrição não disponível',
        duracao: curso.Duracao,
        categoria: 'Geral',
        headerColor: getHeaderColor(curso.ID),
        icon: getIconClass(curso.ID)
      }))
  }
  
  return cursosDisponiveis.value.slice(0, 3).map((curso: any) => ({
    id: curso.ID,
    titulo: curso.Titulo,
    descricao: curso.Descricao || 'Descrição não disponível',
    duracao: curso.Duracao,
    categoria: 'Geral',
    headerColor: getHeaderColor(curso.ID),
    icon: getIconClass(curso.ID)
  }))
})

// Método para carregar cursos
const carregarCursos = async () => {
  try {
    const cursos = await apiService.getCursos()
    cursosDisponiveis.value = cursos
  } catch (error) {
    cursosDisponiveis.value = []
  }
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  
  // Carregar cursos primeiro (funciona sem autenticação)
  await carregarCursos()
  
  // Carregar dados do usuário se estiver logado
  if (isAuthenticated.value) {
    await carregarDadosUsuario()
  }
  
  loading.value = false
})
</script>

<style scoped>
.home-container {
  background: #fcfcfc;
  min-height: 100vh;
}
</style>
