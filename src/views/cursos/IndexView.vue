<template>
  <div class="cursos-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando cursos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0 text-gray-800">Cursos Disponíveis</h1>
            <p class="text-dark fs-6 mb-0">Encontre o curso ideal para seu desenvolvimento profissional</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-container mb-4">
        <div class="stat-item">
          <div class="stat-icon bg-primary">
            <i class="ti ti-book"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ cursosAtivos }}</span>
            <span class="stat-label">Cursos Ativos</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-success">
            <i class="ti ti-users"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ totalInstrutores }}</span>
            <span class="stat-label">Instrutores</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-warning">
            <i class="ti ti-clock"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ totalHoras }}</span>
            <span class="stat-label">Total de Horas</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-container mb-4">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="searchInput" class="form-label">Buscar curso</label>
              <input 
                v-model="searchTerm" 
                type="text" 
                class="form-control" 
                id="searchInput"
                placeholder="Digite o nome do curso..."
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Courses Grid -->
      <div class="courses-grid" v-if="filteredCursos.length > 0">
        <div v-for="curso in filteredCursos" :key="curso.id" class="course-card">
          <div class="card h-100">
            <div class="card-header text-white" :class="getHeaderColor(curso.id)">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">{{ curso.nome }}</h5>
                <i :class="getIconClass(curso.id)" class="fs-4"></i>
              </div>
            </div>
            <div class="card-body">
              <p class="card-text text-muted mb-3">{{ curso.descricao }}</p>
              <div class="course-meta">
                <div class="meta-item">
                  <i class="ti ti-clock text-primary"></i>
                  <span>{{ curso.cargaHoraria }}h</span>
                </div>
                <div class="meta-item" v-if="curso.instrutor">
                  <i class="ti ti-user text-primary"></i>
                  <span>{{ curso.instrutor }}</span>
                </div>
                <div class="meta-item">
                  <i class="ti ti-tag text-primary"></i>
                  <span>{{ curso.categoria }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <router-link 
                :to="`/curso/${curso.id}`" 
                class="btn btn-primary w-100"
              >
                <i class="ti ti-play me-2"></i>
                Começar Curso
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state text-center py-5">
        <i class="ti ti-book-off display-1 text-muted mb-3"></i>
        <h3 class="text-muted">Nenhum curso encontrado</h3>
        <p class="text-muted">Tente ajustar os filtros ou entre em contato conosco.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import apiService from '@/services/apiService'
import type { CursoDTO } from '@/services/apiService'

// Dados reativos
const cursos = ref<CursoDTO[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')

// Composables
const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

// Computed properties
const cursosAtivos = computed(() => cursos.value.length)

const totalInstrutores = computed(() => {
  const instrutores = new Set(cursos.value.map(c => c.Instrutor).filter(Boolean))
  return instrutores.size
})

const totalHoras = computed(() => {
  return cursos.value.reduce((total, curso) => total + curso.Duracao, 0)
})

const filteredCursos = computed(() => {
  let filtered = cursos.value

  // Filtro de busca
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(curso =>
      curso.Titulo.toLowerCase().includes(search) ||
      (curso.Descricao && curso.Descricao.toLowerCase().includes(search)) ||
      (curso.Instrutor && curso.Instrutor.toLowerCase().includes(search))
    )
  }

  return filtered.map(curso => ({
    id: curso.ID,
    nome: curso.Titulo,
    descricao: curso.Descricao || 'Descrição não disponível',
    cargaHoraria: curso.Duracao,
    instrutor: curso.Instrutor || 'Instrutor não informado',
    categoria: 'Geral' // A API não tem categoria ainda
  }))
})

// Métodos para UI
const getHeaderColor = (id: number): string => {
  const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary']
  return colors[id % colors.length]
}

const getIconClass = (id: number): string => {
  const icons = ['ti-code', 'ti-book', 'ti-database', 'ti-chart-line', 'ti-users', 'ti-settings']
  return icons[id % icons.length]
}

// Carregar cursos da API
const carregarCursos = async () => {
  try {
    loading.value = true
    error.value = ''
    
    cursos.value = await apiService.getCursos()
    
  } catch (err: any) {
    console.error('Erro ao carregar cursos:', err)
    error.value = 'Erro ao carregar cursos. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Detectar busca via query parameter
if (route.query.q) {
  searchTerm.value = route.query.q as string
}

// Inicializar
onMounted(() => {
  carregarCursos()
})
</script>

<style scoped>
.cursos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.filters-container {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.course-card {
  transition: transform 0.2s ease;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style> 