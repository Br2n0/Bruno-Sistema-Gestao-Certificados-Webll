import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService, { type AlunoDTO, type AlunoLoginDTO, type AlunoCreateDTO } from '@/services/apiService'

// Interface para resposta de autenticação
interface AuthResponse {
  success: boolean
  user?: AlunoDTO
  message?: string
  errors?: string[]
}

// Interface para dados do usuário atual
interface CurrentUser {
  id: number
  nome: string
  email: string
  dataCadastro: string
}

// Estado global de autenticação
const authState = ref<{
  user: CurrentUser | null
  isAuthenticated: boolean
  loading: boolean
}>({
  user: null,
  isAuthenticated: false,
  loading: false
})

export function useAuth() {
  const router = useRouter()

  // Lista de emails de administradores
  const adminEmails = [
    'admin@habeis.com',
    'administrador@habeis.com',
    'bruno@habeis.com',
    'admin@admin.com',
    'super@admin.com'
  ]

  // Computed properties
  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const currentUser = computed(() => authState.value.user)
  const isLoading = computed(() => authState.value.loading)
  
  // Verificar se é admin
  const isAdmin = computed(() => {
    if (!isAuthenticated.value || !currentUser.value?.email) {
      return false
    }
    return adminEmails.includes(currentUser.value.email.toLowerCase())
  })

  // Converter AlunoDTO para CurrentUser
  const mapAlunoToUser = (aluno: AlunoDTO): CurrentUser => ({
    id: aluno.ID,
    nome: aluno.Nome,
    email: aluno.Email,
    dataCadastro: aluno.Data_Cadastro
  })

  // Inicializar autenticação - verificar se há dados salvos
  const initialize = async (): Promise<void> => {
    authState.value.loading = true
    
    try {
      const userEmail = localStorage.getItem('current_user_email')
      const userName = localStorage.getItem('current_user_name')
      const userId = localStorage.getItem('current_user_id')
      
      // Se não há dados salvos, não há usuário logado
      if (!userEmail || !userName || userEmail === 'undefined' || userName === 'undefined') {
        authState.value.loading = false
        return
      }

      // Restaurar usuário com dados salvos
      authState.value.user = {
        id: parseInt(userId || '0'),
        nome: userName,
        email: userEmail,
        dataCadastro: localStorage.getItem('current_user_date') || new Date().toISOString()
      }
      authState.value.isAuthenticated = true
      
    } catch (error) {
      console.error('Erro na inicialização:', error)
      // Em caso de erro, limpar dados
      localStorage.removeItem('current_user_email')
      localStorage.removeItem('current_user_name')
      localStorage.removeItem('current_user_id')
      localStorage.removeItem('current_user_date')
    } finally {
      authState.value.loading = false
    }
  }

  // Login
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    authState.value.loading = true

    try {
      const credentials: AlunoLoginDTO = {
        Email: email,
        Senha: password
      }

      const user = await apiService.login(credentials)
      
      // Salvar dados no localStorage
      localStorage.setItem('current_user_email', user.Email)
      localStorage.setItem('current_user_name', user.Nome)
      localStorage.setItem('current_user_id', user.ID.toString())
      localStorage.setItem('current_user_date', user.Data_Cadastro)
      
      // Atualizar estado
      authState.value.user = mapAlunoToUser(user)
      authState.value.isAuthenticated = true

      return { 
        success: true, 
        user 
      }

    } catch (error: any) {
      console.error('Erro no login:', error)
      
      let message = 'Erro ao fazer login'
      if (error.response?.status === 401) {
        message = 'Email ou senha incorretos'
      } else if (error.response?.status === 404) {
        message = 'Usuário não encontrado'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      return { 
        success: false, 
        message 
      }
    } finally {
      authState.value.loading = false
    }
  }

  // Registro
  const register = async (nome: string, email: string, password: string): Promise<AuthResponse> => {
    authState.value.loading = true

    try {
      const userData: AlunoCreateDTO = {
        Nome: nome,
        Email: email,
        Senha: password
      }

      const user = await apiService.register(userData)
      
      // Salvar dados no localStorage
      localStorage.setItem('current_user_email', user.Email)
      localStorage.setItem('current_user_name', user.Nome)
      localStorage.setItem('current_user_id', user.ID.toString())
      localStorage.setItem('current_user_date', user.Data_Cadastro)
      
      // Atualizar estado
      authState.value.user = mapAlunoToUser(user)
      authState.value.isAuthenticated = true

      return { 
        success: true, 
        user 
      }

    } catch (error: any) {
      console.error('Erro no registro:', error)
      
      let message = 'Erro ao criar conta'
      if (error.response?.status === 400) {
        message = 'Dados inválidos'
      } else if (error.response?.status === 409) {
        message = 'Este email já está em uso'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      return { 
        success: false, 
        message 
      }
    } finally {
      authState.value.loading = false
    }
  }

  // Logout
  const logout = (): void => {
    authState.value.user = null
    authState.value.isAuthenticated = false
    
    // Limpar dados armazenados
    localStorage.removeItem('current_user_email')
    localStorage.removeItem('current_user_name')
    localStorage.removeItem('current_user_id')
    localStorage.removeItem('current_user_date')
    
    // Redirecionar para home
    router.push('/')
  }

  // Verificar se usuário tem permissão
  const hasPermission = (permission: string): boolean => {
    return authState.value.isAuthenticated
  }

  // Função para atualizar perfil do usuário
  const updateUserProfile = (userData: Partial<CurrentUser>): void => {
    if (authState.value.user) {
      authState.value.user = {
        ...authState.value.user,
        ...userData
      }
    }
  }

  return {
    // Estado
    isAuthenticated,
    currentUser,
    isLoading,
    isAdmin,
    
    // Métodos
    initialize,
    login,
    register,
    logout,
    hasPermission,
    updateUserProfile
  }
} 