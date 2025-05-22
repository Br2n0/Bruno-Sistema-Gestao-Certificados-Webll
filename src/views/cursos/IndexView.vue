<template>
  <div class="row">
    <div class="col-sm-12 mb-4">
      <div class="card">
        <div class="card-header pb-0">
          <h4 class="mb-3">Nossos Cursos</h4>
          <div class="row">
            <div class="col-md-6">
              <p>Encontre o curso ideal para impulsionar sua carreira. Todos os certificados são válidos para concursos públicos.</p>
            </div>
            <div class="col-md-6 d-flex justify-content-md-end">
              <div class="input-group mb-3" style="max-width: 300px">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar cursos..." 
                  aria-label="Buscar cursos"
                  v-model="searchTerm"
                  @input="applyFilters"
                >
                <button class="btn btn-primary" type="button">
                  <i class="ti ti-search"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Filtros de preço -->
          <div class="mb-3">
            <div class="btn-group me-2 mb-2">
              <button 
                type="button" 
                class="btn btn-outline-primary" 
                :class="{ active: filters.preco === 'todos' }"
                @click="setPrecoFilter('todos')"
              >
                Todos
              </button>
              <button 
                type="button" 
                class="btn btn-outline-primary" 
                :class="{ active: filters.preco === 'gratuitos' }"
                @click="setPrecoFilter('gratuitos')"
              >
                Gratuitos
              </button>
              <button 
                type="button" 
                class="btn btn-outline-primary" 
                :class="{ active: filters.preco === 'pagos' }"
                @click="setPrecoFilter('pagos')"
              >
                Pagos
              </button>
            </div>
            
            <!-- Filtros de nível -->
            <div class="btn-group me-2 mb-2">
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                :class="{ active: filters.nivel === 'Básico' }"
                @click="setNivelFilter('Básico')"
              >
                Nível: Básico
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                :class="{ active: filters.nivel === 'Intermediário' }"
                @click="setNivelFilter('Intermediário')"
              >
                Intermediário
              </button>
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                :class="{ active: filters.nivel === 'Avançado' }"
                @click="setNivelFilter('Avançado')"
              >
                Avançado
              </button>
            </div>
            
            <!-- Filtros de disponibilidade -->
            <div class="btn-group mb-2">
              <button 
                type="button" 
                class="btn btn-outline-success" 
                :class="{ active: filters.disponibilidade === true }"
                @click="setDisponibilidadeFilter(true)"
              >
                Disponíveis
              </button>
              <button 
                type="button" 
                class="btn btn-outline-warning" 
                :class="{ active: filters.disponibilidade === false }"
                @click="setDisponibilidadeFilter(false)"
              >
                Em breve
              </button>
            </div>
          </div>
          
          <!-- Categorias -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: filters.area === 'todas' }"
                href="#" 
                @click.prevent="setAreaFilter('todas')"
              >
                Todas as Áreas
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: filters.area === 'tecnologia' }"
                href="#" 
                @click.prevent="setAreaFilter('tecnologia')"
              >
                Tecnologia
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: filters.area === 'administrativa' }"
                href="#" 
                @click.prevent="setAreaFilter('administrativa')"
              >
                Administrativo
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: filters.area === 'juridica' }"
                href="#" 
                @click.prevent="setAreaFilter('juridica')"
              >
                Jurídico
              </a>
            </li>
          </ul>
        </div>
        
        <div class="card-body">
          <!-- Mensagem quando não há cursos -->
          <div v-if="filteredCursos.length === 0" class="text-center py-5">
            <i class="ti ti-search-off fs-1 text-muted mb-3"></i>
            <h5>Nenhum curso encontrado com os filtros selecionados</h5>
            <p class="text-muted">Tente modificar seus filtros ou pesquise por outro termo</p>
            <button class="btn btn-outline-primary" @click="resetFilters">
              Limpar Filtros
            </button>
          </div>

          <template v-else>
            <!-- Área Tecnológica -->
            <div v-if="showArea('tecnologia')">
              <h5 class="mb-3 border-bottom pb-2">Área Tecnológica</h5>
              <div class="row">
                <div 
                  v-for="curso in getCursosByArea('tecnologia')" 
                  :key="curso.id" 
                  class="col-md-4 mb-4"
                >
                  <div class="card h-100 border-0 shadow-sm curso-card">
                    <div class="position-relative">
                      <div :class="`curso-header ${curso.headerColor} d-flex align-items-center px-3 py-5`">
                        <div class="curso-icon text-white">
                          <i :class="`ti ${curso.icon} text-white fs-1`"></i>
                        </div>
                      </div>
                      <div class="position-absolute top-0 end-0 p-2">
                        <span class="badge bg-light text-dark fs-6 fw-bold">
                          {{ curso.duracao }} horas
                        </span>
                      </div>
                    </div>
                    
                    <div class="card-body">
                      <h5 class="card-title fw-bold mb-3">{{ curso.nome }}</h5>
                      <p class="card-text text-muted mb-3">
                        {{ curso.descricao }}
                      </p>
                      
                      <div class="d-flex justify-content-between mb-3">
                        <span :class="`badge ${getBadgeColorByNivel(curso.nivel)}`">{{ curso.nivel }}</span>
                        <span :class="`badge ${curso.disponivel ? 'bg-success' : 'bg-warning'}`">
                          {{ curso.disponivel ? 'Disponível' : 'Em breve' }}
                        </span>
                      </div>
                      
                      <button :class="`btn ${curso.disponivel ? 'btn-primary' : 'btn-secondary'} w-100`">
                        {{ curso.disponivel ? 'Acessar Curso Grátis' : 'Lista de Espera' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Área Administrativa -->
            <div v-if="showArea('administrativa')">
              <h5 class="mt-5 mb-3 border-bottom pb-2">Área Administrativa</h5>
              <div class="row">
                <div 
                  v-for="curso in getCursosByArea('administrativa')" 
                  :key="curso.id" 
                  class="col-md-4 mb-4"
                >
                  <div class="card h-100 border-0 shadow-sm curso-card">
                    <div class="position-relative">
                      <div :class="`curso-header ${curso.headerColor} d-flex align-items-center px-3 py-5`">
                        <div class="curso-icon text-white">
                          <i :class="`ti ${curso.icon} text-white fs-1`"></i>
                        </div>
                      </div>
                      <div class="position-absolute top-0 end-0 p-2">
                        <span class="badge bg-light text-dark fs-6 fw-bold">
                          {{ curso.duracao }} horas
                        </span>
                      </div>
                    </div>
                    
                    <div class="card-body">
                      <h5 class="card-title fw-bold mb-3">{{ curso.nome }}</h5>
                      <p class="card-text text-muted mb-3">
                        {{ curso.descricao }}
                      </p>
                      
                      <div class="d-flex justify-content-between mb-3">
                        <span :class="`badge ${getBadgeColorByNivel(curso.nivel)}`">{{ curso.nivel }}</span>
                        <span :class="`badge ${curso.disponivel ? 'bg-success' : 'bg-warning'}`">
                          {{ curso.disponivel ? 'Disponível' : 'Em breve' }}
                        </span>
                      </div>
                      
                      <button :class="`btn ${curso.disponivel ? 'btn-primary' : 'btn-secondary'} w-100`">
                        {{ curso.disponivel ? 'Acessar Curso Grátis' : 'Lista de Espera' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Área Jurídica -->
            <div v-if="showArea('juridica')">
              <h5 class="mt-5 mb-3 border-bottom pb-2">Área Jurídica</h5>
              <div class="row">
                <div 
                  v-for="curso in getCursosByArea('juridica')" 
                  :key="curso.id" 
                  class="col-md-4 mb-4"
                >
                  <div class="card h-100 border-0 shadow-sm curso-card">
                    <div class="position-relative">
                      <div :class="`curso-header ${curso.headerColor} d-flex align-items-center px-3 py-5`">
                        <div class="curso-icon text-white">
                          <i :class="`ti ${curso.icon} text-white fs-1`"></i>
                        </div>
                      </div>
                      <div class="position-absolute top-0 end-0 p-2">
                        <span class="badge bg-light text-dark fs-6 fw-bold">
                          {{ curso.duracao }} horas
                        </span>
                      </div>
                    </div>
                    
                    <div class="card-body">
                      <h5 class="card-title fw-bold mb-3">{{ curso.nome }}</h5>
                      <p class="card-text text-muted mb-3">
                        {{ curso.descricao }}
                      </p>
                      
                      <div class="d-flex justify-content-between mb-3">
                        <span :class="`badge ${getBadgeColorByNivel(curso.nivel)}`">{{ curso.nivel }}</span>
                        <span :class="`badge ${curso.disponivel ? 'bg-success' : 'bg-warning'}`">
                          {{ curso.disponivel ? 'Disponível' : 'Em breve' }}
                        </span>
                      </div>
                      
                      <button :class="`btn ${curso.disponivel ? 'btn-primary' : 'btn-secondary'} w-100`">
                        {{ curso.disponivel ? 'Acessar Curso Grátis' : 'Lista de Espera' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'

// Interface para definir a estrutura de um curso
interface Curso {
  id: number
  nome: string
  descricao: string
  area: string 
  duracao: number
  nivel: string
  disponivel: boolean
  preco: string
  headerColor: string
  icon: string
}

// Estado para os filtros
const filters = reactive({
  preco: 'todos', // todos, gratuitos, pagos
  nivel: '', // Básico, Intermediário, Avançado
  disponibilidade: null as boolean | null, // true, false, null
  area: 'todas', // todas, tecnologia, administrativa, juridica
})

// Termo de busca do usuário
const searchTerm = ref('')

// Detectar busca via query parameter
const route = useRoute();
if (route.query.q) {
  searchTerm.value = route.query.q as string;
}

// Dados dos cursos (simulando dados reais de um backend)
const cursos = ref<Curso[]>([
  // Área Tecnológica
  {
    id: 1,
    nome: 'Desenvolvimento Web com HTML5 e CSS3',
    descricao: 'Saiba mais sobre os conceitos fundamentais de HTML5 e CSS3 com este curso básico!',
    area: 'tecnologia',
    duracao: 40,
    nivel: 'Básico',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-primary',
    icon: 'ti-code'
  },
  {
    id: 2,
    nome: 'JavaScript Avançado e ES6+',
    descricao: 'Aprenda JavaScript moderno, incluindo recursos avançados do ES6 e além!',
    area: 'tecnologia',
    duracao: 60,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-warning',
    icon: 'ti-brand-javascript'
  },
  {
    id: 3,
    nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
    descricao: 'Domine o desenvolvimento full stack com Vue.js no frontend e Node.js no backend!',
    area: 'tecnologia',
    duracao: 120,
    nivel: 'Avançado',
    disponivel: true,
    preco: 'pago',
    headerColor: 'bg-success',
    icon: 'ti-brand-vue'
  },
  {
    id: 4,
    nome: 'Banco de Dados SQL e NoSQL',
    descricao: 'Aprenda a projetar e gerenciar bancos de dados relacionais e não-relacionais!',
    area: 'tecnologia',
    duracao: 80,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-info',
    icon: 'ti-database'
  },
  {
    id: 5,
    nome: 'Inteligência Artificial e Machine Learning',
    descricao: 'Aprenda conceitos fundamentais de IA e Machine Learning para análise de dados!',
    area: 'tecnologia',
    duracao: 160,
    nivel: 'Avançado',
    disponivel: false,
    preco: 'pago',
    headerColor: 'bg-danger',
    icon: 'ti-brain'
  },
  {
    id: 6,
    nome: 'DevOps e Integração Contínua',
    descricao: 'Domine práticas de DevOps e técnicas de integração e entrega contínuas!',
    area: 'tecnologia',
    duracao: 90,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'pago',
    headerColor: 'bg-dark',
    icon: 'ti-git-merge'
  },
  
  // Área Administrativa
  {
    id: 7,
    nome: 'Gestão Pública',
    descricao: 'Aprenda os fundamentos da administração pública e gestão de recursos públicos!',
    area: 'administrativa',
    duracao: 80,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-info',
    icon: 'ti-building-bank'
  },
  {
    id: 8,
    nome: 'Administração Financeira',
    descricao: 'Domine técnicas de administração financeira e orçamentária no setor público!',
    area: 'administrativa',
    duracao: 70,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-success',
    icon: 'ti-coin'
  },
  {
    id: 9,
    nome: 'Recursos Humanos',
    descricao: 'Aprenda sobre gestão de pessoas, recrutamento e desenvolvimento profissional!',
    area: 'administrativa',
    duracao: 60,
    nivel: 'Básico',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-primary',
    icon: 'ti-users'
  },
  
  // Área Jurídica
  {
    id: 10,
    nome: 'Direito Constitucional',
    descricao: 'Estude os princípios fundamentais da Constituição Federal e sua aplicação!',
    area: 'juridica',
    duracao: 100,
    nivel: 'Intermediário',
    disponivel: true,
    preco: 'gratuito',
    headerColor: 'bg-danger',
    icon: 'ti-scale'
  },
  {
    id: 11,
    nome: 'Direito Administrativo',
    descricao: 'Compreenda a organização e funcionamento da Administração Pública!',
    area: 'juridica',
    duracao: 120,
    nivel: 'Avançado',
    disponivel: true,
    preco: 'pago',
    headerColor: 'bg-dark',
    icon: 'ti-gavel'
  },
  {
    id: 12,
    nome: 'Direito Civil',
    descricao: 'Estude as relações jurídicas entre pessoas físicas e jurídicas no âmbito privado!',
    area: 'juridica',
    duracao: 90,
    nivel: 'Intermediário',
    disponivel: false,
    preco: 'pago',
    headerColor: 'bg-warning',
    icon: 'ti-files'
  }
])

// Computed property para filtrar os cursos com base nos filtros aplicados
const filteredCursos = computed(() => {
  return cursos.value.filter(curso => {
    // Filtro de busca por texto
    if (searchTerm.value && !curso.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) && 
        !curso.descricao.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return false
    }
    
    // Filtro de preço
    if (filters.preco !== 'todos' && curso.preco !== filters.preco) {
      return false
    }
    
    // Filtro de nível
    if (filters.nivel && curso.nivel !== filters.nivel) {
      return false
    }
    
    // Filtro de disponibilidade
    if (filters.disponibilidade !== null && curso.disponivel !== filters.disponibilidade) {
      return false
    }
    
    // Filtro de área
    if (filters.area !== 'todas' && curso.area !== filters.area) {
      return false
    }
    
    return true
  })
})

// Métodos para os filtros
const setPrecoFilter = (preco: string) => {
  filters.preco = preco === filters.preco ? 'todos' : preco
  applyFilters()
}

const setNivelFilter = (nivel: string) => {
  filters.nivel = nivel === filters.nivel ? '' : nivel
  applyFilters()
}

const setDisponibilidadeFilter = (disponibilidade: boolean) => {
  filters.disponibilidade = filters.disponibilidade === disponibilidade ? null : disponibilidade
  applyFilters()
}

const setAreaFilter = (area: string) => {
  filters.area = area
  applyFilters()
}

// Função auxiliar para aplicar filtros
const applyFilters = () => {
  // Esta função existe para possíveis ações adicionais quando os filtros são aplicados
  // Por exemplo, análise ou envio de eventos de tracking
}

// Função para resetar todos os filtros
const resetFilters = () => {
  filters.preco = 'todos'
  filters.nivel = ''
  filters.disponibilidade = null
  filters.area = 'todas'
  searchTerm.value = ''
}

// Função auxiliar para obter cursos por área
const getCursosByArea = (area: string) => {
  return filteredCursos.value.filter(curso => curso.area === area)
}

// Função para verificar se uma área deve ser exibida
const showArea = (area: string) => {
  return filters.area === 'todas' || filters.area === area
}

// Cores dos badges conforme o nível
const getBadgeColorByNivel = (nivel: string): string => {
  switch (nivel) {
    case 'Básico':
      return 'bg-success'
    case 'Intermediário':
      return 'bg-primary'
    case 'Avançado':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}
</script>

<style scoped>
.curso-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.curso-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.curso-header {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.curso-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.btn {
  border-radius: 6px;
  font-weight: 500;
}

.badge {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
}

.nav-tabs .nav-link {
  color: #333;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
}
</style> 