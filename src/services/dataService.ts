import apiService, { 
  type CursoDTO, 
  type AlunoDTO, 
  type CertificadoDTO,
  type MatriculaDTO,
  type CursoCreateDTO,
  type AlunoCreateDTO,
  type AlunoUpdateDTO,
  type MatriculaCreateDTO,
  type CertificadoCreateDTO
} from './apiService'

// Tipos simplificados para compatibilidade com o frontend atual
export interface Curso {
  id: number
  titulo: string
  descricao: string
  duracao: number
  instrutor: string
  preco: number
  createdAt: string
  updatedAt: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  dataCadastro: string  // Sempre terá valor (fallback se API não retornar)
  fotoUrl?: string      // Alinhado com FotoUrl do backend
}

export interface Certificado {
  id: number
  aluno: string
  curso: string
  dataEmissao: string
  codigo: string
  notaFinal?: number
  cargaHoraria?: number
}

export interface Matricula {
  id: number
  curso: string
  aluno: string
  dataMatricula: string
  status: string
}

// Conversores de DTO para interfaces do frontend
const mapCursoDTO = (dto: CursoDTO): Curso => ({
  id: dto.ID,
  titulo: dto.Titulo,
  descricao: dto.Descricao || '',
  duracao: dto.Duracao,
  instrutor: dto.Instrutor || '',
  preco: dto.Preco,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const mapAlunoDTO = (dto: AlunoDTO): Usuario => ({
  id: dto.ID,
  nome: dto.Nome,
  email: dto.Email,
  dataCadastro: dto.Data_Cadastro || new Date().toISOString(), // Fallback se undefined
  fotoUrl: dto.FotoUrl || undefined           // Inclui FotoUrl do backend
})

const mapCertificadoDTO = (dto: CertificadoDTO): Certificado => ({
  id: dto.ID,
  aluno: dto.AlunoNome,
  curso: dto.CursoTitulo,
  dataEmissao: dto.Data_Emissao,
  codigo: dto.Codigo_Validacao,
  notaFinal: 10, // Nota padrão
  cargaHoraria: 0 // Será calculado depois
})

// Conversores inversos para criar DTOs
const mapCursoToDTO = (curso: Partial<Curso>): CursoCreateDTO => ({
  Titulo: curso.titulo || '',
  Descricao: curso.descricao,
  Instrutor: curso.instrutor,
  Preco: curso.preco || 0,
  Duracao: curso.duracao || 0
})

const mapUsuarioToDTO = (usuario: Partial<Usuario>, senha?: string): AlunoCreateDTO => ({
  Nome: usuario.nome || '',
  Email: usuario.email || '',
  Senha: senha || '123456' // Aceita senha do formulário ou usa padrão
})

// Serviço centralizado de dados (agora usando API)
class DataService {
  // === CURSOS ===
  async getCursos(): Promise<Curso[]> {
    try {
      const cursosDTO = await apiService.getCursos()
      return cursosDTO.map(mapCursoDTO)
    } catch (error) {
      console.error('Erro ao buscar cursos:', error)
      return []
    }
  }

  async getCurso(id: number): Promise<Curso | null> {
    try {
      const cursoDTO = await apiService.getCurso(id)
      return mapCursoDTO(cursoDTO)
    } catch (error) {
      console.error('Erro ao buscar curso:', error)
      return null
    }
  }

  async criarCurso(curso: Partial<Curso>): Promise<Curso | null> {
    try {
      const cursoDTO = mapCursoToDTO(curso)
      const novoCursoDTO = await apiService.createCurso(cursoDTO)
      return mapCursoDTO(novoCursoDTO)
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      throw error
    }
  }

  async atualizarCurso(id: number, curso: Partial<Curso>): Promise<boolean> {
    try {
      const cursoDTO = mapCursoToDTO(curso)
      await apiService.updateCurso(id, cursoDTO)
      return true
    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      return false
    }
  }

  async excluirCurso(id: number): Promise<boolean> {
    try {
      await apiService.deleteCurso(id)
      return true
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      return false
    }
  }

  // === USUÁRIOS/ALUNOS ===
  async listarAlunos(): Promise<Usuario[]> {
    try {
      const alunosDTO = await apiService.getAlunos()
      return alunosDTO.map(mapAlunoDTO)
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
      return []
    }
  }

  async obterAluno(id: number): Promise<Usuario | null> {
    try {
      const alunoDTO = await apiService.getAluno(id)
      return mapAlunoDTO(alunoDTO)
    } catch (error) {
      console.error('Erro ao buscar aluno:', error)
      return null
    }
  }

  async criarAluno(usuario: Partial<Usuario> & { senha?: string }): Promise<Usuario | null> {
    try {
      const alunoDTO = mapUsuarioToDTO(usuario, usuario.senha)
      const novoAlunoDTO = await apiService.register(alunoDTO)
      return mapAlunoDTO(novoAlunoDTO)
    } catch (error) {
      console.error('Erro ao criar aluno:', error)
      throw error
    }
  }

  async atualizarAluno(id: number, usuario: Partial<Usuario> & { senha?: string }): Promise<boolean> {
    try {
      const updateDTO: AlunoUpdateDTO = {
        Nome: usuario.nome,
        Email: usuario.email,
        Senha: usuario.senha
      }
      await apiService.updateAluno(id, updateDTO)
      return true
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error)
      throw error
    }
  }

  async excluirAluno(id: number): Promise<boolean> {
    try {
      await apiService.deleteAluno(id)
      return true
    } catch (error) {
      console.error('Erro ao excluir aluno:', error)
      throw error
    }
  }

  // === CERTIFICADOS ===
  async listarCertificados(): Promise<Certificado[]> {
    try {
      const certificadosDTO = await apiService.getCertificados()
      return certificadosDTO.map(mapCertificadoDTO)
    } catch (error) {
      console.error('Erro ao buscar certificados:', error)
      return []
    }
  }

  async obterCertificado(id: number): Promise<Certificado | null> {
    try {
      const certificadoDTO = await apiService.getCertificado(id)
      return mapCertificadoDTO(certificadoDTO)
    } catch (error) {
      console.error('Erro ao buscar certificado:', error)
      return null
    }
  }

  async validarCertificado(codigo: string): Promise<Certificado | null> {
    try {
      const certificadoDTO = await apiService.validarCertificado(codigo)
      return mapCertificadoDTO(certificadoDTO)
    } catch (error) {
      console.error('Erro ao validar certificado:', error)
      return null
    }
  }

  // Métodos que usavam dados mockados foram removidos
  // Agora tudo usa a API real

  // Métodos de compatibilidade para código legacy
  addCurso(curso: Partial<Curso>): Curso | null {
    console.warn('addCurso é deprecado, use criarCurso')
    return null
  }

  updateCurso(id: number, curso: Partial<Curso>): boolean {
    console.warn('updateCurso é deprecado, use atualizarCurso')
    return false
  }

  addCertificado(certificado: Partial<Certificado>): Certificado | null {
    console.warn('addCertificado é deprecado, use API diretamente')
    return null
  }

  updateCertificado(id: number, certificado: Partial<Certificado>): boolean {
    console.warn('updateCertificado é deprecado, use API diretamente')
    return false
  }
}

// Instância singleton
export const dataService = new DataService()
export default dataService 