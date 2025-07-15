import apiService, { 
  type CursoDTO, 
  type AlunoDTO, 
  type CertificadoDTO,
  type MatriculaDTO,
  type CursoCreateDTO,
  type AlunoCreateDTO,
  type MatriculaCreateDTO,
  type CertificadoCreateDTO
} from './apiService'

// Tipos simplificados para compatibilidade com o frontend atual
export interface Curso {
  id: number
  nome: string
  descricao: string
  cargaHoraria: number
  instrutor: string
  categoria: string
  status: 'ativo' | 'inativo'
  dataInicio?: string
  dataFim?: string
  createdAt: string
  updatedAt: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
  tipo: 'admin' | 'aluno' | 'instrutor'
  status: 'ativo' | 'inativo'
  dataRegistro: string
  ultimoAcesso: string
}

export interface Certificado {
  id: number
  aluno: string
  curso: string
  dataEmissao: string
  codigo: string
  status: 'emitido' | 'pendente' | 'cancelado'
  notaFinal: number
  cargaHoraria: number
  validade?: string
}

// Conversores de DTO para interfaces do frontend
const mapCursoDTO = (dto: CursoDTO): Curso => ({
  id: dto.ID,
  nome: dto.Titulo,
  descricao: dto.Descricao || '',
  cargaHoraria: dto.Duracao,
  instrutor: dto.Instrutor || '',
  categoria: 'Geral', // A API não tem categoria ainda
  status: 'ativo', // Assumir ativo por padrão
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const mapAlunoDTO = (dto: AlunoDTO): Usuario => ({
  id: dto.ID,
  nome: dto.Nome,
  email: dto.Email,
  cpf: '', // A API não tem CPF ainda
  telefone: '', // A API não tem telefone ainda
  tipo: 'aluno',
  status: 'ativo',
  dataRegistro: dto.Data_Cadastro,
  ultimoAcesso: new Date().toISOString()
})

const mapCertificadoDTO = (dto: CertificadoDTO): Certificado => ({
  id: dto.ID,
  aluno: dto.AlunoNome,
  curso: dto.CursoTitulo,
  dataEmissao: dto.Data_Emissao,
  codigo: dto.Codigo_Validacao,
  status: 'emitido',
  notaFinal: 10, // Nota padrão
  cargaHoraria: 0 // Será calculado depois
})

// Conversores inversos para criar DTOs
const mapCursoToDTO = (curso: Partial<Curso>): CursoCreateDTO => ({
  Titulo: curso.nome || '',
  Descricao: curso.descricao,
  Instrutor: curso.instrutor,
  Preco: 0, // Cursos gratuitos por padrão
  Duracao: curso.cargaHoraria || 0
})

const mapUsuarioToDTO = (usuario: Partial<Usuario>): AlunoCreateDTO => ({
  Nome: usuario.nome || '',
  Email: usuario.email || '',
  Senha: '123456' // Senha padrão - deve ser alterada
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

  async setCursos(cursos: Curso[]): Promise<void> {
    // Esta função não faz sentido com API real
    // Mantida apenas para compatibilidade
    console.warn('setCursos não implementado com API real')
  }

  async addCurso(curso: Partial<Curso>): Promise<Curso | null> {
    try {
      const cursoDTO = mapCursoToDTO(curso)
      const novoCursoDTO = await apiService.createCurso(cursoDTO)
      return mapCursoDTO(novoCursoDTO)
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      return null
    }
  }

  async updateCurso(id: number, curso: Partial<Curso>): Promise<boolean> {
    try {
      const cursoDTO = mapCursoToDTO(curso)
      await apiService.updateCurso(id, cursoDTO)
      return true
    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      return false
    }
  }

  async deleteCurso(id: number): Promise<boolean> {
    try {
      await apiService.deleteCurso(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar curso:', error)
      return false
    }
  }

  // === USUÁRIOS ===
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const alunosDTO = await apiService.getAlunos()
      return alunosDTO.map(mapAlunoDTO)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return []
    }
  }

  async setUsuarios(usuarios: Usuario[]): Promise<void> {
    // Esta função não faz sentido com API real
    console.warn('setUsuarios não implementado com API real')
  }

  async addUsuario(usuario: Partial<Usuario>): Promise<Usuario | null> {
    try {
      const alunoDTO = mapUsuarioToDTO(usuario)
      const novoAlunoDTO = await apiService.register(alunoDTO)
      return mapAlunoDTO(novoAlunoDTO)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      return null
    }
  }

  async updateUsuario(id: number, usuario: Partial<Usuario>): Promise<boolean> {
    try {
      // A API não tem endpoint de update para alunos ainda
      // Implementar quando disponível
      console.warn('updateUsuario não implementado na API ainda')
      return false
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return false
    }
  }

  async deleteUsuario(id: number): Promise<boolean> {
    try {
      // A API não tem endpoint de delete para alunos ainda
      // Implementar quando disponível
      console.warn('deleteUsuario não implementado na API ainda')
      return false
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return false
    }
  }

  // === CERTIFICADOS ===
  async getCertificados(): Promise<Certificado[]> {
    try {
      const certificadosDTO = await apiService.getCertificados()
      return certificadosDTO.map(mapCertificadoDTO)
    } catch (error) {
      console.error('Erro ao buscar certificados:', error)
      return []
    }
  }

  async setCertificados(certificados: Certificado[]): Promise<void> {
    // Esta função não faz sentido com API real
    console.warn('setCertificados não implementado com API real')
  }

  async addCertificado(certificado: Partial<Certificado>): Promise<Certificado | null> {
    try {
      // Para criar certificado, precisamos de curso_id e aluno_id
      // Como só temos nomes, não podemos implementar agora
      console.warn('addCertificado precisa ser implementado com IDs reais')
      return null
    } catch (error) {
      console.error('Erro ao criar certificado:', error)
      return null
    }
  }

  async updateCertificado(id: number, certificado: Partial<Certificado>): Promise<boolean> {
    try {
      // A API não tem endpoint de update para certificados
      console.warn('updateCertificado não implementado na API')
      return false
    } catch (error) {
      console.error('Erro ao atualizar certificado:', error)
      return false
    }
  }

  async deleteCertificado(id: number): Promise<boolean> {
    try {
      // A API não tem endpoint de delete para certificados ainda
      console.warn('deleteCertificado não implementado na API ainda')
      return false
    } catch (error) {
      console.error('Erro ao deletar certificado:', error)
      return false
    }
  }

  // === MATRÍCULAS (Novo) ===
  async getMatriculas(): Promise<MatriculaDTO[]> {
    try {
      return await apiService.getMatriculas()
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error)
      return []
    }
  }

  async createMatricula(cursoId: number, alunoId: number): Promise<MatriculaDTO | null> {
    try {
      const matriculaDTO: MatriculaCreateDTO = {
        Curso_ID: cursoId,
        Aluno_ID: alunoId
      }
      return await apiService.createMatricula(matriculaDTO)
    } catch (error) {
      console.error('Erro ao criar matrícula:', error)
      return null
    }
  }

  async finalizarMatricula(matriculaId: number): Promise<boolean> {
    try {
      await apiService.updateMatricula(matriculaId, { Status: 1 }) // Concluida
      return true
    } catch (error) {
      console.error('Erro ao finalizar matrícula:', error)
      return false
    }
  }

  // === VALIDAÇÃO DE CERTIFICADO ===
  async validarCertificado(codigo: string): Promise<CertificadoDTO | null> {
    try {
      return await apiService.validarCertificado(codigo)
    } catch (error) {
      console.error('Erro ao validar certificado:', error)
      return null
    }
  }
}

// Instância singleton do serviço
export const dataService = new DataService()
export default dataService 