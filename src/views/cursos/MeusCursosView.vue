<template>
  <div class="meus-cursos-container">
    <!-- Header da página -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <p class="text-dark fs-6 mb-0">Acompanhe seu progresso e gerencie seus estudos</p>
        </div>
        <div class="col-auto">
          <router-link to="/cursos" class="btn btn-outline-primary">
            <i class="ti ti-plus me-2"></i>
            Explorar Cursos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Estados de carregamento e erro -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando seus cursos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <!-- Resumo estatístico -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <div class="mb-2">
                <i class="ti ti-trophy text-success fs-2"></i>
              </div>
              <h3 class="h4 mb-1 text-success">{{ cursosFinalizados.length }}</h3>
              <p class="text-muted small mb-0">Cursos Concluídos</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <div class="mb-2">
                <i class="ti ti-clock text-primary fs-2"></i>
              </div>
              <h3 class="h4 mb-1 text-primary">{{ cursosEmAndamento.length }}</h3>
              <p class="text-muted small mb-0">Em Andamento</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <div class="mb-2">
                <i class="ti ti-clock-hour-4 text-warning fs-2"></i>
              </div>
              <h3 class="h4 mb-1 text-warning">{{ horasTotaisEstudadas }}</h3>
              <p class="text-muted small mb-0">Horas Estudadas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cursos em Andamento -->
      <div v-if="cursosEmAndamento.length > 0" class="mb-5">
        <div class="d-flex align-items-center mb-3">
          <h3 class="h5 mb-0">
            <i class="ti ti-play-circle text-primary me-2"></i>
            Cursos em Andamento
          </h3>
          <span class="badge bg-primary ms-2">{{ cursosEmAndamento.length }}</span>
        </div>

        <div class="row">
          <div 
            v-for="curso in cursosEmAndamento" 
            :key="curso.id"
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card border-0 shadow-sm h-100 curso-card">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <h5 class="card-title mb-2">{{ curso.titulo }}</h5>
                  <p class="text-muted small mb-2">{{ curso.instrutor }}</p>
                  <span class="badge bg-light text-dark">{{ curso.duracao }}h</span>
                </div>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="text-muted">Progresso</small>
                    <small class="text-primary fw-medium">{{ curso.progresso }}%</small>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div 
                      class="progress-bar bg-primary" 
                      :style="{ width: curso.progresso + '%' }"
                    ></div>
                  </div>
                </div>

                <div class="mt-auto">
                  <router-link 
                    :to="`/curso/${curso.id}`"
                    class="btn btn-primary w-100"
                  >
                    <i class="ti ti-play me-2"></i>
                    Continuar Estudos
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cursos Finalizados -->
      <div v-if="cursosFinalizados.length > 0" class="mb-5">
        <div class="d-flex align-items-center mb-3">
          <h3 class="h5 mb-0">
            <i class="ti ti-check-circle text-success me-2"></i>
            Cursos Concluídos
          </h3>
          <span class="badge bg-success ms-2">{{ cursosFinalizados.length }}</span>
        </div>

        <div class="row">
          <div 
            v-for="curso in cursosFinalizados" 
            :key="curso.id"
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card border-0 shadow-sm h-100 curso-card curso-concluido">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <div class="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 class="card-title mb-2">{{ curso.titulo }}</h5>
                      <p class="text-muted small mb-2">{{ curso.instrutor }}</p>
                      <span class="badge bg-light text-dark">{{ curso.duracao }}h</span>
                    </div>
                    <i class="ti ti-trophy text-success fs-4"></i>
                  </div>
                </div>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="text-success fw-medium">Concluído</small>
                    <small class="text-success fw-bold">100%</small>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-success" style="width: 100%"></div>
                  </div>
                </div>

                <div class="mb-2">
                  <small class="text-muted">
                    <i class="ti ti-calendar me-1"></i>
                    Concluído em {{ formatarData(curso.dataConclusao) }}
                  </small>
                </div>

                <div class="mt-auto d-grid gap-2">
                  <router-link 
                    :to="`/curso/${curso.id}`"
                    class="btn btn-outline-primary"
                  >
                    <i class="ti ti-eye me-2"></i>
                    Revisar Conteúdo
                  </router-link>
                  <router-link 
                    to="/certificados"
                    class="btn btn-success"
                  >
                    <i class="ti ti-certificate me-2"></i>
                    Ver Certificado
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-if="cursosEmAndamento.length === 0 && cursosFinalizados.length === 0" class="text-center py-5">
        <div class="mb-4">
          <i class="ti ti-book-off display-4 text-muted"></i>
        </div>
        <h4 class="h5 mb-3">Você ainda não se matriculou em nenhum curso</h4>
        <p class="text-muted mb-4">
          Explore nossa biblioteca de cursos e comece sua jornada de aprendizado hoje mesmo!
        </p>
        <router-link to="/cursos" class="btn btn-primary">
          <i class="ti ti-search me-2"></i>
          Explorar Cursos Disponíveis
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { currentUser } = useAuth()

