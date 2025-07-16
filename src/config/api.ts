// Configuração da API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5121/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Configuração de autenticação
export const AUTH_CONFIG = {
  tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'habeis_auth_token',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'habeis_jwt_secret_key_2024'
}

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  LOGIN: '/Alunos/login',
  REGISTER: '/Alunos',
  
  // Cursos
  CURSOS: '/Cursos',
  CURSOS_BY_ID: (id: number) => `/Cursos/${id}`,
  
  // Alunos
  ALUNOS: '/Alunos',
  ALUNOS_BY_ID: (id: number) => `/Alunos/${id}`,
  
  // Matrículas
  MATRICULAS: '/Matriculas',
  MATRICULAS_BY_ID: (id: number) => `/Matriculas/${id}`,
  MATRICULAS_CONCLUIR: (id: number) => `/Matriculas/${id}/concluir`,
  
  // Certificados
  CERTIFICADOS: '/Certificados',
  CERTIFICADOS_BY_ID: (id: number) => `/Certificados/${id}`,
  CERTIFICADOS_VALIDAR: '/Certificados/validar'
} as const 