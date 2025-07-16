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
      <div class="page-header mb-4 d-flex align-items-start gap-4">
        <div class="flex-grow-1">
          <h1 class="h3 mb-0 text-gray-800">Cursos Disponíveis</h1>
          <p class="text-dark fs-6 mb-0">Encontre o curso ideal para seu desenvolvimento profissional</p>
        </div>
        <!-- Atalhos laterais -->
        <div class="d-flex gap-3 align-items-end" style="min-width: 300px;">
          <router-link to="/meus-cursos" class="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-3 fw-semibold">
            <i class="ti ti-book"></i>
            Meus Cursos
          </router-link>
          <router-link to="/certificados" class="btn btn-success d-flex align-items-center gap-2 shadow-sm px-4 py-3 fw-semibold">
            <i class="ti ti-id-badge"></i>
            Certificados
          </router-link>
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
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <span class="fw-bold text-dark">Filtrar por:</span>
            <!-- Filtro Carga Horária -->
            <div class="dropdown">
              <button 
                class="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ filtroCargaHorariaLabel }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="filtroCargaHoraria = ''">Todas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroCargaHoraria = 'curto'">Até 20h</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroCargaHoraria = 'medio'">21h - 50h</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroCargaHoraria = 'longo'">Acima de 50h</a></li>
              </ul>
            </div>
            <!-- Filtro Faixa de Preço -->
            <div class="dropdown">
              <button 
                class="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ filtroPrecoLabel }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="filtroPreco = ''">Todas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroPreco = 'gratuito'">Gratuito</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroPreco = 'baixo'">Até R$ 200</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroPreco = 'medio'">R$ 201 - R$ 400</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="filtroPreco = 'alto'">Acima de R$ 400</a></li>
              </ul>
            </div>
          </div>
          <span class="text-muted">
            {{ filteredCursos.length }} de {{ cursos.length }} resultados encontrados
          </span>
        </div>
      </div>

      <!-- Courses Grid -->
      <div class="courses-grid" v-if="filteredCursos.length > 0">
        <div v-for="curso in filteredCursos" :key="curso.id" class="course-card">
          <div class="card h-100 border-0 shadow-sm">
            <div class="position-relative">
              <div :class="`curso-header ${getHeaderColor(curso.id)} d-flex align-items-center justify-content-center`">
                <i :class="`ti ${getIconClass(curso.id)} text-white fs-1`"></i>
              </div>
              <div class="position-absolute top-0 end-0 p-2">
                <span class="badge bg-light text-dark fs-6 fw-bold">
                  {{ curso.duracao }} horas
                </span>
              </div>
            </div>
            
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold mb-3">{{ curso.titulo }}</h5>
              <p class="card-text text-muted mb-4">
                {{ curso.descricao }}
              </p>
              
              <router-link 
                :to="`/curso/${curso.id}`" 
                class="btn btn-primary w-100 mt-auto"
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
import { dataService, type Curso } from '@/services/dataService'

// Dados reativos
const cursos = ref<Curso[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filtroCargaHoraria = ref('')
const filtroPreco = ref('')

// Composables
const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

// Computed properties
const cursosAtivos = computed(() => cursos.value.length)

const totalInstrutores = computed(() => {
  const instrutores = new Set(cursos.value.map(c => c.instrutor).filter(Boolean))
  return instrutores.size
})

const totalHoras = computed(() => {
  return cursos.value.reduce((total, curso) => total + curso.duracao, 0)
})

const filtroCargaHorariaLabel = computed(() => {
  switch (filtroCargaHoraria.value) {
    case 'curto': return 'Até 20h'
    case 'medio': return '21h - 50h'
    case 'longo': return 'Acima de 50h'
    default: return 'Carga Horária'
  }
})

const filtroPrecoLabel = computed(() => {
  switch (filtroPreco.value) {
    case 'gratuito': return 'Gratuito'
    case 'baixo': return 'Até R$ 200'
    case 'medio': return 'R$ 201 - R$ 400'
    case 'alto': return 'Acima de R$ 400'
    default: return 'Faixa de Preço'
  }
})

const filteredCursos = computed(() => {
  let filtered = cursos.value

  // Filtro Carga Horária
  if (filtroCargaHoraria.value) {
    filtered = filtered.filter(curso => {
      if (filtroCargaHoraria.value === 'curto') return curso.duracao <= 20
      if (filtroCargaHoraria.value === 'medio') return curso.duracao > 20 && curso.duracao <= 50
      if (filtroCargaHoraria.value === 'longo') return curso.duracao > 50
      return true
    })
  }

  // Filtro Preço
  if (filtroPreco.value) {
    filtered = filtered.filter(curso => {
      if (filtroPreco.value === 'gratuito') return curso.preco === 0
      if (filtroPreco.value === 'baixo') return curso.preco > 0 && curso.preco <= 200
      if (filtroPreco.value === 'medio') return curso.preco > 200 && curso.preco <= 400
      if (filtroPreco.value === 'alto') return curso.preco > 400
      return true
    })
  }

  return filtered
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
    
    cursos.value = await dataService.getCursos()
    
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.curso-header {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-primary {
  background: #2c3cdc;
}

.bg-warning {
  background: #ed8936;
}

.bg-info {
  background: #0bc5ea;
}

.bg-success {
  background: #48bb78;
}

.bg-danger {
  background: #f56565;
}

.bg-dark {
  background: #2d3748;
}

.badge {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-light {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  color: #222;
  border-radius: 8px;
  transition: box-shadow 0.2s, background 0.2s;
}
.btn-light:hover, .btn-light:focus {
  background: #e9ecef;
  color: #1a237e;
  box-shadow: 0 2px 8px rgba(44,60,220,0.08);
  text-decoration: none;
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