// Estados reativos
const loading = ref(true)
const error = ref('')
const matriculas = ref<any[]>([])

// Dados dos cursos (mesmo da IndexView)
const getCursosData = () => [
  {
    id: 1,
    nome: 'Desenvolvimento Web com HTML5 e CSS3',
    instrutor: 'Prof. Ana Silva',
    duracao: 40,
  },
  {
    id: 2,
    nome: 'JavaScript Avançado e ES6+',
    instrutor: 'Prof. Carlos Mendes',
    duracao: 60,
  },
  {
    id: 3,
    nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
    instrutor: 'Prof. Marina Costa',
    duracao: 120,
  },
  {
    id: 4,
    nome: 'Banco de Dados SQL e NoSQL',
    instrutor: 'Prof. Roberto Lima',
    duracao: 80,
  },
  {
    id: 5,
    nome: 'Inteligência Artificial e Machine Learning',
    instrutor: 'Prof. Fernanda Alves',
    duracao: 160,
  },
  {
    id: 6,
    nome: 'DevOps e Integração Contínua',
    instrutor: 'Prof. João Santos',
    duracao: 90,
  },
  {
    id: 7,
    nome: 'Gestão Pública',
    instrutor: 'Prof. Paula Rodrigues',
    duracao: 80,
  },
  {
    id: 8,
    nome: 'Administração Financeira',
    instrutor: 'Prof. André Martins',
    duracao: 70,
  },
  {
    id: 9,
    nome: 'Recursos Humanos',
    instrutor: 'Prof. Luciana Ferreira',
    duracao: 60,
  },
  {
    id: 10,
    nome: 'Direito Constitucional',
    instrutor: 'Prof. Ricardo Oliveira',
    duracao: 100,
  },
  {
    id: 11,
    nome: 'Direito Administrativo',
    instrutor: 'Prof. Beatriz Souza',
    duracao: 120,
  },
  {
    id: 12,
    nome: 'Direito Civil',
    instrutor: 'Prof. Gabriel Nascimento',
    duracao: 90,
  }
]

// Computed properties
const cursosEmAndamento = computed(() => {
  return matriculas.value
    .filter(m => m.progresso > 0 && m.progresso < 100)
    .map(matricula => {
      const cursoData = getCursosData().find(c => c.id === matricula.cursoId)
      return {
        ...cursoData,
        ...matricula,
        titulo: cursoData?.nome || 'Curso não encontrado'
      }
    })
})

const cursosFinalizados = computed(() => {
  return matriculas.value
    .filter(m => m.progresso === 100)
    .map(matricula => {
      const cursoData = getCursosData().find(c => c.id === matricula.cursoId)
      return {
        ...cursoData,
        ...matricula,
        titulo: cursoData?.nome || 'Curso não encontrado'
      }
    })
})

const horasTotaisEstudadas = computed(() => {
  return cursosFinalizados.value.reduce((total, curso) => {
    return total + (curso.duracao || 0)
  }, 0)
})

// Buscar matrículas do usuário
const buscarMatriculas = async () => {
  try {
    loading.value = true
    
    if (!currentUser.value?.id) {
      error.value = 'Usuário não autenticado'
      return
    }

    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 500))

    // Buscar todas as matrículas do localStorage
    const matriculasEncontradas: any[] = []
    
    // Percorrer todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`matricula_`) && key.endsWith(`_${currentUser.value.id}`)) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const matricula = JSON.parse(data)
            matriculasEncontradas.push(matricula)
          }
        } catch (err) {
          console.error('Erro ao parsear matrícula:', err)
        }
      }
    }

    matriculas.value = matriculasEncontradas
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar cursos'
  } finally {
    loading.value = false
  }
}

// Formatação de data
const formatarData = (dataISO: string) => {
  try {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}

// Inicializar
onMounted(() => {
  buscarMatriculas()
})
</script>

<style scoped>
.meus-cursos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.curso-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.curso-concluido {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-left: 4px solid #28a745;
}

.progress {
  border-radius: 10px;
  background-color: #f8f9fa;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.6s ease;
}

.card-title {
  font-weight: 600;
  color: #2d3748;
  line-height: 1.3;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .meus-cursos-container {
    padding: 15px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .page-header .row {
    text-align: center;
  }
  
  .page-header .col-auto {
    margin-top: 15px;
  }
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.curso-card {
  animation: fadeInUp 0.5s ease-out;
}
</style> 