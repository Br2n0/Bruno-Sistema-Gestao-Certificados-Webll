import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import apiService from '@/services/apiService'
import type { CursoDTO, MatriculaDTO } from '@/services/apiService'

// Estados globais para compartilhar entre componentes
const cursosEmAndamento = ref<any[]>([])
const certificadosObtidos = ref<any[]>([])
const loading = ref(false)

export function useUserData() {
  const { isAuthenticated, currentUser } = useAuth()

  // Computed properties
  const ultimoCursoEmAndamento = computed(() => {
    if (cursosEmAndamento.value.length === 0) return null
    
    return cursosEmAndamento.value
      .sort((a, b) => new Date(b.Data_Matricula).getTime() - new Date(a.Data_Matricula).getTime())[0]
  })

  const horasTotaisEstudadas = computed(() => {
    return certificadosObtidos.value.reduce((total, certificado) => {
      return total + (certificado.duracao || 0)
    }, 0)
  })

  const cursosFinalizados = computed(() => {
    return certificadosObtidos.value
  })

  // Método para carregar dados do usuário da API
  const carregarDadosUsuario = async () => {
    if (!isAuthenticated.value || !currentUser.value?.id) {
      loading.value = false
      return
    }

    try {
      loading.value = true
      
      // Buscar matrículas do usuário atual
      const todasMatriculas = await apiService.getMatriculas()
      const matriculasDoUsuario = todasMatriculas.filter(m => m.Aluno_ID === currentUser.value!.id)
      
      // Separar em andamento e concluídas
      const matriculasEmAndamento = matriculasDoUsuario.filter(m => m.Status === 0) // Ativa
      const matriculasConcluidas = matriculasDoUsuario.filter(m => m.Status === 1) // Concluida
      
      // Buscar certificados
      const todosCertificados = await apiService.getCertificados()
      const certificadosDoUsuario = todosCertificados.filter(c => c.Aluno_ID === currentUser.value!.id)
      
      cursosEmAndamento.value = matriculasEmAndamento.map(matricula => ({
        id: matricula.Curso_ID,
        titulo: matricula.CursoTitulo,
        progresso: 50, // Valor padrão - pode ser melhorado
        dataInicio: matricula.Data_Matricula,
        matriculaId: matricula.ID
      }))
      
      certificadosObtidos.value = certificadosDoUsuario.map(cert => ({
        id: cert.Curso_ID,
        titulo: cert.CursoTitulo,
        codigo: cert.Codigo_Validacao,
        dataEmissao: cert.Data_Emissao,
        duracao: 40 // Valor padrão - deve vir do curso
      }))
      
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    } finally {
      loading.value = false
    }
  }

  // Método para obter label da área
  const getAreaLabel = (area: string) => {
    switch (area) {
      case 'tecnologia': return 'Tecnologia'
      case 'administrativa': return 'Administrativo'
      case 'juridica': return 'Jurídico'
      default: return area
    }
  }

  // Método para formatar data
  const formatarData = (dataISO: string) => {
    try {
      const data = new Date(dataISO)
      return data.toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  return {
    // Estado
    cursosEmAndamento,
    certificadosObtidos,
    loading,
    
    // Computed
    ultimoCursoEmAndamento,
    horasTotaisEstudadas,
    cursosFinalizados,
    
    // Métodos
    carregarDadosUsuario,
    getAreaLabel,
    formatarData
  }
} 