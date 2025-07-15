import { ref, computed, onMounted } from 'vue'
import type { User, AuthState, AuthResponse, RegisterForm, LoginForm, ValidationError, Permission } from '@/types/auth'
import { ROLE_PERMISSIONS } from '@/types/auth'
import { validateLoginForm, validateRegisterForm, verifyPassword, generateToken, verifyToken } from '@/utils/autenticacao'
import { 
  saveAuthState, 
  loadAuthState, 
  clearAuthState, 
  findUserByEmail, 
  findUserById, 
  createUser, 
  updateUser, 
  getUserPassword, 
  initializeSystem,
  loadUsers,
  getSystemStats
} from '@/utils/armazenamento'

// Estado global de autenticação
const authState = ref<AuthState>({
  user: null,
  isAuthenticated: false,
  token: null
})

export function useAuth() {
  // Verificações de permissões
  const isAdmin = computed(() => authState.value.user?.role === 'admin' || authState.value.user?.role === 'super-admin')
  const isSuperAdmin = computed(() => authState.value.user?.role === 'super-admin')
  const isAuthenticated = computed(() => authState.value.isAuthenticated && authState.value.user !== null)
  const currentUser = computed(() => authState.value.user)
  
  // Verificar permissões específicas
  const hasPermission = (permission: Permission): boolean => {
    if (!authState.value.user) return false
    return ROLE_PERMISSIONS[authState.value.user.role][permission] || false
  }
  
  // Inicializar sistema
  const initialize = async (): Promise<void> => {
    try {
      // Inicializar sistema com admin padrão se necessário
      await initializeSystem()
      
      // Carregar estado de autenticação salvo
      const savedState = loadAuthState()
      if (savedState && savedState.token) {
        // Verificar se o token ainda é válido
        const tokenData = verifyToken(savedState.token)
        if (tokenData.valid) {
          const user = findUserById(tokenData.userId)
          if (user && user.isActive) {
            authState.value = {
              user,
              isAuthenticated: true,
              token: savedState.token
            }
          } else {
            // Token válido mas usuário não existe ou inativo
            clearAuthState()
          }
        } else {
          // Token expirado
          clearAuthState()
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar sistema de autenticação:', error)
    }
  }
  
  // Login
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Validar formulário
      const validationErrors = validateLoginForm({ email, password })
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors }
      }
      
      // Buscar usuário
      const user = findUserByEmail(email)
      if (!user) {
        return { success: false, message: 'Email ou senha inválidos' }
      }
      
      // Verificar se usuário está ativo
      if (!user.isActive) {
        return { success: false, message: 'Conta desativada. Entre em contato com o administrador' }
      }
      
      // Verificar senha
      const userPassword = getUserPassword(user.id)
      if (!userPassword) {
        return { success: false, message: 'Erro interno. Tente novamente' }
      }
      
      const isPasswordValid = await verifyPassword(password, userPassword)
      if (!isPasswordValid) {
        return { success: false, message: 'Email ou senha inválidos' }
      }
      
      // Atualizar último login
      const updatedUser = updateUser(user.id, { lastLogin: new Date() })
      if (!updatedUser) {
        return { success: false, message: 'Erro ao fazer login' }
      }
      
      // Gerar token
      const token = generateToken(user.id)
      
      // Atualizar estado
      authState.value = {
        user: updatedUser,
        isAuthenticated: true,
        token
      }
      
      // Salvar estado
      saveAuthState(authState.value)
      
      return { success: true, user: updatedUser, token }
      
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, message: 'Erro interno. Tente novamente' }
    }
  }
  
  // Cadastro
  const register = async (formData: RegisterForm): Promise<AuthResponse> => {
    try {
      // Validar formulário
      const validationErrors = validateRegisterForm(formData)
      if (validationErrors.length > 0) {
        return { success: false, errors: validationErrors }
      }
      
      // Verificar se email já existe
      const existingUser = findUserByEmail(formData.email)
      if (existingUser) {
        return { success: false, message: 'Já existe uma conta com este email' }
      }
      
      // Criar usuário
      const newUser = await createUser({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        role: 'user'
      })
      
      // Gerar token
      const token = generateToken(newUser.id)
      
      // Atualizar estado
      authState.value = {
        user: newUser,
        isAuthenticated: true,
        token
      }
      
      // Salvar estado
      saveAuthState(authState.value)
      
      return { success: true, user: newUser, token }
      
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { success: false, message: 'Erro ao criar conta. Tente novamente' }
    }
  }
  
  // Logout
  const logout = (): void => {
    authState.value = {
      user: null,
      isAuthenticated: false,
      token: null
    }
    clearAuthState()
  }
  
  // Funções administrativas
  const getAllUsers = (): User[] => {
    if (!hasPermission('canManageUsers')) {
      throw new Error('Sem permissão para listar usuários')
    }
    return loadUsers()
  }
  
  const promoteUser = (userId: string, newRole: 'user' | 'admin'): User | null => {
    if (!hasPermission('canManageUsers')) {
      throw new Error('Sem permissão para promover usuários')
    }
    
    // Super admin pode promover qualquer um
    // Admin só pode promover para user
    if (authState.value.user?.role === 'admin' && newRole === 'admin') {
      throw new Error('Apenas super admins podem promover outros administradores')
    }
    
    return updateUser(userId, { role: newRole })
  }
  
  const deactivateUser = (userId: string): User | null => {
    if (!hasPermission('canManageUsers')) {
      throw new Error('Sem permissão para desativar usuários')
    }
    
    // Não pode desativar a si mesmo
    if (userId === authState.value.user?.id) {
      throw new Error('Não é possível desativar sua própria conta')
    }
    
    return updateUser(userId, { isActive: false })
  }
  
  const activateUser = (userId: string): User | null => {
    if (!hasPermission('canManageUsers')) {
      throw new Error('Sem permissão para ativar usuários')
    }
    
    return updateUser(userId, { isActive: true })
  }
  
    const updateUserProfile = (userData: Partial<User>): User | null => {
    if (!authState.value.user) {
      throw new Error('Usuário não autenticado')
    }
    
    const updatedUser = updateUser(authState.value.user.id, userData)
    if (updatedUser) {
      authState.value.user = updatedUser
      saveAuthState(authState.value)
    }
    
    return updatedUser
  }

  const getStats = () => {
    if (!hasPermission('canAccessAdmin')) {
      throw new Error('Sem permissão para visualizar estatísticas')
    }

    return getSystemStats()
  }

  // Inicializar ao montar
  onMounted(async () => {
    await initialize()
  })

  return {
    // Estado
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    currentUser,
    
    // Métodos de autenticação
    login,
    register,
    logout,
    initialize,
    
    // Verificações
    hasPermission,
    
    // Métodos de perfil
    updateUserProfile,
    
    // Métodos administrativos
    getAllUsers,
    promoteUser,
    deactivateUser,
    activateUser,
    getStats
  }
} 