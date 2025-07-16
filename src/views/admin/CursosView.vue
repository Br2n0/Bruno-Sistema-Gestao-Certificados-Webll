<template>
  <div class="container-fluid px-4">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Gestão de Cursos</h1>
      <button 
        type="button" 
        class="btn btn-primary"
        @click="() => { editingCurso = null; showCursoModal() }"
      >
        <i class="fas fa-plus fa-sm text-white-50"></i>
        Novo Curso
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
                  Total de Cursos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ cursos.length }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-book fa-2x text-gray-300"></i>
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
                  Total de Horas
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalHoras }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-clock fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Cursos -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Lista de Cursos</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Instrutor</th>
                <th>Duração (h)</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursos" :key="curso.id">
                <td>{{ curso.id }}</td>
                <td>{{ curso.titulo }}</td>
                <td>{{ curso.instrutor || '-' }}</td>
                <td>{{ curso.duracao }}h</td>
                <td>{{ curso.preco === 0 ? 'Gratuito' : `R$ ${curso.preco.toFixed(2)}` }}</td>
                <td>
                  <button 
                    type="button"
                    class="btn btn-info btn-sm me-2"
                    @click="editCurso(curso)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="confirmDeleteCurso(curso)"
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

    <!-- Modal Curso -->
    <div class="modal fade" id="cursoModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingCurso ? 'Editar Curso' : 'Novo Curso' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCurso">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label for="titulo" class="form-label">Título do Curso *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="titulo"
                    v-model="cursoForm.titulo"
                    required
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="duracao" class="form-label">Duração (horas) *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="duracao"
                    v-model.number="cursoForm.duracao"
                    min="1"
                    required
                  >
                </div>
              </div>
              
              <div class="mb-3">
                <label for="descricao" class="form-label">Descrição *</label>
                <textarea 
                  class="form-control" 
                  id="descricao"
                  v-model="cursoForm.descricao"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="instrutor" class="form-label">Instrutor</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="instrutor"
                    v-model="cursoForm.instrutor"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="preco" class="form-label">Preço (R$)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="preco"
                    v-model.number="cursoForm.preco"
                    min="0"
                    step="0.01"
                  >
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="saveCurso" :disabled="loading">
              {{ loading ? 'Salvando...' : (editingCurso ? 'Atualizar' : 'Salvar') }}
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
            <p>Tem certeza que deseja excluir o curso <strong>{{ cursoToDelete?.titulo }}</strong>?</p>
            <p class="text-danger">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCurso" :disabled="loading">
              {{ loading ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dataService, type Curso } from '@/services/dataService'
import { useBootstrap } from '@/composables/useBootstrap'

const { showModal, hideModal, createSimpleToast } = useBootstrap()

// Estado reativo
const cursos = ref<Curso[]>([])
const editingCurso = ref<Curso | null>(null)
const cursoToDelete = ref<Curso | null>(null)
const loading = ref(false)

// Formulário reativo
const cursoForm = ref({
  titulo: '',
  descricao: '',
  duracao: 0,
  instrutor: '',
  preco: 0
})

// Computed properties para estatísticas  
const totalHoras = computed(() => {
  return cursos.value.reduce((total, curso) => total + curso.duracao, 0)
})

// Métodos
const loadCursos = async () => {
  try {
    loading.value = true
    cursos.value = await dataService.getCursos()
  } catch (error) {
    console.error('Erro ao carregar cursos:', error)
    createSimpleToast('Erro ao carregar cursos', 'danger')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  cursoForm.value = {
    titulo: '',
    descricao: '',
    duracao: 0,
    instrutor: '',
    preco: 0
  }
}

const showCursoModal = () => {
  if (!editingCurso.value) {
    resetForm()
  }
  showModal('cursoModal')
}

const editCurso = (curso: Curso) => {
  editingCurso.value = curso
  cursoForm.value = {
    titulo: curso.titulo,
    descricao: curso.descricao,
    duracao: curso.duracao,
    instrutor: curso.instrutor,
    preco: curso.preco
  }
  showCursoModal()
}

const saveCurso = async () => {
  try {
    loading.value = true
    
    if (editingCurso.value) {
      // Atualizar curso existente
      const success = await dataService.atualizarCurso(editingCurso.value.id, {
        titulo: cursoForm.value.titulo,
        descricao: cursoForm.value.descricao,
        duracao: cursoForm.value.duracao,
        instrutor: cursoForm.value.instrutor,
        preco: cursoForm.value.preco
      })
      
      if (success) {
        createSimpleToast('Curso atualizado com sucesso!', 'success')
      } else {
        createSimpleToast('Erro ao atualizar curso', 'danger')
        return
      }
    } else {
      // Criar novo curso
      await dataService.criarCurso({
        titulo: cursoForm.value.titulo,
        descricao: cursoForm.value.descricao,
        duracao: cursoForm.value.duracao,
        instrutor: cursoForm.value.instrutor,
        preco: cursoForm.value.preco
      })
      
      createSimpleToast('Curso criado com sucesso!', 'success')
    }
    
    // Recarregar dados e fechar modal
    await loadCursos()
    hideModal('cursoModal')
    resetForm()
    editingCurso.value = null
    
  } catch (error) {
    console.error('Erro ao salvar curso:', error)
    createSimpleToast('Erro ao salvar curso', 'danger')
  } finally {
    loading.value = false
  }
}

const confirmDeleteCurso = (curso: Curso) => {
  cursoToDelete.value = curso
  showModal('deleteModal')
}

const deleteCurso = async () => {
  if (!cursoToDelete.value) return
  
  try {
    loading.value = true
    const success = await dataService.excluirCurso(cursoToDelete.value.id)
    
    if (success) {
      createSimpleToast('Curso excluído com sucesso!', 'success')
      await loadCursos()
    } else {
      createSimpleToast('Erro ao excluir curso', 'danger')
    }
    
    hideModal('deleteModal')
    cursoToDelete.value = null
    
  } catch (error) {
    console.error('Erro ao excluir curso:', error)
    createSimpleToast('Erro ao excluir curso', 'danger')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCursos()
})
</script>

<style scoped>
.badge-success {
  background-color: #28a745;
}

.badge-secondary {
  background-color: #6c757d;
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