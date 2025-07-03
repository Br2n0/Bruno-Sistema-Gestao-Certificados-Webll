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

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome do Curso
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duração
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="curso in cursos" :key="curso.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ curso.nome }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ curso.duracao }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': curso.status === 'Ativo',
                  'bg-red-100 text-red-800': curso.status === 'Inativo'
                }"
              >
                {{ curso.status }}
              </span>
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
                class="text-blue-600 hover:text-blue-900"
              >
                Visualizar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock de dados - substituir por dados reais da API
const cursos = ref([
  {
    id: 1,
    nome: 'Desenvolvimento Web',
    duracao: '6 meses',
    status: 'Ativo'
  },
  {
    id: 2,
    nome: 'Design UX/UI',
    duracao: '4 meses',
    status: 'Ativo'
  },
  {
    id: 3,
    nome: 'Marketing Digital',
    duracao: '3 meses',
    status: 'Inativo'
  }
])

const navegarParaNovoCurso = () => {
  router.push('/academico/cursos/novo')
}

const editarCurso = (id: number) => {
  router.push(`/academico/cursos/${id}/editar`)
}

const visualizarCurso = (id: number) => {
  router.push(`/academico/cursos/${id}`)
}
</script> 