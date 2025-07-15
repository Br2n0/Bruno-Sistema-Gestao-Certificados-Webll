<template>
  <div class="estudo-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando curso...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Main Content -->
    <div v-else-if="curso">
      <!-- Header do Curso -->
      <div class="curso-header mb-4">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-2">{{ curso.titulo }}</h1>
            <div class="curso-meta">
              <span class="badge bg-primary me-2">{{ curso.duracao }}h</span>
              <span class="text-muted" v-if="curso.instrutor">
                <i class="ti ti-user me-1"></i>{{ curso.instrutor }}
              </span>
            </div>
          </div>
          <div class="col-auto">
            <router-link to="/cursos" class="btn btn-outline-secondary">
              <i class="ti ti-arrow-left me-2"></i>Voltar aos Cursos
            </router-link>
          </div>
        </div>
      </div>

      <!-- Progresso Geral -->
      <div class="progresso-geral mb-4" v-if="matriculado">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-medium">Progresso do Curso</span>
          <span class="text-primary fw-bold">{{ progresso }}%</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar bg-primary" 
            :style="{ width: progresso + '%' }"
          ></div>
        </div>
      </div>

      <!-- Ambiente Principal -->
      <div class="ambiente-principal">
        <!-- Não Matriculado -->
        <div v-if="!matriculado" class="text-center py-5">
          <div class="mb-4">
            <i class="ti ti-lock-open display-1 text-primary mb-3"></i>
            <h3>Iniciar Curso</h3>
            <p class="text-muted mb-4">{{ curso.descricao }}</p>
          </div>
          <button 
            class="btn btn-primary btn-lg" 
            @click="iniciarCurso"
            :disabled="iniciando"
          >
            <span v-if="iniciando" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="ti ti-play me-2"></i>
            {{ iniciando ? 'Matriculando...' : 'Iniciar Curso Gratuito' }}
          </button>
        </div>

        <!-- Matriculado - Módulos do Curso -->
        <div v-else class="modulos-container">
          <h4 class="mb-4">Conteúdo do Curso</h4>
          
          <div class="row">
            <div class="col-md-8">
              <!-- Módulos -->
              <div class="mb-4">
                <div 
                  v-for="(modulo, index) in modulos" 
                  :key="index"
                  class="modulo-card mb-3"
                  :class="{ 'modulo-ativo': index === moduloAtivo }"
                >
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="mb-1">{{ modulo.titulo }}</h6>
                          <p class="text-muted mb-0 small">{{ modulo.descricao }}</p>
                        </div>
                        <div class="modulo-status">
                          <span 
                            class="badge modulo-badge"
                            :class="getBadgeClass(modulo.status)"
                          >
                            {{ getStatusLabel(modulo.status) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ações -->
              <div class="acoes-curso">
                <div class="d-flex gap-3">
                  <button 
                    v-if="progresso < 100"
                    class="btn btn-primary"
                    @click="avancarProgresso"
                    :disabled="atualizandoProgresso"
                  >
                    <span v-if="atualizandoProgresso" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="ti ti-player-play me-2"></i>
                    {{ getProximaAcaoLabel }}
                  </button>

                  <button 
                    v-if="progresso === 100 && !certificadoGerado"
                    class="btn btn-success"
                    @click="finalizarCurso"
                    :disabled="finalizando"
                  >
                    <span v-if="finalizando" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="ti ti-certificate me-2"></i>
                    {{ finalizando ? 'Gerando...' : 'Gerar Certificado' }}
                  </button>

                  <router-link 
                    v-if="certificadoGerado"
                    to="/certificados"
                    class="btn btn-success"
                  >
                    <i class="ti ti-certificate me-2"></i>
                    Ver Certificado
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Sidebar Info -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h6 class="mb-0">Informações do Curso</h6>
                </div>
                <div class="card-body">
                  <div class="info-item mb-3">
                    <i class="ti ti-clock text-primary me-2"></i>
                    <span>{{ curso.duracao }} horas</span>
                  </div>
                  <div class="info-item mb-3" v-if="curso.instrutor">
                    <i class="ti ti-user text-primary me-2"></i>
                    <span>{{ curso.instrutor }}</span>
                  </div>
                  <div class="info-item mb-3">
                    <i class="ti ti-certificate text-primary me-2"></i>
                    <span>Certificado Incluído</span>
                  </div>
                  <div class="info-item">
                    <i class="ti ti-device-mobile text-primary me-2"></i>
                    <span>Acesso Mobile</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import apiService, { StatusMatricula } from '@/services/apiService'
import type { CursoDTO, MatriculaDTO } from '@/services/apiService'

// Estados reativos
const curso = ref<{
  id: number
  titulo: string
  descricao: string
  instrutor: string
  duracao: number
} | null>(null)

const matricula = ref<MatriculaDTO | null>(null)
const loading = ref(false)
const error = ref('')
const iniciando = ref(false)
const atualizandoProgresso = ref(false)
const finalizando = ref(false)

// Estados de progresso
const matriculado = ref(false)
const progresso = ref(0)
const certificadoGerado = ref(false)
const moduloAtivo = ref(0)

// Composables
const route = useRoute()
const router = useRouter()
const { isAuthenticated, currentUser } = useAuth()

// Módulos do curso (estrutura fixa para demonstração)
const modulos = ref([
  {
    titulo: 'Módulo 1: Introdução',
    descricao: 'Conceitos fundamentais e overview do curso',
    status: 'concluido'
  },
  {
    titulo: 'Módulo 2: Desenvolvimento',
    descricao: 'Práticas e implementação',
    status: progresso.value >= 66 ? 'concluido' : progresso.value >= 33 ? 'ativo' : 'bloqueado'
  },
  {
    titulo: 'Módulo 3: Finalização',
    descricao: 'Projeto final e avaliação',
    status: progresso.value === 100 ? 'concluido' : progresso.value >= 66 ? 'ativo' : 'bloqueado'
  }
])

// Computed properties
const getProximaAcaoLabel = computed(() => {
  if (atualizandoProgresso.value) return 'Atualizando...'
  if (progresso.value === 0) return 'Começar Módulo 1'
  if (progresso.value === 33) return 'Continuar para Módulo 2'
  if (progresso.value === 66) return 'Continuar para Módulo 3'
  return 'Finalizar Curso'
})

// Métodos
const getBadgeClass = (status: string): string => {
  switch (status) {
    case 'concluido': return 'bg-success'
    case 'ativo': return 'bg-primary'
    case 'bloqueado': return 'bg-secondary'
    default: return 'bg-secondary'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'concluido': return 'Concluído'
    case 'ativo': return 'Em Andamento'
    case 'bloqueado': return 'Bloqueado'
    default: return 'Pendente'
  }
}

// Buscar dados do curso
const buscarCurso = async () => {
  try {
    loading.value = true
    const cursoId = parseInt(route.params.id as string)
    
    const cursoDTO = await apiService.getCurso(cursoId)
    
    if (!cursoDTO) {
      throw new Error('Curso não encontrado')
    }
    
    curso.value = {
      id: cursoDTO.ID,
      titulo: cursoDTO.Titulo,
      descricao: cursoDTO.Descricao || 'Descrição não disponível',
      instrutor: cursoDTO.Instrutor || 'Instrutor não informado',
      duracao: cursoDTO.Duracao
    }
    
    await verificarMatricula()
    
  } catch (err: any) {
    console.error('Erro ao carregar curso:', err)
    error.value = err.message || 'Erro ao carregar curso'
  } finally {
    loading.value = false
  }
}

// Verificar se usuário está matriculado
const verificarMatricula = async () => {
  if (!currentUser.value?.id || !curso.value?.id) return
  
  try {
    const matriculas = await apiService.getMatriculas()
    const matriculaEncontrada = matriculas.find(m => 
      m.Aluno_ID === currentUser.value!.id && m.Curso_ID === curso.value!.id
    )
    
    if (matriculaEncontrada) {
      matricula.value = matriculaEncontrada
      matriculado.value = true
      
      // Simular progresso baseado no status
      if (matriculaEncontrada.Status === 1) { // Concluída
        progresso.value = 100
        certificadoGerado.value = true
      } else {
        progresso.value = 33 // Progresso padrão para matrícula ativa
      }
      
      atualizarModulos()
    }
  } catch (err) {
    console.error('Erro ao verificar matrícula:', err)
  }
}

// Atualizar status dos módulos
const atualizarModulos = () => {
  modulos.value[0].status = 'concluido'
  modulos.value[1].status = progresso.value >= 66 ? 'concluido' : progresso.value >= 33 ? 'ativo' : 'bloqueado'
  modulos.value[2].status = progresso.value === 100 ? 'concluido' : progresso.value >= 66 ? 'ativo' : 'bloqueado'
  
  // Definir módulo ativo
  if (progresso.value < 33) moduloAtivo.value = 0
  else if (progresso.value < 66) moduloAtivo.value = 1
  else moduloAtivo.value = 2
}

// Iniciar curso (criar matrícula)
const iniciarCurso = async () => {
  try {
    iniciando.value = true
    
    if (!currentUser.value?.id) {
      router.push('/login')
      return
    }

    if (!curso.value?.id) return

    const novaMatricula = await apiService.createMatricula({
      Curso_ID: curso.value.id,
      Aluno_ID: currentUser.value.id
    })
    
    if (novaMatricula) {
      matricula.value = novaMatricula
      matriculado.value = true
      progresso.value = 0
      atualizarModulos()
    }
    
  } catch (err: any) {
    console.error('Erro ao iniciar curso:', err)
    error.value = 'Erro ao se matricular no curso. Tente novamente.'
  } finally {
    iniciando.value = false
  }
}

// Avançar progresso
const avancarProgresso = async () => {
  try {
    atualizandoProgresso.value = true
    
    // Simular progresso em etapas
    let novoProgresso = 0
    if (progresso.value === 0) novoProgresso = 33
    else if (progresso.value === 33) novoProgresso = 66
    else if (progresso.value === 66) novoProgresso = 100
    
    progresso.value = novoProgresso
    atualizarModulos()
    
         // Se completou 100%, atualizar status da matrícula
     // if (novoProgresso === 100 && matricula.value) {
     //   await apiService.updateMatricula(matricula.value.ID, { Status: StatusMatricula.Concluida })
     // }
    
  } catch (err) {
    console.error('Erro ao atualizar progresso:', err)
    error.value = 'Erro ao atualizar progresso'
  } finally {
    atualizandoProgresso.value = false
  }
}

// Finalizar curso e gerar certificado
const finalizarCurso = async () => {
  try {
    finalizando.value = true
    
    if (!currentUser.value?.id || !curso.value?.id) return

    // Criar certificado
    await apiService.createCertificado({
      Curso_ID: curso.value.id,
      Aluno_ID: currentUser.value.id
    })
    
    certificadoGerado.value = true
    
  } catch (err: any) {
    console.error('Erro ao gerar certificado:', err)
    error.value = 'Erro ao gerar certificado. Tente novamente.'
  } finally {
    finalizando.value = false
  }
}

// Inicializar
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
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
  background-color: #e9ecef;
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
  border-left: 4px solid #2c3cdc !important;
  background: rgba(44, 60, 220, 0.02);
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

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style> 