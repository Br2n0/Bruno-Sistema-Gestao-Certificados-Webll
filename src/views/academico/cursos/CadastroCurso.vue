<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">{{ isEdicao ? 'Editar Curso' : 'Novo Curso' }}</h1>
    </div>

    <div class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="salvarCurso" class="space-y-6">
        <div>
          <label for="nome" class="block text-sm font-medium text-gray-700">Nome do Curso</label>
          <input
            type="text"
            id="nome"
            v-model="formData.nome"
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
            <label for="duracao" class="block text-sm font-medium text-gray-700">Duração (meses)</label>
            <input
              type="number"
              id="duracao"
              v-model="formData.duracao"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="formData.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="voltar"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {{ isEdicao ? 'Atualizar' : 'Cadastrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isEdicao = ref(false)
const formData = ref({
  nome: '',
  descricao: '',
  duracao: 0,
  status: 'Ativo'
})

onMounted(() => {
  const cursoId = route.params.id
  if (cursoId) {
    isEdicao.value = true
    // Aqui você faria uma chamada à API para buscar os dados do curso
    // Por enquanto, vamos usar dados mock
    formData.value = {
      nome: 'Curso Exemplo',
      descricao: 'Descrição do curso exemplo',
      duracao: 6,
      status: 'Ativo'
    }
  }
})

const salvarCurso = async () => {
  try {
    // Aqui você implementaria a lógica para salvar no backend
    console.log('Dados do curso:', formData.value)
    
    // Simula uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redireciona para a lista de cursos
    router.push('/academico/cursos')
  } catch (error) {
    console.error('Erro ao salvar curso:', error)
  }
}

const voltar = () => {
  router.push('/academico/cursos')
}
</script> 