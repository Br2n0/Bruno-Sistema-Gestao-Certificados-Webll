<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h5>Detalhes do Certificado</h5>
        </div>
        <div class="card-body">
          <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-3">Carregando detalhes do certificado...</p>
          </div>
          
          <div v-else-if="!certificado" class="alert alert-warning">
            <i class="ti ti-alert-circle me-2"></i>
            Certificado não encontrado ou indisponível no momento.
          </div>
          
          <div v-else>
            <div class="row mb-4">
              <div class="col-md-8">
                <h3 class="mb-3">{{ certificado.nome }}</h3>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-primary">{{ certificado.area }}</span>
                  <span :class="'badge bg-' + getBadgeColor(certificado.nivel)">{{ certificado.nivel }}</span>
                  <span :class="'badge ' + (certificado.disponivel ? 'bg-success' : 'bg-warning')">
                    {{ certificado.disponivel ? 'Disponível' : 'Em breve' }}
                  </span>
                  <span class="badge bg-secondary">{{ certificado.duracao }} horas</span>
                </div>
                <p class="lead">{{ certificado.descricao }}</p>
              </div>
              <div class="col-md-4 text-center">
                <div class="border p-3 rounded bg-light">
                  <img src="@/assets/images/certificado-template.png" alt="Certificado" class="img-fluid mb-3" />
                  <div class="d-grid gap-2">
                    <button 
                      class="btn btn-primary" 
                      :disabled="!certificado.disponivel"
                      @click="baixarCertificado">
                      <i class="ti ti-download me-2"></i>Baixar Certificado
                    </button>
                    <button 
                      class="btn btn-outline-primary"
                      @click="verificarAutenticidade">
                      <i class="ti ti-shield-check me-2"></i>Verificar Autenticidade
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="m-0">Conteúdo Programático</h6>
                  </div>
                  <div class="card-body">
                    <ul class="list-group list-group-flush">
                      <li v-for="(item, index) in certificado.conteudo" :key="index" class="list-group-item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="m-0">Informações do Certificado</h6>
                  </div>
                  <div class="card-body">
                    <table class="table">
                      <tbody>
                        <tr>
                          <th style="width: 40%">Código do Certificado</th>
                          <td>{{ certificado.codigo }}</td>
                        </tr>
                        <tr>
                          <th>Data de Emissão</th>
                          <td>{{ certificado.dataEmissao }}</td>
                        </tr>
                        <tr>
                          <th>Validade</th>
                          <td>{{ certificado.validade }}</td>
                        </tr>
                        <tr>
                          <th>Instituição</th>
                          <td>Hábeis Centro Educacional</td>
                        </tr>
                        <tr>
                          <th>Formato</th>
                          <td>PDF Digital</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-12 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h6 class="m-0">Histórico de Atividades</h6>
                  </div>
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table mb-0">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Atividade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(atividade, index) in certificado.atividades" :key="index">
                            <td>{{ atividade.data }}</td>
                            <td>{{ atividade.descricao }}</td>
                            <td>
                              <span :class="'badge bg-' + getStatusColor(atividade.status)">
                                {{ atividade.status }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import apiService from '@/services/apiService'

interface Atividade {
  data: string
  descricao: string
  status: string
}

interface Certificado {
  id: number
  nome: string
  area: string
  duracao: number
  nivel: string
  disponivel: boolean
  descricao: string
  codigo: string
  dataEmissao: string
  validade: string
  conteudo: string[]
  atividades: Atividade[]
}

export default defineComponent({
  name: 'DetalheView',
  data() {
    return {
      isLoading: true,
      certificado: null as Certificado | null,
    }
  },
  async created() {
    await this.carregarCertificado(Number(this.$route.params.id))
    this.isLoading = false
  },
  methods: {
    async carregarCertificado(id: number) {
      try {
        // Buscar certificado da API
        const certificado = await apiService.getCertificado(id)
        
        if (certificado) {
          this.certificado = {
            id: certificado.ID,
            nome: certificado.CursoTitulo,
            area: 'Desenvolvimento Web', // Campo não disponível na API ainda
            duracao: 40, // Valor padrão - deve vir do curso
            nivel: 'Intermediário', // Campo não disponível na API ainda
            disponivel: true,
            descricao: 'Este certificado atesta a conclusão bem-sucedida do curso.',
            codigo: certificado.Codigo_Validacao,
            dataEmissao: new Date(certificado.Data_Emissao).toLocaleDateString('pt-BR'),
            validade: 'Indeterminada',
            conteudo: [
              'Módulo 1: Fundamentos',
              'Módulo 2: Desenvolvimento Prático', 
              'Módulo 3: Projeto Final',
              'Avaliações e Certificação'
            ],
            atividades: [
              {
                data: new Date(certificado.Data_Emissao).toLocaleDateString('pt-BR'),
                descricao: 'Certificado emitido',
                status: 'Concluído',
              }
            ],
          }
        }
      } catch (error) {
        console.error('Erro ao carregar certificado:', error)
        this.certificado = null
      }
    },
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
    getStatusColor(status: string): string {
      switch (status) {
        case 'Concluído':
          return 'success'
        case 'Em andamento':
          return 'primary'
        case 'Aprovado':
          return 'success'
        case 'Pendente':
          return 'warning'
        default:
          return 'secondary'
      }
    },
    baixarCertificado() {
      // Implementação futura: lógica para download do certificado
      alert('Função de download será implementada na integração com o backend.')
    },
    verificarAutenticidade() {
      // Implementação futura: lógica para verificação de autenticidade
      alert('Código de autenticidade: ' + this.certificado?.codigo)
    }
  },
})
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
}
</style> 