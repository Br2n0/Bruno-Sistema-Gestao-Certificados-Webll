<template>
  <div class="estudo-container">
    <!-- Breadcrumb minimalista -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/cursos" class="text-decoration-none text-primary">
            <i class="ti ti-book me-1"></i>Cursos
          </router-link>
        </li>
        <li class="breadcrumb-item active text-muted">
          {{ curso?.titulo || 'Carregando...' }}
        </li>
      </ol>
    </nav>

    <!-- Estado de carregamento -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando ambiente de estudos...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Ambiente Virtual de Estudos -->
    <div v-else-if="curso" class="ambiente-virtual">
      
      <!-- Header do Curso -->
      <div class="curso-header mb-4">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="h4 mb-2 text-dark">{{ curso.titulo }}</h1>
            <div class="curso-meta">
              <span class="me-3">
                <i class="ti ti-user text-primary me-1"></i>
                {{ curso.instrutor || 'Instrutor não informado' }}
              </span>
              <span class="me-3">
                <i class="ti ti-clock text-primary me-1"></i>
                {{ curso.duracao }}h
              </span>
              <span v-if="curso.preco > 0">
                <i class="ti ti-currency-real text-primary me-1"></i>
                R$ {{ curso.preco.toFixed(2) }}
              </span>
              <span v-else class="text-success">
                <i class="ti ti-gift me-1"></i>Gratuito
              </span>
            </div>
          </div>
          <div class="col-md-4 text-md-end">
            <div class="progresso-geral">
              <small class="text-muted d-block mb-1">Seu progresso</small>
              <div class="progress mb-2" style="height: 8px;">
                <div 
                  class="progress-bar bg-primary" 
                  :style="{ width: progresso + '%' }"
                ></div>
              </div>
              <small class="text-primary fw-medium">{{ progresso }}% concluído</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Área Principal de Estudos -->
      <div class="ambiente-principal">
        
        <!-- Mensagem de Matrícula -->
        <div v-if="!matriculado" class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <div class="mb-4">
              <i class="ti ti-school display-4 text-primary"></i>
            </div>
            <h3 class="h5 mb-3">Iniciar Jornada de Aprendizado</h3>
            <p class="text-muted mb-4">
              Você será automaticamente matriculado para começar seus estudos neste curso.
            </p>
            <button 
              class="btn btn-primary btn-lg px-4"
              @click="iniciarCurso"
              :disabled="iniciando"
            >
              <span v-if="iniciando" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="ti ti-play me-2"></i>
              {{ iniciando ? 'Iniciando...' : 'Começar Agora' }}
            </button>
          </div>
        </div>

        <!-- Módulos do Curso -->
        <div v-else class="modulos-container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="h5 mb-0">Módulos do Curso</h3>
            <small class="text-muted">{{ getModulosConcluidos() }}/3 módulos concluídos</small>
          </div>

          <!-- Lista de Módulos -->
          <div class="modulos-list">
            
            <!-- Módulo 1 -->
            <div class="modulo-card mb-3" :class="{ 'modulo-ativo': progresso >= 0 && progresso < 33 }">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center">
                    <div class="modulo-status me-3">
                      <i v-if="progresso > 33" class="ti ti-check-circle text-success fs-4"></i>
                      <i v-else-if="progresso > 0" class="ti ti-play-circle text-primary fs-4"></i>
                      <i v-else class="ti ti-circle-dashed text-muted fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h4 class="h6 mb-1">Módulo 1: Fundamentos</h4>
                      <p class="text-muted small mb-0">Conceitos básicos e introdução ao tema principal</p>
                    </div>
                    <div class="modulo-badge">
                      <span v-if="progresso > 33" class="badge bg-success">Concluído</span>
                      <span v-else-if="progresso > 0" class="badge bg-primary">Em andamento</span>
                      <span v-else class="badge bg-light text-muted">Não iniciado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Módulo 2 -->
            <div class="modulo-card mb-3" :class="{ 'modulo-ativo': progresso >= 33 && progresso < 66 }">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center">
                    <div class="modulo-status me-3">
                      <i v-if="progresso > 66" class="ti ti-check-circle text-success fs-4"></i>
                      <i v-else-if="progresso >= 33" class="ti ti-play-circle text-primary fs-4"></i>
                      <i v-else class="ti ti-lock text-muted fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h4 class="h6 mb-1">Módulo 2: Desenvolvimento</h4>
                      <p class="text-muted small mb-0">Aplicação prática dos conceitos aprendidos</p>
                    </div>
                    <div class="modulo-badge">
                      <span v-if="progresso > 66" class="badge bg-success">Concluído</span>
                      <span v-else-if="progresso >= 33" class="badge bg-primary">Em andamento</span>
                      <span v-else class="badge bg-light text-muted">Bloqueado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Módulo 3 -->
            <div class="modulo-card mb-4" :class="{ 'modulo-ativo': progresso >= 66 && progresso < 100 }">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center">
                    <div class="modulo-status me-3">
                      <i v-if="progresso === 100" class="ti ti-check-circle text-success fs-4"></i>
                      <i v-else-if="progresso >= 66" class="ti ti-play-circle text-primary fs-4"></i>
                      <i v-else class="ti ti-lock text-muted fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h4 class="h6 mb-1">Módulo 3: Projeto Final</h4>
                      <p class="text-muted small mb-0">Consolidação e certificação dos conhecimentos</p>
                    </div>
                    <div class="modulo-badge">
                      <span v-if="progresso === 100" class="badge bg-success">Concluído</span>
                      <span v-else-if="progresso >= 66" class="badge bg-primary">Em andamento</span>
                      <span v-else class="badge bg-light text-muted">Bloqueado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Controles de Ação -->
            <div class="acoes-curso text-center">
              
              <!-- Botão Continuar -->
              <div v-if="progresso < 100" class="mb-3">
                <button 
                  class="btn btn-primary btn-lg px-5"
                  @click="avancarProgresso"
                  :disabled="atualizandoProgresso"
                >
                  <span v-if="atualizandoProgresso" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="ti ti-play me-2"></i>
                                     {{ getTextoAcao }}
                </button>
                <p class="text-muted small mt-2 mb-0">
                  Clique para simular o progresso do módulo atual
                </p>
              </div>

              <!-- Finalizar Curso -->
              <div v-if="progresso === 100 && !certificadoGerado" class="mb-3">
                <button 
                  class="btn btn-success btn-lg px-5"
                  @click="finalizarCurso"
                  :disabled="finalizando"
                >
                  <span v-if="finalizando" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="ti ti-certificate me-2"></i>
                  {{ finalizando ? 'Gerando certificado...' : 'Finalizar e Certificar' }}
                </button>
                <p class="text-success small mt-2 mb-0">
                  <i class="ti ti-trophy me-1"></i>
                  Parabéns! Você está pronto para obter seu certificado
                </p>
              </div>

              <!-- Certificado Gerado -->
              <div v-if="certificadoGerado" class="certificado-sucesso">
                <div class="alert alert-success border-0 shadow-sm">
                  <div class="text-center">
                    <i class="ti ti-trophy display-5 text-success mb-3"></i>
                    <h4 class="alert-heading h5">Curso Concluído com Sucesso!</h4>
                    <p class="mb-3">
                      Seu certificado foi gerado automaticamente e está disponível para download.
                    </p>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                      <router-link 
                        to="/certificados" 
                        class="btn btn-outline-primary"
                      >
                        <i class="ti ti-eye me-2"></i>
                        Ver Meus Certificados
                      </router-link>
                      <button 
                        class="btn btn-primary"
                        @click="baixarCertificado"
                      >
                        <i class="ti ti-download me-2"></i>
                        Baixar Certificado
                      </button>
                    </div>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentUser } = useAuth()

