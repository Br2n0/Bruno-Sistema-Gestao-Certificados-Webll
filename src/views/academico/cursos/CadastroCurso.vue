<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Curso' : 'Novo Curso' }}</h1>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="salvarCurso" class="space-y-6">
        <div>
          <label for="titulo" class="block text-sm font-medium text-gray-700">Título do Curso</label>
          <input
            type="text"
            id="titulo"
            v-model="formData.titulo"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            id="descricao"
            v-model="formData.descricao"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="duracao" class="block text-sm font-medium text-gray-700">Duração (horas)</label>
            <input
              type="number"
              id="duracao"
              v-model.number="formData.duracao"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label for="instrutor" class="block text-sm font-medium text-gray-700">Instrutor</label>
            <input
              type="text"
              id="instrutor"
              v-model="formData.instrutor"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="voltar"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="loading"
          >
            {{ loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Cadastrar') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Loading/Error States -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiService, type CursoCreateDTO, type CursoDTO } from '@/services/apiService'

const router = useRouter()
const route = useRoute()

const isEdicao = ref(false)
const loading = ref(false)
const error = ref('')

const formData = ref({
  titulo: '',
  descricao: '',
  duracao: 0,
  instrutor: ''
})

onMounted(async () => {
  const cursoId = route.params.id
  if (cursoId && typeof cursoId === 'string') {
    isEdicao.value = true
    await carregarCurso(parseInt(cursoId))
  }
})

const carregarCurso = async (id: number) => {
  try {
    loading.value = true
    error.value = ''
    
    const curso = await apiService.getCurso(id)
    formData.value = {
      titulo: curso.Titulo,
      descricao: curso.Descricao || '',
      duracao: curso.Duracao,
      instrutor: curso.Instrutor || ''
    }
  } catch (err: any) {
    error.value = 'Erro ao carregar dados do curso'
    console.error('Erro ao carregar curso:', err)
  } finally {
    loading.value = false
  }
}

const salvarCurso = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const cursoData: CursoCreateDTO = {
      Titulo: formData.value.titulo,
      Descricao: formData.value.descricao || undefined,
      Instrutor: formData.value.instrutor || undefined,
      Preco: 0, // Cursos gratuitos por padrão
      Duracao: formData.value.duracao
    }
    
    if (isEdicao.value) {
      const cursoId = parseInt(route.params.id as string)
      await apiService.updateCurso(cursoId, cursoData)
    } else {
      await apiService.createCurso(cursoData)
    }
    
    // Redireciona para a lista de cursos
    router.push('/academico/cursos')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao salvar curso'
    console.error('Erro ao salvar curso:', err)
  } finally {
    loading.value = false
  }
}

const voltar = () => {
  router.push('/academico/cursos')
}
</script> 