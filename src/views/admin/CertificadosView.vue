<template>
  <div class="container-fluid px-4">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Gestão de Certificados</h1>
      <div class="alert alert-warning">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Aviso:</strong> A criação de certificados deve ser feita através do sistema de matrículas.
        Esta seção é apenas para visualização e validação.
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total de Certificados
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalCertificados }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-certificate fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                  Nota Média
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ notaMedia }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-chart-line fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando certificados...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      <button @click="loadCertificados" class="btn btn-sm btn-outline-danger ms-2">Tentar novamente</button>
    </div>

    <!-- Tabela de Certificados -->
    <div v-else class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Lista de Certificados</h6>
      </div>
      <div class="card-body">
        <div v-if="certificados.length === 0" class="text-center py-5">
          <i class="fas fa-certificate fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Nenhum certificado encontrado</h5>
          <p class="text-muted">Os certificados são gerados automaticamente quando as matrículas são concluídas.</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Aluno</th>
                <th>Curso</th>
                <th>Nota Final</th>
                <th>Carga Horária</th>
                <th>Data Emissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="certificado in certificados" :key="certificado.id">
                <td>{{ certificado.id }}</td>
                <td>{{ certificado.codigo }}</td>
                <td>{{ certificado.aluno }}</td>
                <td>{{ certificado.curso }}</td>
                <td>
                  <span v-if="certificado.notaFinal" :class="['badge', getNotaBadgeClass(certificado.notaFinal)]">
                    {{ certificado.notaFinal.toFixed(1) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>
                  {{ certificado.cargaHoraria ? `${certificado.cargaHoraria}h` : '-' }}
                </td>
                <td>{{ formatDate(certificado.dataEmissao) }}</td>
                <td>
                  <button 
                    type="button"
                    class="btn btn-success btn-sm me-2"
                    @click="downloadCertificado(certificado)"
                    title="Download"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn btn-info btn-sm me-2"
                    @click="validarCertificado(certificado.codigo)"
                    title="Validar"
                  >
                    <i class="fas fa-check-circle"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Validação -->
    <div class="modal fade" id="validationModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Validar Certificado</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <label for="codigoValidacao" class="form-label">Código de Validação</label>
              <input 
                type="text" 
                class="form-control" 
                id="codigoValidacao"
                v-model="codigoValidacao"
                placeholder="Digite o código do certificado"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="validarCertificadoPorCodigo" :disabled="!codigoValidacao">
              Validar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dataService, type Certificado } from '@/services/dataService'
import { useBootstrap } from '@/composables/useBootstrap'

const { showModal, hideModal, createSimpleToast } = useBootstrap()

// Estado reativo
const certificados = ref<Certificado[]>([])
const loading = ref(false)
const error = ref('')
const codigoValidacao = ref('')

// Computed properties para estatísticas
const totalCertificados = computed(() => certificados.value.length)
const notaMedia = computed(() => {
  const certificadosComNota = certificados.value.filter(cert => cert.notaFinal)
  if (certificadosComNota.length === 0) return '0.0'
  const soma = certificadosComNota.reduce((acc, cert) => acc + (cert.notaFinal || 0), 0)
  return (soma / certificadosComNota.length).toFixed(1)
})

// Métodos auxiliares
const getNotaBadgeClass = (nota: number) => {
  if (nota >= 9) return 'badge-success'
  if (nota >= 7) return 'badge-primary'
  if (nota >= 6) return 'badge-warning'
  return 'badge-danger'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Métodos principais
const loadCertificados = async () => {
  try {
    loading.value = true
    error.value = ''
    certificados.value = await dataService.listarCertificados()
  } catch (err: any) {
    console.error('Erro ao carregar certificados:', err)
    error.value = 'Erro ao carregar certificados'
  } finally {
    loading.value = false
  }
}

const downloadCertificado = (certificado: Certificado) => {
  // Simular download do certificado
  createSimpleToast(`Download do certificado ${certificado.codigo} iniciado`, 'success')
  
  // Aqui seria implementada a lógica real de download/geração do PDF
  console.log('Download certificado:', certificado)
}

const validarCertificado = (codigo: string) => {
  codigoValidacao.value = codigo
  showModal('validationModal')
}

const validarCertificadoPorCodigo = async () => {
  if (!codigoValidacao.value) return
  
  try {
    loading.value = true
    const certificado = await dataService.validarCertificado(codigoValidacao.value)
    
    if (certificado) {
      createSimpleToast(`Certificado ${certificado.codigo} é válido!`, 'success')
      hideModal('validationModal')
      codigoValidacao.value = ''
    } else {
      createSimpleToast('Certificado não encontrado ou inválido', 'danger')
    }
  } catch (error) {
    console.error('Erro ao validar certificado:', error)
    createSimpleToast('Erro ao validar certificado', 'danger')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCertificados()
})
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
}

.badge-secondary {
  background-color: #6c757d;
}

.badge-primary {
  background-color: #007bff;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.border-left-primary {
  border-left: 0.25rem solid #4e73df !important;
}

.border-left-success {
  border-left: 0.25rem solid #1cc88a !important;
}

.border-left-warning {
  border-left: 0.25rem solid #f6c23e !important;
}

.border-left-info {
  border-left: 0.25rem solid #36b9cc !important;
}

.text-primary {
  color: #4e73df !important;
}

.text-success {
  color: #1cc88a !important;
}

.text-warning {
  color: #f6c23e !important;
}

.text-info {
  color: #36b9cc !important;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 