// Estados reativos
const loading = ref(true)
const error = ref('')
const curso = ref<any>(null)
const matriculado = ref(false)
const progresso = ref(0)
const iniciando = ref(false)
const atualizandoProgresso = ref(false)
const finalizando = ref(false)
const certificadoGerado = ref(false)

// Computed properties
const getTextoAcao = computed(() => {
  if (progresso.value === 0) return 'Iniciar Módulo 1'
  if (progresso.value < 33) return 'Concluir Módulo 1'
  if (progresso.value < 66) return 'Concluir Módulo 2'
  if (progresso.value < 100) return 'Concluir Módulo 3'
  return 'Curso Concluído'
})

const getModulosConcluidos = () => {
  if (progresso.value === 100) return 3
  if (progresso.value >= 66) return 2
  if (progresso.value >= 33) return 1
  return 0
}

// Dados dos cursos (mesmos da IndexView)
const getCursosData = () => [
  {
    id: 1,
    nome: 'Desenvolvimento Web com HTML5 e CSS3',
    descricao: 'Saiba mais sobre os conceitos fundamentais de HTML5 e CSS3 com este curso básico!',
    area: 'tecnologia',
    duracao: 40,
    instrutor: 'Prof. Ana Silva'
  },
  {
    id: 2,
    nome: 'JavaScript Avançado e ES6+',
    descricao: 'Aprenda JavaScript moderno, incluindo recursos avançados do ES6 e além!',
    area: 'tecnologia',
    duracao: 60,
    instrutor: 'Prof. Carlos Mendes'
  },
  {
    id: 3,
    nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
    descricao: 'Domine o desenvolvimento full stack com Vue.js no frontend e Node.js no backend!',
    area: 'tecnologia',
    duracao: 120,
    instrutor: 'Prof. Marina Costa'
  },
  {
    id: 4,
    nome: 'Banco de Dados SQL e NoSQL',
    descricao: 'Aprenda a projetar e gerenciar bancos de dados relacionais e não-relacionais!',
    area: 'tecnologia',
    duracao: 80,
    instrutor: 'Prof. Roberto Lima'
  },
  {
    id: 5,
    nome: 'Inteligência Artificial e Machine Learning',
    descricao: 'Aprenda conceitos fundamentais de IA e Machine Learning para análise de dados!',
    area: 'tecnologia',
    duracao: 160,
    instrutor: 'Prof. Fernanda Alves'
  },
  {
    id: 6,
    nome: 'DevOps e Integração Contínua',
    descricao: 'Domine práticas de DevOps e técnicas de integração e entrega contínuas!',
    area: 'tecnologia',
    duracao: 90,
    instrutor: 'Prof. João Santos'
  },
  {
    id: 7,
    nome: 'Gestão Pública',
    descricao: 'Aprenda os fundamentos da administração pública e gestão de recursos públicos!',
    area: 'administrativa',
    duracao: 80,
    instrutor: 'Prof. Paula Rodrigues'
  },
  {
    id: 8,
    nome: 'Administração Financeira',
    descricao: 'Domine técnicas de administração financeira e orçamentária no setor público!',
    area: 'administrativa',
    duracao: 70,
    instrutor: 'Prof. André Martins'
  },
  {
    id: 9,
    nome: 'Recursos Humanos',
    descricao: 'Aprenda sobre gestão de pessoas, recrutamento e desenvolvimento profissional!',
    area: 'administrativa',
    duracao: 60,
    instrutor: 'Prof. Luciana Ferreira'
  },
  {
    id: 10,
    nome: 'Direito Constitucional',
    descricao: 'Estude os princípios fundamentais da Constituição Federal e sua aplicação!',
    area: 'juridica',
    duracao: 100,
    instrutor: 'Prof. Ricardo Oliveira'
  },
  {
    id: 11,
    nome: 'Direito Administrativo',
    descricao: 'Compreenda a organização e funcionamento da Administração Pública!',
    area: 'juridica',
    duracao: 120,
    instrutor: 'Prof. Beatriz Souza'
  },
  {
    id: 12,
    nome: 'Direito Civil',
    descricao: 'Estude as relações jurídicas entre pessoas físicas e jurídicas no âmbito privado!',
    area: 'juridica',
    duracao: 90,
    instrutor: 'Prof. Gabriel Nascimento'
  }
]

