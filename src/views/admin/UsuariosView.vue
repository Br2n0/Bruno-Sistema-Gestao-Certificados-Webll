<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="ti ti-users me-2"></i>Gerenciamento de Usuários
          </h5>
          <div class="card-tools">
            <button @click="refreshUsers" class="btn btn-sm btn-outline-primary">
              <i class="ti ti-refresh"></i>
            </button>
          </div>
        </div>
        
        <div class="card-body">
          <!-- Estatísticas -->
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card bg-primary text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h6 class="card-title">Total de Usuários</h6>
                      <h3 class="mb-0">{{ stats.totalUsers }}</h3>
                    </div>
                    <div class="align-self-center">
                      <i class="ti ti-users fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-success text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h6 class="card-title">Usuários Ativos</h6>
                      <h3 class="mb-0">{{ stats.activeUsers }}</h3>
                    </div>
                    <div class="align-self-center">
                      <i class="ti ti-user-check fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-warning text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h6 class="card-title">Administradores</h6>
                      <h3 class="mb-0">{{ stats.admins }}</h3>
                    </div>
                    <div class="align-self-center">
                      <i class="ti ti-shield fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card bg-info text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h6 class="card-title">Super Admins</h6>
                      <h3 class="mb-0">{{ stats.superAdmins }}</h3>
                    </div>
                    <div class="align-self-center">
                      <i class="ti ti-crown fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="ti ti-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar usuários..."
                  v-model="searchTerm"
                >
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="roleFilter">
                <option value="">Todos os tipos</option>
                <option value="user">Usuários</option>
                <option value="admin">Administradores</option>
                <option value="super-admin">Super Admins</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="statusFilter">
                <option value="">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>

          <!-- Tabela de usuários -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Último Login</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-3">
                        <span class="avatar-title rounded-circle bg-primary">
                          {{ user.nome.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <h6 class="mb-0">{{ user.nome }}</h6>
                        <small class="text-muted">ID: {{ user.id }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.telefone || '-' }}</td>
                  <td>
                    <span class="badge" :class="getRoleBadgeClass(user.role)">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="user.isActive ? 'bg-success' : 'bg-danger'">
                      {{ user.isActive ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <small>{{ formatDate(user.lastLogin) }}</small>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <!-- Botão para promover/rebaixar -->
                      <div class="dropdown">
                        <button
                          class="btn btn-outline-primary dropdown-toggle"
                          type="button"
                          :disabled="user.id === currentUser?.id"
                          data-bs-toggle="dropdown"
                        >
                          <i class="ti ti-settings"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li v-if="user.role === 'user'">
                            <a class="dropdown-item" href="#" @click="promoteUser(user.id, 'admin')">
                              <i class="ti ti-arrow-up me-2"></i>Promover para Admin
                            </a>
                          </li>
                          <li v-if="user.role === 'admin' && isSuperAdmin">
                            <a class="dropdown-item" href="#" @click="promoteUser(user.id, 'user')">
                              <i class="ti ti-arrow-down me-2"></i>Rebaixar para Usuário
                            </a>
                          </li>
                          <li><hr class="dropdown-divider"></li>
                          <li v-if="user.isActive">
                            <a class="dropdown-item text-danger" href="#" @click="deactivateUser(user.id)">
                              <i class="ti ti-user-off me-2"></i>Desativar
                            </a>
                          </li>
                          <li v-else>
                            <a class="dropdown-item text-success" href="#" @click="activateUser(user.id)">
                              <i class="ti ti-user-check me-2"></i>Ativar
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação (se necessário) -->
          <div v-if="filteredUsers.length === 0" class="text-center py-4">
            <i class="ti ti-users-off fs-1 text-muted"></i>
            <h6 class="text-muted mt-2">Nenhum usuário encontrado</h6>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast para feedback -->
  <div
    ref="toastRef"
    class="toast position-fixed top-0 end-0 m-3"
    role="alert"
    :class="{ 'show': showToast }"
    style="z-index: 1060;"
  >
    <div class="toast-header">
      <i class="ti ti-check-circle text-success me-2"></i>
      <strong class="me-auto">Sucesso</strong>
      <button type="button" class="btn-close" @click="showToast = false"></button>
    </div>
    <div class="toast-body">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import type { User } from '@/types/auth'

// Composables
const { 
  currentUser, 
  isSuperAdmin, 
  getAllUsers, 
  promoteUser: authPromoteUser, 
  deactivateUser: authDeactivateUser,
  activateUser: authActivateUser,
  getStats
} = useAuth()

// Estado
const users = ref<User[]>([])
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  admins: 0,
  superAdmins: 0
})
const searchTerm = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const showToast = ref(false)
const toastMessage = ref('')

// Usuários filtrados
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtrar por termo de busca
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.nome.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    )
  }

  // Filtrar por tipo de usuário
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Filtrar por status
  if (statusFilter.value) {
    filtered = filtered.filter(user => 
      statusFilter.value === 'active' ? user.isActive : !user.isActive
    )
  }

  return filtered
})

// Métodos
const refreshUsers = () => {
  try {
    users.value = getAllUsers()
    stats.value = getStats()
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}

const promoteUser = (userId: string, newRole: 'user' | 'admin') => {
  try {
    const updatedUser = authPromoteUser(userId, newRole)
    if (updatedUser) {
      refreshUsers()
      showToastMessage(`Usuário ${newRole === 'admin' ? 'promovido' : 'rebaixado'} com sucesso!`)
    }
  } catch (error) {
    console.error('Erro ao promover usuário:', error)
    showToastMessage('Erro ao alterar usuário', 'error')
  }
}

const deactivateUser = (userId: string) => {
  try {
    const updatedUser = authDeactivateUser(userId)
    if (updatedUser) {
      refreshUsers()
      showToastMessage('Usuário desativado com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao desativar usuário:', error)
    showToastMessage('Erro ao desativar usuário', 'error')
  }
}

const activateUser = (userId: string) => {
  try {
    const updatedUser = authActivateUser(userId)
    if (updatedUser) {
      refreshUsers()
      showToastMessage('Usuário ativado com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao ativar usuário:', error)
    showToastMessage('Erro ao ativar usuário', 'error')
  }
}

const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'super-admin': return 'bg-danger'
    case 'admin': return 'bg-warning'
    default: return 'bg-secondary'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'super-admin': return 'Super Admin'
    case 'admin': return 'Admin'
    default: return 'Usuário'
  }
}

const formatDate = (date?: Date) => {
  if (!date) return 'Nunca'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Inicializar
onMounted(() => {
  refreshUsers()
})
</script>

<style scoped>
.avatar-sm {
  width: 40px;
  height: 40px;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.toast.show {
  display: block;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}
</style> 