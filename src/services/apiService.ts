import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { API_CONFIG, API_ENDPOINTS, AUTH_CONFIG } from '@/config/api'

// Tipos para DTOs da API
export interface AlunoDTO {
  ID: number
  Nome: string
  Email: string
  FotoUrl?: string      // Alinhado com backend
  Data_Cadastro?: string // Pode vir undefined em algumas situações
}

export interface AlunoCreateDTO {
  Nome: string
  Email: string
  Senha: string
}

export interface AlunoLoginDTO {
  Email: string
  Senha: string
}

export interface AlunoUpdateDTO {
  Nome?: string
  Email?: string
  Senha?: string
}

export interface CursoDTO {
  ID: number
  Titulo: string
  Descricao?: string
  Instrutor?: string
  Preco: number
  Duracao: number
}

export interface CursoCreateDTO {
  Titulo: string
  Descricao?: string
  Instrutor?: string
  Preco: number
  Duracao: number
}

export interface MatriculaDTO {
  ID: number
  Data_Matricula: string
  Curso_ID: number
  Aluno_ID: number
  Status: StatusMatricula
  CursoTitulo: string
  AlunoNome: string
}

export enum StatusMatricula {
  Ativa = 0,
  Concluida = 1,
  Cancelada = 2
}

export interface MatriculaCreateDTO {
  Curso_ID: number
  Aluno_ID: number
}

export interface MatriculaUpdateDTO {
  Status: StatusMatricula
}

export interface CertificadoDTO {
  ID: number
  Data_Emissao: string
  Curso_ID: number
  Aluno_ID: number
  Codigo_Validacao: string
  CursoTitulo: string
  AlunoNome: string
}

export interface CertificadoCreateDTO {
  Matricula_ID: number
}

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers
    })

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem(AUTH_CONFIG.tokenStorageKey)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptor para tratar erros de resposta
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem(AUTH_CONFIG.tokenStorageKey)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // === AUTENTICAÇÃO ===
  async login(credentials: AlunoLoginDTO): Promise<AlunoDTO> {
    const response: AxiosResponse<AlunoDTO> = await this.api.post(API_ENDPOINTS.LOGIN, credentials)
    return response.data
  }

  async register(userData: AlunoCreateDTO): Promise<AlunoDTO> {
    const response: AxiosResponse<AlunoDTO> = await this.api.post(API_ENDPOINTS.REGISTER, userData)
    return response.data
  }

  // === CURSOS ===
  async getCursos(): Promise<CursoDTO[]> {
    const response: AxiosResponse<CursoDTO[]> = await this.api.get(API_ENDPOINTS.CURSOS)
    return response.data
  }

  async getCurso(id: number): Promise<CursoDTO> {
    const response: AxiosResponse<CursoDTO> = await this.api.get(API_ENDPOINTS.CURSOS_BY_ID(id))
    return response.data
  }

  async createCurso(curso: CursoCreateDTO): Promise<CursoDTO> {
    const response: AxiosResponse<CursoDTO> = await this.api.post(API_ENDPOINTS.CURSOS, curso)
    return response.data
  }

  async updateCurso(id: number, curso: CursoCreateDTO): Promise<void> {
    await this.api.put(API_ENDPOINTS.CURSOS_BY_ID(id), curso)
  }

  async deleteCurso(id: number): Promise<void> {
    await this.api.delete(API_ENDPOINTS.CURSOS_BY_ID(id))
  }

  // === ALUNOS ===
  async getAlunos(): Promise<AlunoDTO[]> {
    const response: AxiosResponse<AlunoDTO[]> = await this.api.get(API_ENDPOINTS.ALUNOS)
    return response.data
  }

  async getAluno(id: number): Promise<AlunoDTO> {
    const response: AxiosResponse<AlunoDTO> = await this.api.get(API_ENDPOINTS.ALUNOS_BY_ID(id))
    return response.data
  }

  async updateAluno(id: number, aluno: AlunoUpdateDTO): Promise<void> {
    await this.api.put(API_ENDPOINTS.ALUNOS_BY_ID(id), aluno)
  }

  async deleteAluno(id: number): Promise<void> {
    await this.api.delete(API_ENDPOINTS.ALUNOS_BY_ID(id))
  }

  // === MATRÍCULAS ===
  async getMatriculas(): Promise<MatriculaDTO[]> {
    const response: AxiosResponse<MatriculaDTO[]> = await this.api.get(API_ENDPOINTS.MATRICULAS)
    return response.data
  }

  async getMatricula(id: number): Promise<MatriculaDTO> {
    const response: AxiosResponse<MatriculaDTO> = await this.api.get(API_ENDPOINTS.MATRICULAS_BY_ID(id))
    return response.data
  }

  async createMatricula(matricula: MatriculaCreateDTO): Promise<MatriculaDTO> {
    const response: AxiosResponse<MatriculaDTO> = await this.api.post(API_ENDPOINTS.MATRICULAS, matricula)
    return response.data
  }

  async updateMatricula(id: number, update: MatriculaUpdateDTO): Promise<void> {
    await this.api.put(API_ENDPOINTS.MATRICULAS_BY_ID(id), update)
  }

  async concluirMatricula(id: number): Promise<void> {
    await this.api.post(API_ENDPOINTS.MATRICULAS_CONCLUIR(id))
  }

  async deleteMatricula(id: number): Promise<void> {
    await this.api.delete(API_ENDPOINTS.MATRICULAS_BY_ID(id))
  }

  // === CERTIFICADOS ===
  async getCertificados(): Promise<CertificadoDTO[]> {
    const response: AxiosResponse<CertificadoDTO[]> = await this.api.get(API_ENDPOINTS.CERTIFICADOS)
    return response.data
  }

  async getCertificado(id: number): Promise<CertificadoDTO> {
    const response: AxiosResponse<CertificadoDTO> = await this.api.get(API_ENDPOINTS.CERTIFICADOS_BY_ID(id))
    return response.data
  }

  async createCertificado(certificado: CertificadoCreateDTO): Promise<CertificadoDTO> {
    const response: AxiosResponse<CertificadoDTO> = await this.api.post(API_ENDPOINTS.CERTIFICADOS, certificado)
    return response.data
  }

  async validarCertificado(codigo: string): Promise<CertificadoDTO> {
    const response: AxiosResponse<CertificadoDTO> = await this.api.post(API_ENDPOINTS.CERTIFICADOS_VALIDAR, { Codigo_Validacao: codigo })
    return response.data
  }

  // === UTILITÁRIOS ===
  setAuthToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.tokenStorageKey, token)
  }

  clearAuthToken(): void {
    localStorage.removeItem(AUTH_CONFIG.tokenStorageKey)
  }

  getAuthToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.tokenStorageKey)
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

// Instância singleton
export const apiService = new ApiService()
export default apiService 