// Buscar dados do curso real
const buscarCurso = async () => {
  try {
    loading.value = true
    const cursoId = parseInt(route.params.id as string)
    
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Buscar curso real pelos dados
    const cursosData = getCursosData()
    const cursoEncontrado = cursosData.find(c => c.id === cursoId)
    
    if (!cursoEncontrado) {
      throw new Error('Curso não encontrado')
    }
    
    curso.value = {
      id: cursoEncontrado.id,
      titulo: cursoEncontrado.nome,
      descricao: cursoEncontrado.descricao,
      instrutor: cursoEncontrado.instrutor,
      duracao: cursoEncontrado.duracao,
      preco: 0 // Todos os cursos são gratuitos
    }
    
    await verificarMatricula()
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar curso'
  } finally {
    loading.value = false
  }
}

// Verificar matrícula existente
const verificarMatricula = async () => {
  if (!currentUser.value?.id) return
  
  const matriculaKey = `matricula_${curso.value?.id}_${currentUser.value.id}`
  const matriculaData = localStorage.getItem(matriculaKey)
  
  if (matriculaData) {
    const dados = JSON.parse(matriculaData)
    matriculado.value = true
    progresso.value = dados.progresso || 0
    certificadoGerado.value = dados.certificadoGerado || false
  }
}

