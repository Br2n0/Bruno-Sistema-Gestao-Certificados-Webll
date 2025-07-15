import type { User, AuthState } from '@/types/auth'
import { generateId, hashPassword } from './autenticacao'

// Chaves do localStorage
const STORAGE_KEYS = {
  AUTH_STATE: 'habeis_auth_state',
  USERS: 'habeis_users',
  INITIALIZED: 'habeis_initialized'
}

// Usuário admin master padrão
const DEFAULT_ADMIN: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  nome: 'Admin Master',
  email: 'admin@habeis.com',
  telefone: '(00) 00000-0000',
  role: 'super-admin',
  isActive: true
}

// Salvar estado de autenticação
export const saveAuthState = (state: AuthState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(state))
  } catch (error) {
    console.error('Erro ao salvar estado de autenticação:', error)
  }
}

// Carregar estado de autenticação
export const loadAuthState = (): AuthState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_STATE)
    if (stored) {
      const state = JSON.parse(stored)
      // Converter strings de data para objetos Date
      if (state.user) {
        state.user.createdAt = new Date(state.user.createdAt)
        state.user.updatedAt = new Date(state.user.updatedAt)
        if (state.user.lastLogin) {
          state.user.lastLogin = new Date(state.user.lastLogin)
        }
      }
      return state
    }
  } catch (error) {
    console.error('Erro ao carregar estado de autenticação:', error)
  }
  return null
}

// Limpar estado de autenticação
export const clearAuthState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE)
  } catch (error) {
    console.error('Erro ao limpar estado de autenticação:', error)
  }
}

// Salvar usuários
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error('Erro ao salvar usuários:', error)
  }
}

// Carregar usuários
export const loadUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    if (stored) {
      const users = JSON.parse(stored)
      // Converter strings de data para objetos Date
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
      }))
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
  return []
}

// Buscar usuário por email
export const findUserByEmail = (email: string): User | null => {
  const users = loadUsers()
  return users.find(user => user.email === email) || null
}

// Buscar usuário por ID
export const findUserById = (id: string): User | null => {
  const users = loadUsers()
  return users.find(user => user.id === id) || null
}

// Criar novo usuário
export const createUser = async (userData: {
  nome: string
  email: string
  telefone: string
  password: string
  role?: 'user' | 'admin' | 'super-admin'
}): Promise<User> => {
  const users = loadUsers()
  
  // Verificar se já existe usuário com esse email
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Já existe um usuário com este email')
  }
  
  // Criar novo usuário
  const newUser: User = {
    id: generateId(),
    nome: userData.nome,
    email: userData.email,
    telefone: userData.telefone,
    role: userData.role || 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  // Salvar senha hasheada (em estrutura separada para simulação)
  const hashedPassword = await hashPassword(userData.password)
  saveUserPassword(newUser.id, hashedPassword)
  
  // Adicionar à lista de usuários
  users.push(newUser)
  saveUsers(users)
  
  return newUser
}

// Atualizar usuário
export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = loadUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    return null
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date()
  }
  
  saveUsers(users)
  return users[userIndex]
}

// Salvar senha do usuário (simulação - em produção seria em BD separado)
export const saveUserPassword = (userId: string, hashedPassword: string): void => {
  try {
    const passwords = JSON.parse(localStorage.getItem('habeis_passwords') || '{}')
    passwords[userId] = hashedPassword
    localStorage.setItem('habeis_passwords', JSON.stringify(passwords))
  } catch (error) {
    console.error('Erro ao salvar senha:', error)
  }
}

// Buscar senha do usuário
export const getUserPassword = (userId: string): string | null => {
  try {
    const passwords = JSON.parse(localStorage.getItem('habeis_passwords') || '{}')
    return passwords[userId] || null
  } catch (error) {
    console.error('Erro ao buscar senha:', error)
    return null
  }
}

// Alterar senha do usuário
export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Verificar se a senha atual está correta
    const currentHash = getUserPassword(userId)
    if (!currentHash) {
      return { success: false, message: 'Usuário não encontrado' }
    }

    // Importar verificação de senha
    const { verifyPassword, hashPassword } = await import('./autenticacao')
    
    const isCurrentPasswordValid = await verifyPassword(currentPassword, currentHash)
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Senha atual incorreta' }
    }

    // Verificar se a nova senha é diferente da atual
    if (currentPassword === newPassword) {
      return { success: false, message: 'A nova senha deve ser diferente da senha atual' }
    }

    // Gerar hash da nova senha
    const newPasswordHash = await hashPassword(newPassword)
    
    // Salvar nova senha
    saveUserPassword(userId, newPasswordHash)
    
    return { success: true, message: 'Senha alterada com sucesso' }
    
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return { success: false, message: 'Erro interno. Tente novamente' }
  }
}

// Inicializar sistema com admin padrão
export const initializeSystem = async (): Promise<void> => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  
  if (!isInitialized) {
    try {
      // Criar admin master padrão
      await createUser({
        nome: DEFAULT_ADMIN.nome,
        email: DEFAULT_ADMIN.email,
        telefone: DEFAULT_ADMIN.telefone || '(00) 00000-0000',
        password: 'admin123', // Senha padrão - deve ser alterada
        role: DEFAULT_ADMIN.role
      })

      // Criar usuário de teste comum
      await createUser({
        nome: 'João Silva',
        email: 'usuario@teste.com',
        telefone: '(11) 99999-9999',
        password: '123456',
        role: 'user'
      })

      // Criar usuário administrador de teste
      await createUser({
        nome: 'Maria Santos',
        email: 'admin@teste.com',
        telefone: '(11) 88888-8888',
        password: '123456',
        role: 'admin'
      })
      
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
      console.log('📚 Sistema Hábeis Educacional Inicializado!')
      console.log('🔐 Contas de teste criadas:')
      console.log('👨‍💼 Admin Master: admin@habeis.com | Senha: admin123')
      console.log('👤 Usuário Comum: usuario@teste.com | Senha: 123456')
      console.log('👩‍💼 Admin: admin@teste.com | Senha: 123456')
      console.log('')
      console.log('💡 Para resetar o sistema em desenvolvimento, execute:')
      console.log('resetSystem()')
      
      // Expor função de reset globalmente para desenvolvimento
      if (typeof window !== 'undefined') {
        (window as any).resetSystem = resetSystem
      }
    } catch (error) {
      console.error('Erro ao inicializar sistema:', error)
    }
  }
}

// Verificar se é primeiro acesso
export const isFirstAccess = (): boolean => {
  return !localStorage.getItem(STORAGE_KEYS.INITIALIZED)
}

// Resetar sistema (útil para desenvolvimento)
export const resetSystem = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE)
  localStorage.removeItem(STORAGE_KEYS.USERS)
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
  localStorage.removeItem('habeis_passwords')
  console.log('🔄 Sistema resetado! Recarregue a página para recriar usuários de teste.')
}

// Obter estatísticas do sistema
export const getSystemStats = () => {
  const users = loadUsers()
  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.isActive).length,
    admins: users.filter(user => user.role === 'admin').length,
    superAdmins: users.filter(user => user.role === 'super-admin').length,
    lastUsers: users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
  }
} 