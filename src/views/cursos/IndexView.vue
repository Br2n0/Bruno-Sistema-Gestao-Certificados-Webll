<template>
  <div class="row">
    <div class="col-sm-12 mb-4">
      <div class="card border-0" style="background-color: transparent;">
        <div class="card-body">
          <!-- Texto descritivo -->
          <div class="mb-4">
            <p class="text-dark fs-6">Explore nossos cursos preparatórios de qualidade em diversas áreas. Certificados em conformidade com regulamentações.</p>
          </div>
          
          <!-- Filtros minimalistas -->
          <div class="d-flex align-items-center gap-3 mb-5">
            <span class="text-dark fw-medium">Filtrar por:</span>
            
            <!-- Filtro Carga Horária -->
            <div class="dropdown" ref="cargaHorariaDropdown">
              <button 
                class="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                @click="toggleCargaHorariaDropdown"
                :aria-expanded="showCargaHorariaDropdown"
              >
                {{ getCargaHorariaLabel() }}
              </button>
              <ul class="dropdown-menu" :class="{ show: showCargaHorariaDropdown }">
                <li><a class="dropdown-item" href="#" @click.prevent="selectCargaHoraria('todas')">Todas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectCargaHoraria('40')">40 horas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectCargaHoraria('60')">60 horas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectCargaHoraria('80')">80 horas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectCargaHoraria('100')">100+ horas</a></li>
              </ul>
            </div>
            
            <!-- Filtro Áreas -->
            <div class="dropdown" ref="areaDropdown">
              <button 
                class="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                @click="toggleAreaDropdown"
                :aria-expanded="showAreaDropdown"
              >
                {{ getAreaLabel() }}
              </button>
              <ul class="dropdown-menu" :class="{ show: showAreaDropdown }">
                <li><a class="dropdown-item" href="#" @click.prevent="selectArea('todas')">Todas as Áreas</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectArea('tecnologia')">Tecnologia</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectArea('administrativa')">Administrativo</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="selectArea('juridica')">Jurídico</a></li>
              </ul>
            </div>
            
            <!-- Contador de resultados -->
            <div class="ms-auto">
              <small class="text-dark">{{ filteredCursos.length }} de {{ cursos.length }} resultados encontrados</small>
            </div>
          </div>
          
          <!-- Mensagem quando não há cursos -->
          <div v-if="filteredCursos.length === 0" class="text-center py-5">
            <i class="ti ti-search-off fs-1 text-muted mb-3"></i>
            <h5>Nenhum curso encontrado</h5>
            <p class="text-muted">Tente modificar seus filtros ou pesquise por outro termo</p>
            <button class="btn btn-outline-primary" @click="resetFilters">
              Limpar Filtros
            </button>
          </div>

          <!-- Grid de cursos -->
          <div v-else class="row">
            <div 
              v-for="curso in filteredCursos" 
              :key="curso.id" 
              class="col-md-4 mb-4"
            >
              <div class="card h-100 border-0 shadow-sm curso-card">
                <div class="position-relative">
                  <div :class="`curso-header ${curso.headerColor} d-flex align-items-center justify-content-center`">
                    <i :class="`ti ${curso.icon} text-white fs-1`"></i>
                  </div>
                  <div class="position-absolute top-0 end-0 p-2">
                    <span class="badge bg-light text-dark fs-6 fw-bold">
                      {{ curso.duracao }} horas
                    </span>
                  </div>
                </div>
                
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-bold mb-3">{{ curso.nome }}</h5>
                  <p class="card-text text-muted mb-4">
                    {{ curso.descricao }}
                  </p>
                  
                  <button class="btn btn-primary w-100 mt-auto" @click="acessarCurso(curso)">
                    Acessar Curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Interface para definir a estrutura de um curso
interface Curso {
  id: number
  nome: string
  descricao: string
  area: string 
  duracao: number
  headerColor: string
  icon: string
}

