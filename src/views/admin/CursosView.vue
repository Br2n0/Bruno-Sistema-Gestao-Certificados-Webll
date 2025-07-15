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
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Cursos Ativos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ cursosAtivos }}</div>
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
                  Cursos Inativos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ cursosInativos }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-pause-circle fa-2x text-gray-300"></i>
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
                  Categorias
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalCategorias }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-layer-group fa-2x text-gray-300"></i>
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
                <th>Nome</th>
                <th>Instrutor</th>
                <th>Categoria</th>
                <th>Carga Horária</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursos" :key="curso.id">
                <td>{{ curso.id }}</td>
                <td>{{ curso.nome }}</td>
                <td>{{ curso.instrutor }}</td>
                <td>{{ curso.categoria }}</td>
                <td>{{ curso.cargaHoraria }}h</td>
                <td>
                  <span :class="['badge', curso.status === 'ativo' ? 'badge-success' : 'badge-secondary']">
                    {{ curso.status }}
                  </span>
                </td>
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
                  <label for="nome" class="form-label">Nome do Curso *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="nome"
                    v-model="cursoForm.nome"
                    required
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="cargaHoraria" class="form-label">Carga Horária *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="cargaHoraria"
                    v-model.number="cursoForm.cargaHoraria"
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
                  <label for="instrutor" class="form-label">Instrutor *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="instrutor"
                    v-model="cursoForm.instrutor"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="categoria" class="form-label">Categoria *</label>
                  <select 
                    class="form-control" 
                    id="categoria"
                    v-model="cursoForm.categoria"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Negócios">Negócios</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="dataInicio" class="form-label">Data de Início</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="dataInicio"
                    v-model="cursoForm.dataInicio"
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="dataFim" class="form-label">Data de Fim</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="dataFim"
                    v-model="cursoForm.dataFim"
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="status" class="form-label">Status *</label>
                  <select 
                    class="form-control" 
                    id="status"
                    v-model="cursoForm.status"
                    required
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="saveCurso">
              {{ editingCurso ? 'Atualizar' : 'Salvar' }}
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
            <p>Tem certeza que deseja excluir o curso <strong>{{ cursoToDelete?.nome }}</strong>?</p>
            <p class="text-danger">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCurso">
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
import { dataService, type Curso } from '@/services/dataService'
import { useBootstrap } from '@/composables/useBootstrap'

const { showModal, hideModal, createSimpleToast } = useBootstrap()

// Estado reativo
const cursos = ref<Curso[]>([])
const editingCurso = ref<Curso | null>(null)
const cursoToDelete = ref<Curso | null>(null)

// Formulário reativo
const cursoForm = ref({
  nome: '',
  descricao: '',
  cargaHoraria: 0,
  instrutor: '',
  categoria: '',
  status: 'ativo' as 'ativo' | 'inativo',
  dataInicio: '',
  dataFim: ''
})

// Computed properties para estatísticas
const cursosAtivos = computed(() => cursos.value.filter(c => c.status === 'ativo').length)
const cursosInativos = computed(() => cursos.value.filter(c => c.status === 'inativo').length)
const totalCategorias = computed(() => {
  const categorias = new Set(cursos.value.map(c => c.categoria))
  return categorias.size
})

// Métodos
const loadCursos = () => {
  try {
    cursos.value = dataService.getCursos()
  } catch (error) {
    console.error('Erro ao carregar cursos:', error)
    createSimpleToast('Erro ao carregar cursos', 'danger')
  }
}

const resetForm = () => {
  cursoForm.value = {
    nome: '',
    descricao: '',
    cargaHoraria: 0,
    instrutor: '',
    categoria: '',
    status: 'ativo',
    dataInicio: '',
    dataFim: ''
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
    nome: curso.nome,
    descricao: curso.descricao,
    cargaHoraria: curso.cargaHoraria,
    instrutor: curso.instrutor,
    categoria: curso.categoria,
    status: curso.status,
    dataInicio: curso.dataInicio || '',
    dataFim: curso.dataFim || ''
  }
  showCursoModal()
}

const saveCurso = () => {
  try {
    if (editingCurso.value) {
      // Atualizar curso existente
      const updated = dataService.updateCurso(editingCurso.value.id, {
        nome: cursoForm.value.nome,
        descricao: cursoForm.value.descricao,
        cargaHoraria: cursoForm.value.cargaHoraria,
        instrutor: cursoForm.value.instrutor,
        categoria: cursoForm.value.categoria,
        status: cursoForm.value.status,
        dataInicio: cursoForm.value.dataInicio || undefined,
        dataFim: cursoForm.value.dataFim || undefined
      })
      
      if (updated) {
        createSimpleToast('Curso atualizado com sucesso!', 'success')
      } else {
        createSimpleToast('Erro ao atualizar curso', 'danger')
        return
      }
    } else {
      // Criar novo curso
      const newCurso = dataService.addCurso({
        nome: cursoForm.value.nome,
        descricao: cursoForm.value.descricao,
        cargaHoraria: cursoForm.value.cargaHoraria,
        instrutor: cursoForm.value.instrutor,
        categoria: cursoForm.value.categoria,
        status: cursoForm.value.status,
        dataInicio: cursoForm.value.dataInicio || undefined,
        dataFim: cursoForm.value.dataFim || undefined
      })
      
      createSimpleToast('Curso criado com sucesso!', 'success')
    }
    
    // Recarregar dados e fechar modal
    loadCursos()
    hideModal('cursoModal')
    resetForm()
    editingCurso.value = null
    
  } catch (error) {
    console.error('Erro ao salvar curso:', error)
    createSimpleToast('Erro ao salvar curso', 'danger')
  }
}

const confirmDeleteCurso = (curso: Curso) => {
  cursoToDelete.value = curso
  showModal('deleteModal')
}

const deleteCurso = () => {
  if (!cursoToDelete.value) return
  
  try {
    const success = dataService.deleteCurso(cursoToDelete.value.id)
    
    if (success) {
      createSimpleToast('Curso excluído com sucesso!', 'success')
      loadCursos()
    } else {
      createSimpleToast('Erro ao excluir curso', 'danger')
    }
    
    hideModal('deleteModal')
    cursoToDelete.value = null
    
  } catch (error) {
    console.error('Erro ao excluir curso:', error)
    createSimpleToast('Erro ao excluir curso', 'danger')
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
</style> 