<template>
  <div class="container-fluid px-4">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Gestão de Certificados</h1>
      <button 
        type="button" 
        class="btn btn-primary"
        @click="() => { editingCertificado = null; showCertificadoModal() }"
      >
        <i class="fas fa-plus fa-sm text-white-50"></i>
        Novo Certificado
      </button>
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
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ certificados.length }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-certificate fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Certificados Emitidos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ certificadosEmitidos }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-check-circle fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Certificados Pendentes
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ certificadosPendentes }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-clock fa-2x text-gray-300"></i>
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
                <i class="fas fa-star fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Certificados -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Lista de Certificados</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Aluno</th>
                <th>Curso</th>
                <th>Nota Final</th>
                <th>Status</th>
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
                  <span :class="['badge', getNotaBadgeClass(certificado.notaFinal)]">
                    {{ certificado.notaFinal.toFixed(1) }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', getStatusBadgeClass(certificado.status)]">
                    {{ getStatusLabel(certificado.status) }}
                  </span>
                </td>
                <td>{{ formatDate(certificado.dataEmissao) }}</td>
                <td>
                  <button 
                    type="button"
                    class="btn btn-info btn-sm me-2"
                    @click="editCertificado(certificado)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn btn-success btn-sm me-2"
                    @click="downloadCertificado(certificado)"
                    title="Download"
                    :disabled="certificado.status !== 'emitido'"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="confirmDeleteCertificado(certificado)"
                    title="Excluir"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Certificado -->
    <div class="modal fade" id="certificadoModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingCertificado ? 'Editar Certificado' : 'Novo Certificado' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCertificado">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="aluno" class="form-label">Nome do Aluno *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="aluno"
                    v-model="certificadoForm.aluno"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="curso" class="form-label">Nome do Curso *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="curso"
                    v-model="certificadoForm.curso"
                    required
                  >
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="notaFinal" class="form-label">Nota Final *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="notaFinal"
                    v-model.number="certificadoForm.notaFinal"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="cargaHoraria" class="form-label">Carga Horária *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="cargaHoraria"
                    v-model.number="certificadoForm.cargaHoraria"
                    min="1"
                    required
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="status" class="form-label">Status *</label>
                  <select 
                    class="form-control" 
                    id="status"
                    v-model="certificadoForm.status"
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="emitido">Emitido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="dataEmissao" class="form-label">Data de Emissão *</label>
                  <input 
                    type="datetime-local" 
                    class="form-control" 
                    id="dataEmissao"
                    v-model="certificadoForm.dataEmissao"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="validade" class="form-label">Data de Validade</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="validade"
                    v-model="certificadoForm.validade"
                  >
                </div>
              </div>
              
              <div class="mb-3">
                <label for="codigo" class="form-label">Código do Certificado</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="codigo"
                  v-model="certificadoForm.codigo"
                  :placeholder="editingCertificado ? 'Manter código atual' : 'Será gerado automaticamente'"
                  :readonly="!editingCertificado"
                >
                <small class="form-text text-muted">
                  {{ editingCertificado ? 'Deixe em branco para manter o código atual' : 'Um código único será gerado automaticamente' }}
                </small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="saveCertificado">
              {{ editingCertificado ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmação Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o certificado <strong>{{ certificadoToDelete?.codigo }}</strong>?</p>
            <p class="text-danger">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCertificado">
              Excluir
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
const editingCertificado = ref<Certificado | null>(null)
const certificadoToDelete = ref<Certificado | null>(null)

// Formulário reativo
const certificadoForm = ref({
  aluno: '',
  curso: '',
  notaFinal: 0,
  cargaHoraria: 0,
  status: 'pendente' as 'emitido' | 'pendente' | 'cancelado',
  dataEmissao: '',
  validade: '',
  codigo: ''
})

// Computed properties para estatísticas
const certificadosEmitidos = computed(() => certificados.value.filter(c => c.status === 'emitido').length)
const certificadosPendentes = computed(() => certificados.value.filter(c => c.status === 'pendente').length)
const notaMedia = computed(() => {
  if (certificados.value.length === 0) return '0.0'
  const soma = certificados.value.reduce((acc, cert) => acc + cert.notaFinal, 0)
  return (soma / certificados.value.length).toFixed(1)
})

// Métodos auxiliares
const getStatusLabel = (status: string) => {
  const labels = {
    emitido: 'Emitido',
    pendente: 'Pendente',
    cancelado: 'Cancelado'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    emitido: 'badge-success',
    pendente: 'badge-warning',
    cancelado: 'badge-danger'
  }
  return classes[status as keyof typeof classes] || 'badge-secondary'
}

const getNotaBadgeClass = (nota: number) => {
  if (nota >= 9) return 'badge-success'
  if (nota >= 7) return 'badge-primary'
  if (nota >= 6) return 'badge-warning'
  return 'badge-danger'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const generateCertificateCode = () => {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `CERT-${random}-${year}`
}

// Métodos principais
const loadCertificados = () => {
  try {
    certificados.value = dataService.getCertificados()
  } catch (error) {
    console.error('Erro ao carregar certificados:', error)
    createSimpleToast('Erro ao carregar certificados', 'danger')
  }
}

const resetForm = () => {
  certificadoForm.value = {
    aluno: '',
    curso: '',
    notaFinal: 0,
    cargaHoraria: 0,
    status: 'pendente',
    dataEmissao: '',
    validade: '',
    codigo: ''
  }
}

const showCertificadoModal = () => {
  if (!editingCertificado.value) {
    resetForm()
    // Pré-preencher data de emissão com data atual
    const now = new Date()
    certificadoForm.value.dataEmissao = now.toISOString().slice(0, 16)
  }
  showModal('certificadoModal')
}

const editCertificado = (certificado: Certificado) => {
  editingCertificado.value = certificado
  certificadoForm.value = {
    aluno: certificado.aluno,
    curso: certificado.curso,
    notaFinal: certificado.notaFinal,
    cargaHoraria: certificado.cargaHoraria,
    status: certificado.status,
    dataEmissao: new Date(certificado.dataEmissao).toISOString().slice(0, 16),
    validade: certificado.validade || '',
    codigo: certificado.codigo
  }
  showCertificadoModal()
}

const saveCertificado = () => {
  try {
    if (editingCertificado.value) {
      // Atualizar certificado existente
      const updated = dataService.updateCertificado(editingCertificado.value.id, {
        aluno: certificadoForm.value.aluno,
        curso: certificadoForm.value.curso,
        notaFinal: certificadoForm.value.notaFinal,
        cargaHoraria: certificadoForm.value.cargaHoraria,
        status: certificadoForm.value.status,
        dataEmissao: new Date(certificadoForm.value.dataEmissao).toISOString(),
        validade: certificadoForm.value.validade || undefined,
        codigo: certificadoForm.value.codigo || editingCertificado.value.codigo
      })
      
      if (updated) {
        createSimpleToast('Certificado atualizado com sucesso!', 'success')
      } else {
        createSimpleToast('Erro ao atualizar certificado', 'danger')
        return
      }
    } else {
      // Criar novo certificado
      const newCertificado = dataService.addCertificado({
        aluno: certificadoForm.value.aluno,
        curso: certificadoForm.value.curso,
        notaFinal: certificadoForm.value.notaFinal,
        cargaHoraria: certificadoForm.value.cargaHoraria,
        status: certificadoForm.value.status,
        dataEmissao: new Date(certificadoForm.value.dataEmissao).toISOString(),
        validade: certificadoForm.value.validade || undefined,
        codigo: certificadoForm.value.codigo || generateCertificateCode()
      })
      
      createSimpleToast('Certificado criado com sucesso!', 'success')
    }
    
    // Recarregar dados e fechar modal
    loadCertificados()
    hideModal('certificadoModal')
    resetForm()
    editingCertificado.value = null
    
  } catch (error) {
    console.error('Erro ao salvar certificado:', error)
    createSimpleToast('Erro ao salvar certificado', 'danger')
  }
}

const confirmDeleteCertificado = (certificado: Certificado) => {
  certificadoToDelete.value = certificado
  showModal('deleteModal')
}

const deleteCertificado = () => {
  if (!certificadoToDelete.value) return
  
  try {
    const success = dataService.deleteCertificado(certificadoToDelete.value.id)
    
    if (success) {
      createSimpleToast('Certificado excluído com sucesso!', 'success')
      loadCertificados()
    } else {
      createSimpleToast('Erro ao excluir certificado', 'danger')
    }
    
    hideModal('deleteModal')
    certificadoToDelete.value = null
    
  } catch (error) {
    console.error('Erro ao excluir certificado:', error)
    createSimpleToast('Erro ao excluir certificado', 'danger')
  }
}

const downloadCertificado = (certificado: Certificado) => {
  if (certificado.status !== 'emitido') {
    createSimpleToast('Apenas certificados emitidos podem ser baixados', 'danger')
    return
  }
  
  // Simular download do certificado
  createSimpleToast(`Download do certificado ${certificado.codigo} iniciado`, 'success')
  
  // Aqui seria implementada a lógica real de download/geração do PDF
  console.log('Download certificado:', certificado)
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