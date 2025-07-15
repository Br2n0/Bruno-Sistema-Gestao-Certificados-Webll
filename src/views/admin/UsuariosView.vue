<template>
  <div class="container-fluid px-4">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Gestão de Usuários</h1>
      <button 
        type="button" 
        class="btn btn-primary"
        @click="() => { editingUsuario = null; showUsuarioModal() }"
      >
        <i class="fas fa-plus fa-sm text-white-50"></i>
        Novo Usuário
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
                  Total de Usuários
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ usuarios.length }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-users fa-2x text-gray-300"></i>
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
                  Usuários Ativos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ usuariosAtivos }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-user-check fa-2x text-gray-300"></i>
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
                  Instrutores
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalInstrutores }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-chalkboard-teacher fa-2x text-gray-300"></i>
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
                  Alunos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ totalAlunos }}</div>
              </div>
              <div class="col-auto">
                <i class="fas fa-graduation-cap fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Usuários -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Lista de Usuários</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Data Registro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.cpf }}</td>
                <td>
                  <span :class="['badge', getTipoBadgeClass(usuario.tipo)]">
                    {{ getTipoLabel(usuario.tipo) }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', usuario.status === 'ativo' ? 'badge-success' : 'badge-secondary']">
                    {{ usuario.status }}
                  </span>
                </td>
                <td>{{ formatDate(usuario.dataRegistro) }}</td>
                <td>
                  <button 
                    type="button"
                    class="btn btn-info btn-sm me-2"
                    @click="editUsuario(usuario)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="confirmDeleteUsuario(usuario)"
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

    <!-- Modal Usuário -->
    <div class="modal fade" id="usuarioModal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingUsuario ? 'Editar Usuário' : 'Novo Usuário' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUsuario">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label for="nome" class="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="nome"
                    v-model="usuarioForm.nome"
                    required
                  >
                </div>
                <div class="col-md-4 mb-3">
                  <label for="tipo" class="form-label">Tipo *</label>
                  <select 
                    class="form-control" 
                    id="tipo"
                    v-model="usuarioForm.tipo"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="admin">Administrador</option>
                    <option value="instrutor">Instrutor</option>
                    <option value="aluno">Aluno</option>
                  </select>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    v-model="usuarioForm.email"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="telefone" class="form-label">Telefone *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="telefone"
                    v-model="usuarioForm.telefone"
                    placeholder="(11) 99999-9999"
                    required
                  >
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="cpf" class="form-label">CPF *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="cpf"
                    v-model="usuarioForm.cpf"
                    placeholder="000.000.000-00"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="status" class="form-label">Status *</label>
                  <select 
                    class="form-control" 
                    id="status"
                    v-model="usuarioForm.status"
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
            <button type="button" class="btn btn-primary" @click="saveUsuario">
              {{ editingUsuario ? 'Atualizar' : 'Salvar' }}
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
            <p>Tem certeza que deseja excluir o usuário <strong>{{ usuarioToDelete?.nome }}</strong>?</p>
            <p class="text-danger">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteUsuario">
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
import { dataService, type Usuario } from '@/services/dataService'
import { useBootstrap } from '@/composables/useBootstrap'

const { showModal, hideModal, createSimpleToast } = useBootstrap()

// Estado reativo
const usuarios = ref<Usuario[]>([])
const editingUsuario = ref<Usuario | null>(null)
const usuarioToDelete = ref<Usuario | null>(null)

// Formulário reativo
const usuarioForm = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  tipo: '' as 'admin' | 'aluno' | 'instrutor' | '',
  status: 'ativo' as 'ativo' | 'inativo'
})

// Computed properties para estatísticas
const usuariosAtivos = computed(() => usuarios.value.filter(u => u.status === 'ativo').length)
const totalInstrutores = computed(() => usuarios.value.filter(u => u.tipo === 'instrutor').length)
const totalAlunos = computed(() => usuarios.value.filter(u => u.tipo === 'aluno').length)

// Métodos auxiliares
const getTipoLabel = (tipo: string) => {
  const labels = {
    admin: 'Administrador',
    instrutor: 'Instrutor',
    aluno: 'Aluno'
  }
  return labels[tipo as keyof typeof labels] || tipo
}

const getTipoBadgeClass = (tipo: string) => {
  const classes = {
    admin: 'badge-danger',
    instrutor: 'badge-primary',
    aluno: 'badge-success'
  }
  return classes[tipo as keyof typeof classes] || 'badge-secondary'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Métodos principais
const loadUsuarios = () => {
  try {
    usuarios.value = dataService.getUsuarios()
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    createSimpleToast('Erro ao carregar usuários', 'danger')
  }
}

const resetForm = () => {
  usuarioForm.value = {
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    tipo: '',
    status: 'ativo'
  }
}

const showUsuarioModal = () => {
  if (!editingUsuario.value) {
    resetForm()
  }
  showModal('usuarioModal')
}

const editUsuario = (usuario: Usuario) => {
  editingUsuario.value = usuario
  usuarioForm.value = {
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    telefone: usuario.telefone,
    tipo: usuario.tipo,
    status: usuario.status
  }
  showUsuarioModal()
}

const saveUsuario = () => {
  if (!usuarioForm.value.tipo) {
    createSimpleToast('Por favor, selecione o tipo de usuário', 'danger')
    return
  }

  try {
    if (editingUsuario.value) {
      // Atualizar usuário existente
      const updated = dataService.updateUsuario(editingUsuario.value.id, {
        nome: usuarioForm.value.nome,
        email: usuarioForm.value.email,
        cpf: usuarioForm.value.cpf,
        telefone: usuarioForm.value.telefone,
        tipo: usuarioForm.value.tipo as 'admin' | 'aluno' | 'instrutor',
        status: usuarioForm.value.status
      })
      
      if (updated) {
        createSimpleToast('Usuário atualizado com sucesso!', 'success')
      } else {
        createSimpleToast('Erro ao atualizar usuário', 'danger')
        return
      }
    } else {
      // Criar novo usuário
      const newUsuario = dataService.addUsuario({
        nome: usuarioForm.value.nome,
        email: usuarioForm.value.email,
        cpf: usuarioForm.value.cpf,
        telefone: usuarioForm.value.telefone,
        tipo: usuarioForm.value.tipo as 'admin' | 'aluno' | 'instrutor',
        status: usuarioForm.value.status
      })
      
      createSimpleToast('Usuário criado com sucesso!', 'success')
    }
    
    // Recarregar dados e fechar modal
    loadUsuarios()
    hideModal('usuarioModal')
    resetForm()
    editingUsuario.value = null
    
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
    createSimpleToast('Erro ao salvar usuário', 'danger')
  }
}

const confirmDeleteUsuario = (usuario: Usuario) => {
  usuarioToDelete.value = usuario
  showModal('deleteModal')
}

const deleteUsuario = () => {
  if (!usuarioToDelete.value) return
  
  try {
    const success = dataService.deleteUsuario(usuarioToDelete.value.id)
    
    if (success) {
      createSimpleToast('Usuário excluído com sucesso!', 'success')
      loadUsuarios()
    } else {
      createSimpleToast('Erro ao excluir usuário', 'danger')
    }
    
    hideModal('deleteModal')
    usuarioToDelete.value = null
    
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    createSimpleToast('Erro ao excluir usuário', 'danger')
  }
}

// Lifecycle
onMounted(() => {
  loadUsuarios()
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