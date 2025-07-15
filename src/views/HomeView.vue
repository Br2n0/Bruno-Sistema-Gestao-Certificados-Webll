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
      :button-text="isAuthenticated ? 'Acessar' : 'Ver Curso'"
    />

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
  
  if (isAuthenticated.value) {
    const cursosMatriculados = cursosEmAndamento.value.map((m: any) => m.cursoId)
      .concat(certificadosObtidos.value.map((c: any) => c.id))
    
    return cursosDisponiveis.value
      .filter((curso: any) => !cursosMatriculados.includes(curso.id))
      .slice(0, 3)
      .map((curso: any) => ({
        id: curso.ID,
        nome: curso.Titulo,
        descricao: curso.Descricao || 'Descrição não disponível',
        cargaHoraria: curso.Duracao,
        instrutor: curso.Instrutor || 'Instrutor não informado',
        categoria: 'Geral'
      }))
  }
  
  return cursosDisponiveis.value.slice(0, 3).map((curso: any) => ({
    id: curso.ID,
    nome: curso.Titulo,
    descricao: curso.Descricao || 'Descrição não disponível',
    cargaHoraria: curso.Duracao,
    instrutor: curso.Instrutor || 'Instrutor não informado',
    categoria: 'Geral'
  }))
})

// Método para carregar cursos
const carregarCursos = async () => {
  try {
    cursosDisponiveis.value = await apiService.getCursos()
    console.log('✅ Cursos carregados:', cursosDisponiveis.value.length)
  } catch (error) {
    console.error('❌ Erro ao carregar cursos:', error)
    // Se for erro de conexão, tentar novamente depois
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
