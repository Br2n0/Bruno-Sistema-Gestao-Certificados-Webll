<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card mb-4">
        <div class="card-header">
          <h5>Validação de Certificados</h5>
        </div>
        <div class="card-body">
          <p class="mb-4">
            Digite o código do certificado para verificar sua autenticidade e obter informações detalhadas.
            Todos os certificados emitidos pelo Hábeis Centro Educacional possuem um código único.
          </p>
          
          <div class="row g-3 mb-4">
            <div class="col-lg-8">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Digite o código do certificado (Ex: CERT-123456)" 
                v-model="codigoCertificado"
                @keyup.enter="validarCertificado"
              >
            </div>
            <div class="col-lg-4">
              <button 
                class="btn btn-primary w-100" 
                @click="validarCertificado"
                :disabled="isLoading || !codigoCertificado"
              >
                <i class="ti ti-search me-2" v-if="!isLoading"></i>
                <span class="spinner-border spinner-border-sm me-2" role="status" v-if="isLoading"></span>
                {{ isLoading ? 'Validando...' : 'Validar Certificado' }}
              </button>
            </div>
          </div>
          
          <div v-if="mensagemErro" class="alert alert-danger">
            <i class="ti ti-alert-circle me-2"></i>
            {{ mensagemErro }}
          </div>
          
          <div v-if="certificadoValidado" class="border rounded p-3 bg-light">
            <div class="d-flex align-items-center mb-4">
              <div class="bg-success bg-opacity-10 p-3 rounded me-3">
                <i class="ti ti-certificate fs-1 text-success"></i>
              </div>
              <div>
                <h4 class="mb-1">{{ certificadoValidado.nome }}</h4>
                <p class="mb-0 text-success">
                  <i class="ti ti-check-circle me-1"></i> Certificado válido e autêntico
                </p>
              </div>
            </div>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="card h-100 border-0">
                  <div class="card-header bg-transparent">
                    <h6 class="mb-0">Informações do Certificado</h6>
                  </div>
                  <div class="card-body">
                    <table class="table table-sm">
                      <tbody>
                        <tr>
                          <th style="width: 40%">Código</th>
                          <td><span class="badge bg-primary">{{ certificadoValidado.codigo }}</span></td>
                        </tr>
                        <tr>
                          <th>Área</th>
                          <td>{{ certificadoValidado.area }}</td>
                        </tr>
                        <tr>
                          <th>Duração</th>
                          <td>{{ certificadoValidado.duracao }} horas</td>
                        </tr>
                        <tr>
                          <th>Nível</th>
                          <td>
                            <span :class="'badge bg-' + getBadgeColor(certificadoValidado.nivel)">
                              {{ certificadoValidado.nivel }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Data de Emissão</th>
                          <td>{{ certificadoValidado.dataEmissao }}</td>
                        </tr>
                        <tr>
                          <th>Validade</th>
                          <td>{{ certificadoValidado.validade }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="card h-100 border-0">
                  <div class="card-header bg-transparent">
                    <h6 class="mb-0">Informações do Portador</h6>
                  </div>
                  <div class="card-body">
                    <table class="table table-sm">
                      <tbody>
                        <tr>
                          <th style="width: 40%">Nome</th>
                          <td>{{ certificadoValidado.portador.nome }}</td>
                        </tr>
                        <tr>
                          <th>Documento</th>
                          <td>{{ certificadoValidado.portador.documento }}</td>
                        </tr>
                        <tr>
                          <th>E-mail</th>
                          <td>{{ certificadoValidado.portador.email }}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>
                            <span class="badge bg-success">Aprovado</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-center mt-4">
              <button class="btn btn-outline-primary me-2">
                <i class="ti ti-download me-2"></i>Visualizar certificado
              </button>
              <button class="btn btn-primary">
                <i class="ti ti-printer me-2"></i>Imprimir comprovante
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h5>Dúvidas Frequentes sobre Validação</h5>
        </div>
        <div class="card-body">
          <div class="accordion" id="faqValidacao">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Como encontrar o código do meu certificado?
                </button>
              </h2>
              <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqValidacao">
                <div class="accordion-body">
                  O código do certificado está localizado na parte inferior do documento, geralmente precedido pelo prefixo "CERT-" seguido de 6 números. Exemplo: CERT-123456.
                </div>
              </div>
            </div>
            
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Por quanto tempo os certificados são válidos?
                </button>
              </h2>
              <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqValidacao">
                <div class="accordion-body">
                  Os certificados emitidos pelo Hábeis Centro Educacional têm validade indeterminada. No entanto, alguns órgãos ou instituições podem estabelecer prazos específicos para aceitação em determinados processos seletivos.
                </div>
              </div>
            </div>
            
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  O que fazer se meu certificado não for validado?
                </button>
              </h2>
              <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqValidacao">
                <div class="accordion-body">
                  Se seu certificado não for validado, verifique se o código foi digitado corretamente. Caso persista o problema, entre em contato com nosso suporte através do e-mail suporte@habeiseducacional.com.br ou pelo telefone (11) 1234-5678.
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

interface Portador {
  nome: string
  documento: string
  email: string
}

interface CertificadoValidado {
  codigo: string
  nome: string
  area: string
  duracao: number
  nivel: string
  dataEmissao: string
  validade: string
  portador: Portador
}

export default defineComponent({
  name: 'ValidarView',
  data() {
    return {
      codigoCertificado: '',
      isLoading: false,
      mensagemErro: '',
      certificadoValidado: null as CertificadoValidado | null,
    }
  },
  methods: {
    async validarCertificado() {
      if (!this.codigoCertificado) {
        this.mensagemErro = 'Por favor, digite o código do certificado.'
        return
      }
      
      this.isLoading = true
      this.mensagemErro = ''
      this.certificadoValidado = null
      
      try {
        // Usando a API real para validar certificado
        const certificado = await apiService.validarCertificado(this.codigoCertificado)
        
        if (certificado) {
          this.certificadoValidado = {
            codigo: certificado.Codigo_Validacao,
            nome: certificado.CursoTitulo,
            area: 'Desenvolvimento Web', // Campo não disponível na API ainda
            duracao: 40, // Valor padrão - deve vir do curso
            nivel: 'Intermediário', // Campo não disponível na API ainda
            dataEmissao: new Date(certificado.Data_Emissao).toLocaleDateString('pt-BR'),
            validade: 'Indeterminada',
            portador: {
              nome: certificado.AlunoNome,
              documento: 'Não informado', // Campo não disponível na API ainda
              email: 'Não informado', // Campo não disponível na API ainda
            },
          }
        }
      } catch (error: any) {
        console.error('Erro ao validar certificado:', error)
        if (error.response?.status === 404) {
          this.mensagemErro = 'Certificado não encontrado. Verifique o código e tente novamente.'
        } else {
          this.mensagemErro = 'Erro ao validar certificado. Tente novamente.'
        }
      } finally {
        this.isLoading = false
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
  },
})
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}
</style> 