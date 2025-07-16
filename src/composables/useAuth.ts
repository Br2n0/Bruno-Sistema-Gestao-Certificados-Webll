import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService, { type AlunoDTO, type AlunoLoginDTO, type AlunoCreateDTO } from '@/services/apiService'
import { API_CONFIG, API_ENDPOINTS } from '@/config/api'

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
  fotoUrl?: string
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
    dataCadastro: aluno.Data_Cadastro || new Date().toISOString(), // Fallback se undefined
    fotoUrl: aluno.FotoUrl || undefined
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
        dataCadastro: localStorage.getItem('current_user_date') || new Date().toISOString(),
        fotoUrl: localStorage.getItem('current_user_foto') || undefined
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

    // 🔍 DEBUG: Log das tentativas de login
    console.log('🔍 [AUTH] Iniciando tentativa de login:', { 
      email, 
      apiBaseURL: API_CONFIG.baseURL,
      loginEndpoint: API_ENDPOINTS.LOGIN 
    })

    try {
      const credentials: AlunoLoginDTO = {
        Email: email,
        Senha: password
      }

      console.log('📤 [AUTH] Enviando credenciais para API:', credentials)
      console.log('🌐 [AUTH] URL completa:', `${API_CONFIG.baseURL}${API_ENDPOINTS.LOGIN}`)

      const user = await apiService.login(credentials)
      
      console.log('✅ [AUTH] Login bem-sucedido - dados recebidos:', user)
      
      // 🔒 VERIFICAÇÃO DE SEGURANÇA: Garantir que os campos existem antes de usar
      if (!user.Email || !user.Nome || !user.ID) {
        console.error('❌ [AUTH] Campos obrigatórios ausentes na resposta:', { 
          email: user.Email, 
          nome: user.Nome, 
          id: user.ID 
        })
        throw new Error('Dados incompletos recebidos do servidor')
      }
      
      // Salvar dados no localStorage
      localStorage.setItem('current_user_email', user.Email)
      localStorage.setItem('current_user_name', user.Nome)
      localStorage.setItem('current_user_id', user.ID.toString())
      localStorage.setItem('current_user_date', user.Data_Cadastro || new Date().toISOString())
      if (user.FotoUrl) {
        localStorage.setItem('current_user_foto', user.FotoUrl)
      }
      
      console.log('💾 [AUTH] Dados salvos no localStorage')
      
      // Atualizar estado
      authState.value.user = mapAlunoToUser(user)
      authState.value.isAuthenticated = true

      console.log('🔄 [AUTH] Estado da aplicação atualizado')

      return { 
        success: true, 
        user 
      }

    } catch (error: any) {
      console.error('❌ [AUTH] Erro no login:', error)
      console.error('❌ [AUTH] Status da resposta:', error.response?.status)
      console.error('❌ [AUTH] Dados da resposta:', error.response?.data)
      console.error('❌ [AUTH] URL da requisição:', error.config?.url)
      console.error('❌ [AUTH] Método da requisição:', error.config?.method)
      console.error('❌ [AUTH] Headers enviados:', error.config?.headers)
      
      let message = 'Erro ao fazer login'
      if (error.response?.status === 401) {
        message = 'Email ou senha incorretos'
      } else if (error.response?.status === 404) {
        message = 'Email ou senha incorretos.'
      } else if (error.response?.status === 400) {
        message = error.response?.data?.message || error.response?.data || 'Dados inválidos'
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        message = 'Erro de conexão com o servidor. Verifique se a API está rodando.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }

      console.error('📋 [AUTH] Mensagem de erro final:', message)

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

    // 🔍 DEBUG: Log das tentativas de registro
    console.log('🔍 [AUTH] Iniciando tentativa de registro:', { 
      nome, 
      email, 
      apiBaseURL: API_CONFIG.baseURL,
      registerEndpoint: API_ENDPOINTS.REGISTER 
    })

    try {
      const userData: AlunoCreateDTO = {
        Nome: nome,
        Email: email,
        Senha: password
      }

      console.log('📤 [AUTH] Enviando dados para registro:', userData)
      console.log('🌐 [AUTH] URL completa:', `${API_CONFIG.baseURL}${API_ENDPOINTS.REGISTER}`)

      const user = await apiService.register(userData)
      
      console.log('✅ [AUTH] Registro bem-sucedido - dados recebidos:', user)
      
      // 🔒 VERIFICAÇÃO DE SEGURANÇA: Garantir que os campos existem antes de usar
      if (!user.Email || !user.Nome || !user.ID) {
        console.error('❌ [AUTH] Campos obrigatórios ausentes na resposta:', { 
          email: user.Email, 
          nome: user.Nome, 
          id: user.ID 
        })
        throw new Error('Dados incompletos recebidos do servidor')
      }
      
      // Salvar dados no localStorage
      localStorage.setItem('current_user_email', user.Email)
      localStorage.setItem('current_user_name', user.Nome)
      localStorage.setItem('current_user_id', user.ID.toString())
      localStorage.setItem('current_user_date', user.Data_Cadastro || new Date().toISOString())
      if (user.FotoUrl) {
        localStorage.setItem('current_user_foto', user.FotoUrl)
      }
      
      console.log('💾 [AUTH] Dados salvos no localStorage')
      
      // Atualizar estado
      authState.value.user = mapAlunoToUser(user)
      authState.value.isAuthenticated = true

      console.log('🔄 [AUTH] Estado da aplicação atualizado')

      return { 
        success: true, 
        user 
      }

    } catch (error: any) {
      console.error('❌ [AUTH] Erro no registro:', error)
      console.error('❌ [AUTH] Status da resposta:', error.response?.status)
      console.error('❌ [AUTH] Dados da resposta:', error.response?.data)
      console.error('❌ [AUTH] URL da requisição:', error.config?.url)
      console.error('❌ [AUTH] Método da requisição:', error.config?.method)
      console.error('❌ [AUTH] Headers enviados:', error.config?.headers)
      
      let message = 'Erro ao criar conta'
      if (error.response?.status === 400) {
        // Tratar erros específicos do backend
        if (error.response?.data?.message) {
          message = error.response.data.message
        } else if (error.response?.data) {
          message = error.response.data
        } else {
          message = 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.'
        }
      } else if (error.response?.status === 409) {
        message = 'Este email já está em uso'
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        message = 'Erro de conexão com o servidor. Verifique se a API está rodando.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }

      console.error('📋 [AUTH] Mensagem de erro final:', message)

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
    localStorage.removeItem('current_user_foto')
    
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
      
      // Salvar fotoUrl no localStorage se fornecida
      if (userData.fotoUrl !== undefined) {
        if (userData.fotoUrl) {
          localStorage.setItem('current_user_foto', userData.fotoUrl)
        } else {
          localStorage.removeItem('current_user_foto')
        }
      }
    }
  }

  // Função para alterar senha
  const alterarSenhaUsuario = async (senhaAtual: string, novaSenha: string): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser.value?.id) {
      return { success: false, message: 'Usuário não encontrado' }
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/Alunos/${currentUser.value.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Senha: novaSenha
        })
      })

      if (response.ok) {
        return { success: true, message: 'Senha alterada com sucesso!' }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, message: errorData.message || 'Erro ao alterar senha' }
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      return { success: false, message: 'Erro de conexão. Tente novamente.' }
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
    updateUserProfile,
    alterarSenhaUsuario
  }
} 