// Estado para os filtros
const filters = reactive({
  cargaHoraria: 'todas', // todas, 40, 60, 80, 100
  area: 'todas', // todas, tecnologia, administrativa, juridica
})

// Estados para controlar dropdowns
const showCargaHorariaDropdown = ref(false)
const showAreaDropdown = ref(false)

// Termo de busca do usuário (vem do header)
const searchTerm = ref('')

// Detectar busca via query parameter
const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();

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
    headerColor: 'bg-primary',
    icon: 'ti-code'
  },
  {
    id: 2,
    nome: 'JavaScript Avançado e ES6+',
    descricao: 'Aprenda JavaScript moderno, incluindo recursos avançados do ES6 e além!',
    area: 'tecnologia',
    duracao: 60,
    headerColor: 'bg-warning',
    icon: 'ti-brand-javascript'
  },
  {
    id: 3,
    nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
    descricao: 'Domine o desenvolvimento full stack com Vue.js no frontend e Node.js no backend!',
    area: 'tecnologia',
    duracao: 120,
    headerColor: 'bg-success',
    icon: 'ti-brand-vue'
  },
  {
    id: 4,
    nome: 'Banco de Dados SQL e NoSQL',
    descricao: 'Aprenda a projetar e gerenciar bancos de dados relacionais e não-relacionais!',
    area: 'tecnologia',
    duracao: 80,
    headerColor: 'bg-info',
    icon: 'ti-database'
  },
  {
    id: 5,
    nome: 'Inteligência Artificial e Machine Learning',
    descricao: 'Aprenda conceitos fundamentais de IA e Machine Learning para análise de dados!',
    area: 'tecnologia',
    duracao: 160,
    headerColor: 'bg-danger',
    icon: 'ti-brain'
  },
  {
    id: 6,
    nome: 'DevOps e Integração Contínua',
    descricao: 'Domine práticas de DevOps e técnicas de integração e entrega contínuas!',
    area: 'tecnologia',
    duracao: 90,
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
    headerColor: 'bg-info',
    icon: 'ti-building-bank'
  },
  {
    id: 8,
    nome: 'Administração Financeira',
    descricao: 'Domine técnicas de administração financeira e orçamentária no setor público!',
    area: 'administrativa',
    duracao: 70,
    headerColor: 'bg-success',
    icon: 'ti-coin'
  },
  {
    id: 9,
    nome: 'Recursos Humanos',
    descricao: 'Aprenda sobre gestão de pessoas, recrutamento e desenvolvimento profissional!',
    area: 'administrativa',
    duracao: 60,
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
    headerColor: 'bg-danger',
    icon: 'ti-scale'
  },
  {
    id: 11,
    nome: 'Direito Administrativo',
    descricao: 'Compreenda a organização e funcionamento da Administração Pública!',
    area: 'juridica',
    duracao: 120,
    headerColor: 'bg-dark',
    icon: 'ti-gavel'
  },
  {
    id: 12,
    nome: 'Direito Civil',
    descricao: 'Estude as relações jurídicas entre pessoas físicas e jurídicas no âmbito privado!',
    area: 'juridica',
    duracao: 90,
    headerColor: 'bg-warning',
    icon: 'ti-files'
  }
])

// Computed property para filtrar os cursos
const filteredCursos = computed(() => {
  return cursos.value.filter(curso => {
    // Filtro de busca por texto (vem do header)
    if (searchTerm.value && !curso.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) && 
        !curso.descricao.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return false
    }
    
    // Filtro de carga horária
    if (filters.cargaHoraria !== 'todas') {
      if (filters.cargaHoraria === '100' && curso.duracao < 100) {
        return false
      } else if (filters.cargaHoraria !== '100' && curso.duracao !== parseInt(filters.cargaHoraria)) {
        return false
      }
    }
    
    // Filtro de área
    if (filters.area !== 'todas' && curso.area !== filters.area) {
      return false
    }
    
    return true
  })
})

