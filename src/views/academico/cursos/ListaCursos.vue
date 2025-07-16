<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Cursos</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="navegarParaNovoCurso"
      >
        Novo Curso
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Carregando cursos...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
      <button @click="carregarCursos" class="ml-2 text-red-800 underline">Tentar novamente</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="cursos.length === 0" class="text-center py-8">
      <div class="text-gray-600 mb-4">Nenhum curso encontrado</div>
      <button
        @click="navegarParaNovoCurso"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Criar Primeiro Curso
      </button>
    </div>

    <!-- Cursos Table -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título do Curso
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Instrutor
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duração (h)
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="curso in cursos" :key="curso.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ curso.titulo }}</div>
              <div v-if="curso.descricao" class="text-sm text-gray-500 truncate max-w-xs">
                {{ curso.descricao }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ curso.instrutor || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ curso.duracao }}h</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ curso.preco === 0 ? 'Gratuito' : `R$ ${curso.preco.toFixed(2)}` }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="editarCurso(curso.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Editar
              </button>
              <button
                @click="visualizarCurso(curso.id)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Visualizar
              </button>
              <button
                @click="confirmarExclusao(curso)"
                class="text-red-600 hover:text-red-900"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="cursoParaExcluir" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-medium mb-4">Confirmar Exclusão</h3>
        <p class="text-gray-600 mb-6">
          Tem certeza que deseja excluir o curso <strong>{{ cursoParaExcluir.titulo }}</strong>?
          Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cursoParaExcluir = null"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="excluirCurso"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            :disabled="loading"
          >
            {{ loading ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService, type CursoDTO } from '@/services/apiService'

const router = useRouter()

interface Curso {
  id: number
  titulo: string
  descricao: string
  instrutor: string
  duracao: number
  preco: number
}

const cursos = ref<Curso[]>([])
const loading = ref(false)
const error = ref('')
const cursoParaExcluir = ref<Curso | null>(null)

onMounted(() => {
  carregarCursos()
})

const carregarCursos = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const cursosAPI = await apiService.getCursos()
    cursos.value = cursosAPI.map((curso: CursoDTO) => ({
      id: curso.ID,
      titulo: curso.Titulo,
      descricao: curso.Descricao || '',
      instrutor: curso.Instrutor || '',
      duracao: curso.Duracao,
      preco: curso.Preco
    }))
  } catch (err: any) {
    error.value = 'Erro ao carregar cursos'
    console.error('Erro ao carregar cursos:', err)
  } finally {
    loading.value = false
  }
}

const navegarParaNovoCurso = () => {
  router.push('/academico/cursos/novo')
}

const editarCurso = (id: number) => {
  router.push(`/academico/cursos/${id}/editar`)
}

const visualizarCurso = (id: number) => {
  router.push(`/academico/cursos/${id}`)
}

const confirmarExclusao = (curso: Curso) => {
  cursoParaExcluir.value = curso
}

const excluirCurso = async () => {
  if (!cursoParaExcluir.value) return
  
  try {
    loading.value = true
    await apiService.deleteCurso(cursoParaExcluir.value.id)
    await carregarCursos()
    cursoParaExcluir.value = null
  } catch (err: any) {
    error.value = 'Erro ao excluir curso'
    console.error('Erro ao excluir curso:', err)
  } finally {
    loading.value = false
  }
}
</script> 