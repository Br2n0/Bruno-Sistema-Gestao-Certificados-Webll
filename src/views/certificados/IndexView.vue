<template>
  <div class="row">
    <!-- [ sample-page ] start -->
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome do Certificado</th>
                  <th>Área</th>
                  <th>Duração (horas)</th>
                  <th>Nível</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="certificado in certificados" :key="certificado.id">
                  <td>{{ certificado.nome }}</td>
                  <td>{{ certificado.area }}</td>
                  <td>{{ certificado.duracao }}</td>
                  <td>
                    <span :class="'badge bg-' + getBadgeColor(certificado.nivel)">
                      {{ certificado.nivel }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="'badge ' + (certificado.disponivel ? 'bg-success' : 'bg-warning')"
                    >
                      {{ certificado.disponivel ? 'Disponível' : 'Em breve' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <router-link 
                        :to="{ name: 'detalhe-certificado', params: { id: certificado.id }}" 
                        class="btn btn-sm btn-primary"
                      >
                        <i class="ti ti-eye"></i>
                      </router-link>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-success" 
                        :disabled="!certificado.disponivel"
                        @click="downloadCertificado(certificado.id)"
                      >
                        <i class="ti ti-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- [ sample-page ] end -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Certificado {
  id: number
  nome: string
  area: string
  duracao: number
  nivel: string
  disponivel: boolean
}

export default defineComponent({
  name: 'IndexView',
  data() {
    return {
      certificados: [
        {
          id: 1,
          nome: 'Desenvolvimento Web com HTML5 e CSS3',
          area: 'Desenvolvimento Web',
          duracao: 40,
          nivel: 'Básico',
          disponivel: true,
        },
        {
          id: 2,
          nome: 'JavaScript Avançado e ES6+',
          area: 'Desenvolvimento Web',
          duracao: 60,
          nivel: 'Intermediário',
          disponivel: true,
        },
        {
          id: 3,
          nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
          area: 'Desenvolvimento Web',
          duracao: 120,
          nivel: 'Avançado',
          disponivel: true,
        },
        {
          id: 4,
          nome: 'Banco de Dados SQL e NoSQL',
          area: 'Banco de Dados',
          duracao: 80,
          nivel: 'Intermediário',
          disponivel: true,
        },
        {
          id: 5,
          nome: 'Inteligência Artificial e Machine Learning',
          area: 'Ciência de Dados',
          duracao: 160,
          nivel: 'Avançado',
          disponivel: false,
        },
        {
          id: 6,
          nome: 'DevOps e Integração Contínua',
          area: 'Infraestrutura',
          duracao: 90,
          nivel: 'Intermediário',
          disponivel: true,
        },
        {
          id: 7,
          nome: 'Desenvolvimento Mobile com Flutter',
          area: 'Desenvolvimento Mobile',
          duracao: 100,
          nivel: 'Intermediário',
          disponivel: true,
        },
        {
          id: 8,
          nome: 'Segurança da Informação e Pentest',
          area: 'Segurança',
          duracao: 120,
          nivel: 'Avançado',
          disponivel: false,
        },
        {
          id: 9,
          nome: 'Arquitetura de Microsserviços',
          area: 'Arquitetura de Software',
          duracao: 80,
          nivel: 'Avançado',
          disponivel: true,
        },
        {
          id: 10,
          nome: 'Blockchain e Contratos Inteligentes',
          area: 'Tecnologias Emergentes',
          duracao: 70,
          nivel: 'Intermediário',
          disponivel: false,
        },
      ] as Certificado[],
    }
  },
  methods: {
    getBadgeColor(nivel: string): string {
      switch (nivel) {
        case 'Básico':
          return 'success'
        case 'Intermediário':
          return 'primary'
        case 'Avançado':
          return 'danger'
        default:
          return 'secondary'
      }
    },
    downloadCertificado(id: number) {
      // Implementação futura: lógica para download do certificado
      alert('Função de download será implementada na integração com o backend. Certificado ID: ' + id)
    }
  },
})
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