// Métodos para os filtros
const setCargaHorariaFilter = (cargaHoraria: string) => {
  filters.cargaHoraria = cargaHoraria
}

const setAreaFilter = (area: string) => {
  filters.area = area
}

// Funções para controlar dropdowns
const toggleCargaHorariaDropdown = () => {
  showCargaHorariaDropdown.value = !showCargaHorariaDropdown.value
  showAreaDropdown.value = false // Fechar o outro dropdown
}

const toggleAreaDropdown = () => {
  showAreaDropdown.value = !showAreaDropdown.value
  showCargaHorariaDropdown.value = false // Fechar o outro dropdown
}

const selectCargaHoraria = (cargaHoraria: string) => {
  setCargaHorariaFilter(cargaHoraria)
  showCargaHorariaDropdown.value = false
}

const selectArea = (area: string) => {
  setAreaFilter(area)
  showAreaDropdown.value = false
}

// Função para resetar todos os filtros
const resetFilters = () => {
  filters.cargaHoraria = 'todas'
  filters.area = 'todas'
  searchTerm.value = ''
  closeDropdowns()
}

// Funções para labels dos filtros
const getCargaHorariaLabel = () => {
  switch (filters.cargaHoraria) {
    case '40': return '40 horas'
    case '60': return '60 horas'
    case '80': return '80 horas'
    case '100': return '100+ horas'
    default: return 'Carga Horária'
  }
}

const getAreaLabel = () => {
  switch (filters.area) {
    case 'tecnologia': return 'Tecnologia'
    case 'administrativa': return 'Administrativo'
    case 'juridica': return 'Jurídico'
    default: return 'Áreas'
  }
}

// Observar mudanças na query de busca
watch(() => route.query.q, (newQuery) => {
  searchTerm.value = newQuery as string || ''
})

// Fechar dropdowns quando clicar fora
const closeDropdowns = () => {
  showCargaHorariaDropdown.value = false
  showAreaDropdown.value = false
}

// Função para lidar com o clique no botão "Acessar Curso"
const acessarCurso = (curso: Curso) => {
  if (!isAuthenticated.value) {
    // Redirecionar para a tela de login/cadastro
    router.push('/login')
  } else {
    // Usuário logado - redirecionar para o ambiente virtual de estudos
    router.push(`/curso/${curso.id}`)
  }
}

// Inicializar eventos
onMounted(() => {
  // Adicionar evento para fechar dropdowns ao clicar fora
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.dropdown')) {
      closeDropdowns()
    }
  })
  
  // Garantir que os dropdowns do Bootstrap funcionem corretamente (fallback)
  const initDropdowns = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.bootstrap) {
      // @ts-ignore
      const dropdownElements = document.querySelectorAll('.dropdown-toggle')
      dropdownElements.forEach(element => {
        // @ts-ignore
        new window.bootstrap.Dropdown(element)
      })
    }
  }
  
  // Tentar inicializar imediatamente
  initDropdowns()
  
  // Tentar novamente após um pequeno delay caso o Bootstrap ainda não esteja carregado
  setTimeout(initDropdowns, 100)
})
</script>

<style scoped>
.curso-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.curso-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.curso-header {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
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



.dropdown-toggle {
  border-radius: 6px;
  font-weight: 500;
  min-width: 140px;
  border: 1px solid #ced4da;
  background-color: white;
  color: #495057;
  transition: all 0.15s ease-in-out;
}

.dropdown-toggle:hover {
  border-color: #adb5bd;
  background-color: #f8f9fa;
}

.dropdown-toggle:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.dropdown-menu {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 16px;
  font-size: 0.875rem;
  color: #495057;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #16181b;
}

.dropdown-item:active {
  background-color: #e9ecef;
  color: #16181b;
}

/* Garantir que os dropdowns fiquem visíveis */
.dropdown-menu.show {
  display: block;
}
</style> 