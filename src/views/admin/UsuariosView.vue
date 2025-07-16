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

    <!-- Estatística Simples -->
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
    </div>

    <!-- Tabela de Usuários -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Lista de Usuários</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Data de Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ formatDate(usuario.dataCadastro) }}</td>
                <td>
                  <button 
                    class="btn btn-info btn-sm mr-2" 
                    @click="editUsuario(usuario)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    @click="deleteUsuario(usuario.id)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="text-center">Nenhum usuário encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Usuário -->
    <div 
      class="modal fade" 
      id="usuarioModal" 
      tabindex="-1" 
      role="dialog" 
      aria-labelledby="usuarioModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="usuarioModalLabel">
              {{ editingUsuario ? 'Editar Usuário' : 'Novo Usuário' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="salvarUsuario">
            <div class="modal-body">
              <div class="form-group">
                <label for="nome">Nome Completo *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nome" 
                  v-model="formUsuario.nome" 
                  required
                  placeholder="Digite o nome completo"
                >
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="formUsuario.email" 
                  required
                  placeholder="usuario@exemplo.com"
                >
              </div>

              <div class="form-group" v-if="!editingUsuario">
                <label for="senha">Senha *</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="senha" 
                  v-model="formUsuario.senha" 
                  required
                  placeholder="Digite a senha"
                >
              </div>

              <div class="form-group" v-if="editingUsuario">
                <label for="novaSenha">Nova Senha (deixe em branco para manter)</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="novaSenha" 
                  v-model="formUsuario.novaSenha" 
                  placeholder="Digite nova senha (opcional)"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editingUsuario ? 'Atualizar' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBootstrap } from '@/composables/useBootstrap'
import { dataService } from '@/services/dataService'

interface Usuario {
  id: number
  nome: string
  email: string
  dataCadastro: string
  fotoUrl?: string
}

const { showModal, hideModal } = useBootstrap()
const usuarios = ref<Usuario[]>([])
const editingUsuario = ref<Usuario | null>(null)
const loading = ref(false)

const formUsuario = ref({
  nome: '',
  email: '',
  senha: '',
  novaSenha: ''
})

const resetForm = () => {
  formUsuario.value = {
    nome: '',
    email: '',
    senha: '',
    novaSenha: ''
  }
}

const showUsuarioModal = () => {
  resetForm()
  showModal('usuarioModal')
}

const editUsuario = (usuario: Usuario) => {
  editingUsuario.value = usuario
  formUsuario.value = {
    nome: usuario.nome,
    email: usuario.email,
    senha: '',
    novaSenha: ''
  }
  showModal('usuarioModal')
}

const salvarUsuario = async () => {
  try {
    loading.value = true
    
    const dadosUsuario = {
      nome: formUsuario.value.nome,
      email: formUsuario.value.email,
      senha: editingUsuario.value 
        ? formUsuario.value.novaSenha || undefined
        : formUsuario.value.senha
    }

    if (editingUsuario.value) {
      await dataService.atualizarAluno(editingUsuario.value.id, dadosUsuario)
    } else {
      await dataService.criarAluno(dadosUsuario)
    }

    await carregarUsuarios()
    hideModal('usuarioModal')
    alert('Usuário salvo com sucesso!')
    
  } catch (error: any) {
    console.error('Erro ao salvar usuário:', error)
    alert(`Erro ao salvar usuário: ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const deleteUsuario = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return
  
  try {
    await dataService.excluirAluno(id)
    await carregarUsuarios()
    alert('Usuário excluído com sucesso!')
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error)
    alert(`Erro ao excluir usuário: ${error.response?.data?.message || error.message}`)
  }
}

const carregarUsuarios = async () => {
  try {
    loading.value = true
    usuarios.value = await dataService.listarAlunos()
  } catch (error: any) {
    console.error('Erro ao carregar usuários:', error)
    alert(`Erro ao carregar usuários: ${error.response?.data?.message || error.message}`)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  carregarUsuarios()
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