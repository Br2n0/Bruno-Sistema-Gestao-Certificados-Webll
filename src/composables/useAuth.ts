import { ref, computed } from 'vue'

// Tipo do usuário
interface User {
  id: number
  nome: string
  email: string
  role: 'user' | 'admin'
}

// Estado global de autenticação (simulado - em produção viria de uma API)
const user = ref<User | null>({
  id: 1,
  nome: "Bruno Santos",
  email: "bruno@exemplo.com", 
  role: "admin" // "user" | "admin"
})

const isLoggedIn = ref(true) // Simula usuário logado

export function useAuth() {
  // Verifica se usuário é administrador
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // Verifica se usuário está logado
  const isAuthenticated = computed(() => isLoggedIn.value && user.value !== null)
  
  // Dados do usuário atual
  const currentUser = computed(() => user.value)
  
  // Simula logout
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
  }
  
  return {
    isAdmin,
    isAuthenticated, 
    currentUser,
    logout
  }
} 