// Iniciar curso (matrícula simulada)
const iniciarCurso = async () => {
  try {
    iniciando.value = true
    
    if (!currentUser.value?.id) {
      router.push('/login')
      return
    }

    // Simular matrícula (sem API)
    await new Promise(resolve => setTimeout(resolve, 800)) // Simular carregamento

    // Salvar matrícula local
    const dadosMatricula = {
      cursoId: curso.value?.id || 0,
      alunoId: currentUser.value?.id || 0,
      progresso: 0,
      dataInicio: new Date().toISOString(),
      certificadoGerado: false
    }
    
    localStorage.setItem(
      `matricula_${curso.value?.id}_${currentUser.value?.id}`, 
      JSON.stringify(dadosMatricula)
    )
    
    matriculado.value = true
    progresso.value = 0
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao iniciar curso'
  } finally {
    iniciando.value = false
  }
}

// Avançar progresso
const avancarProgresso = async () => {
  try {
    atualizandoProgresso.value = true
    
    // Simular progresso
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (progresso.value < 100) {
      const novoProgresso = Math.min(progresso.value + 33, 100)
      progresso.value = novoProgresso
      
      // Salvar progresso
      const matriculaKey = `matricula_${curso.value?.id}_${currentUser.value?.id}`
      const dadosMatricula = JSON.parse(localStorage.getItem(matriculaKey) || '{}')
      dadosMatricula.progresso = novoProgresso
      localStorage.setItem(matriculaKey, JSON.stringify(dadosMatricula))
    }
    
  } catch (err) {
    error.value = 'Erro ao atualizar progresso'
  } finally {
    atualizandoProgresso.value = false
  }
}

// Finalizar curso e gerar certificado (simulado)
const finalizarCurso = async () => {
  try {
    finalizando.value = true
    
    if (!currentUser.value?.id) return

    // Simular geração de certificado (sem API)
    await new Promise(resolve => setTimeout(resolve, 1200)) // Simular carregamento

    // Atualizar estado local
    const matriculaKey = `matricula_${curso.value?.id}_${currentUser.value?.id}`
    const dadosMatricula = JSON.parse(localStorage.getItem(matriculaKey) || '{}')
    dadosMatricula.certificadoGerado = true
    dadosMatricula.dataConclusao = new Date().toISOString()
    localStorage.setItem(matriculaKey, JSON.stringify(dadosMatricula))
    
    certificadoGerado.value = true
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao finalizar curso'
  } finally {
    finalizando.value = false
  }
}

// Baixar certificado (placeholder)
const baixarCertificado = () => {
  // Por enquanto, redirecionar para certificados
  router.push('/certificados')
}

// Inicializar
onMounted(() => {
  buscarCurso()
})
</script>

<style scoped>
.estudo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.curso-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.curso-meta {
  color: #6c757d;
  font-size: 14px;
}

.progresso-geral .progress {
  border-radius: 10px;
  background-color: #f8f9fa;
}

.ambiente-principal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.modulos-container {
  padding: 32px;
}

.modulo-card {
  transition: all 0.3s ease;
}

.modulo-card.modulo-ativo {
  transform: translateX(4px);
}

.modulo-card.modulo-ativo .card {
  border-left: 4px solid #4f46e5 !important;
  background: rgba(79, 70, 229, 0.02);
}

.modulo-status {
  flex-shrink: 0;
}

.modulo-badge .badge {
  font-size: 11px;
  padding: 6px 12px;
}

.acoes-curso {
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
  margin-top: 24px;
}

.certificado-sucesso {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .estudo-container {
    padding: 15px;
  }
  
  .curso-header {
    padding: 20px;
  }
  
  .modulos-container {
    padding: 24px 20px;
  }
  
  .curso-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .curso-meta span {
    margin-right: 0 !important;
  }
}

/* Estados hover */
.modulo-card:hover .card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Progress bar customizada */
.progress-bar {
  transition: width 0.6s ease;
}
</style> 