<template>
  <div class="certificados-container">
    <!-- Header da página -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <p class="text-dark fs-6 mb-0">Certificados dos cursos que você concluiu</p>
        </div>
        <div class="col-auto">
          <router-link to="/meus-cursos" class="btn btn-outline-primary">
            <i class="ti ti-book me-2"></i>
            Ver Meus Cursos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Estados de carregamento e erro -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando seus certificados...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <!-- Lista de certificados -->
      <div v-if="certificados.length > 0" class="row">
        <div 
          v-for="certificado in certificados" 
          :key="certificado.id"
          class="col-md-6 col-lg-4 mb-4"
        >
          <div class="card border-0 shadow-sm h-100 certificado-card">
            <div class="card-body d-flex flex-column">
              <!-- Ícone e status -->
              <div class="text-center mb-3">
                <div class="certificado-icon mb-2">
                  <i class="ti ti-certificate text-success"></i>
                </div>
                <span class="badge bg-success">Certificado Disponível</span>
              </div>

              <!-- Informações do curso -->
              <div class="mb-3">
                <h5 class="card-title mb-2">{{ certificado.titulo }}</h5>
                <p class="text-muted small mb-2">{{ certificado.instrutor }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-light text-dark">{{ certificado.duracao }}h</span>
                  <small class="text-muted">{{ getAreaLabel(certificado.area) }}</small>
                </div>
              </div>

              <!-- Data de conclusão -->
              <div class="mb-3">
                <small class="text-muted">
                  <i class="ti ti-calendar-check me-1"></i>
                  Concluído em {{ formatarData(certificado.dataConclusao) }}
                </small>
              </div>

              <!-- Ações -->
              <div class="mt-auto d-grid gap-2">
                <button 
                  class="btn btn-primary"
                  @click="visualizarCertificado(certificado)"
                >
                  <i class="ti ti-eye me-2"></i>
                  Visualizar Certificado
                </button>
                <button 
                  class="btn btn-outline-success"
                  @click="baixarCertificado(certificado)"
                >
                  <i class="ti ti-download me-2"></i>
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-else class="text-center py-5">
        <div class="mb-4">
          <i class="ti ti-certificate-off display-4 text-muted"></i>
        </div>
        <h4 class="h5 mb-3">Você ainda não possui certificados</h4>
        <p class="text-muted mb-4">
          Complete cursos para gerar seus certificados automaticamente.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <router-link to="/cursos" class="btn btn-primary">
            <i class="ti ti-search me-2"></i>
            Explorar Cursos
          </router-link>
          <router-link to="/meus-cursos" class="btn btn-outline-primary">
            <i class="ti ti-book me-2"></i>
            Meus Cursos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de visualização do certificado -->
    <div v-if="certificadoSelecionado" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="ti ti-certificate me-2"></i>
              Certificado de Conclusão
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="fecharModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="certificado-preview">
              <!-- Certificado com imagem de fundo e textos sobrepostos -->
              <div class="certificado-container">
                <!-- Imagem de fundo do certificado -->
                <img 
                  :src="certificadoTemplate" 
                  alt="Certificado Template" 
                  class="certificado-background"
                />
                
                <!-- Textos dinâmicos sobrepostos -->
                <div class="certificado-textos">
                  <!-- Nome do Aluno - posicionado onde está [Nome do Aluno] -->
                  <div class="texto-nome-aluno">
                    {{ currentUser?.nome || 'Nome do Aluno' }}
                  </div>
                  
                  <!-- Nome do Curso - posicionado onde está [Nome do Curso] -->
                  <div class="texto-nome-curso">
                    {{ certificadoSelecionado.titulo }}
                  </div>
                </div>
              </div>

              <!-- Informações adicionais -->
              <div class="info-adicional">
                <div class="row text-center mt-4">
                  <div class="col-4">
                    <strong>Instrutor:</strong><br>
                    {{ certificadoSelecionado.instrutor }}
                  </div>
                  <div class="col-4">
                    <strong>Carga Horária:</strong><br>
                    {{ certificadoSelecionado.duracao }} horas
                  </div>
                  <div class="col-4">
                    <strong>Data de Conclusão:</strong><br>
                    {{ formatarData(certificadoSelecionado.dataConclusao) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-outline-secondary" 
              @click="fecharModal"
            >
              Fechar
            </button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="baixarCertificado(certificadoSelecionado)"
            >
              <i class="ti ti-download me-2"></i>
              Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="certificadoSelecionado" class="modal-backdrop show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import certificadoTemplate from '@/assets/images/certificado-template.png'

const { currentUser } = useAuth()

// Estados reativos
const loading = ref(true)
const error = ref('')
const certificados = ref<any[]>([])
const certificadoSelecionado = ref<any>(null)

// Dados dos cursos (mesmo da IndexView)
const getCursosData = () => [
  {
    id: 1,
    nome: 'Desenvolvimento Web com HTML5 e CSS3',
    instrutor: 'Prof. Ana Silva',
    duracao: 40,
    area: 'tecnologia'
  },
  {
    id: 2,
    nome: 'JavaScript Avançado e ES6+',
    instrutor: 'Prof. Carlos Mendes',
    duracao: 60,
    area: 'tecnologia'
  },
  {
    id: 3,
    nome: 'Desenvolvimento Full Stack com Vue.js e Node.js',
    instrutor: 'Prof. Marina Costa',
    duracao: 120,
    area: 'tecnologia'
  },
  {
    id: 4,
    nome: 'Banco de Dados SQL e NoSQL',
    instrutor: 'Prof. Roberto Lima',
    duracao: 80,
    area: 'tecnologia'
  },
  {
    id: 5,
    nome: 'Inteligência Artificial e Machine Learning',
    instrutor: 'Prof. Fernanda Alves',
    duracao: 160,
    area: 'tecnologia'
  },
  {
    id: 6,
    nome: 'DevOps e Integração Contínua',
    instrutor: 'Prof. João Santos',
    duracao: 90,
    area: 'tecnologia'
  },
  {
    id: 7,
    nome: 'Gestão Pública',
    instrutor: 'Prof. Paula Rodrigues',
    duracao: 80,
    area: 'administrativa'
  },
  {
    id: 8,
    nome: 'Administração Financeira',
    instrutor: 'Prof. André Martins',
    duracao: 70,
    area: 'administrativa'
  },
  {
    id: 9,
    nome: 'Recursos Humanos',
    instrutor: 'Prof. Luciana Ferreira',
    duracao: 60,
    area: 'administrativa'
  },
  {
    id: 10,
    nome: 'Direito Constitucional',
    instrutor: 'Prof. Ricardo Oliveira',
    duracao: 100,
    area: 'juridica'
  },
  {
    id: 11,
    nome: 'Direito Administrativo',
    instrutor: 'Prof. Beatriz Souza',
    duracao: 120,
    area: 'juridica'
  },
  {
    id: 12,
    nome: 'Direito Civil',
    instrutor: 'Prof. Gabriel Nascimento',
    duracao: 90,
    area: 'juridica'
  }
]

// Buscar certificados do usuário (apenas cursos finalizados)
const buscarCertificados = async () => {
  try {
    loading.value = true
    
    if (!currentUser.value?.id) {
      error.value = 'Usuário não autenticado'
      return
    }

    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 500))

    // Buscar todas as matrículas finalizadas do localStorage
    const certificadosEncontrados: any[] = []
    
    // Percorrer todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`matricula_`) && key.endsWith(`_${currentUser.value.id}`)) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const matricula = JSON.parse(data)
            
            // Apenas matrículas com certificado gerado (100% concluídas)
            if (matricula.progresso === 100 && matricula.certificadoGerado) {
              const cursoData = getCursosData().find(c => c.id === matricula.cursoId)
              
              if (cursoData) {
                certificadosEncontrados.push({
                  id: matricula.cursoId,
                  titulo: cursoData.nome,
                  instrutor: cursoData.instrutor,
                  duracao: cursoData.duracao,
                  area: cursoData.area,
                  dataConclusao: matricula.dataConclusao || new Date().toISOString(),
                  dataInicio: matricula.dataInicio
                })
              }
            }
          }
        } catch (err) {
          console.error('Erro ao parsear matrícula:', err)
        }
      }
    }

    certificados.value = certificadosEncontrados
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar certificados'
  } finally {
    loading.value = false
  }
}

// Funções auxiliares
const getAreaLabel = (area: string) => {
  switch (area) {
    case 'tecnologia': return 'Tecnologia'
    case 'administrativa': return 'Administrativo'
    case 'juridica': return 'Jurídico'
    default: return area
  }
}

const formatarData = (dataISO: string) => {
  try {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}

const visualizarCertificado = (certificado: any) => {
  certificadoSelecionado.value = certificado
}

const fecharModal = () => {
  certificadoSelecionado.value = null
}

const baixarCertificado = (certificado: any) => {
  // Simular download do certificado
  alert(`Download do certificado: ${certificado.titulo}`)
  // Aqui seria implementada a geração real do PDF
}



// Inicializar
onMounted(() => {
  buscarCertificados()
})
</script>

<style scoped>
.certificados-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Grid horizontal removido - usando Bootstrap row/col */

.certificado-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.certificado-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.certificado-icon {
  font-size: 3rem;
}

.card-title {
  font-weight: 600;
  color: #2d3748;
  line-height: 1.3;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Modal do certificado */
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.certificado-preview {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.certificado-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.certificado-background {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}

.certificado-textos {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Nome do Aluno - posicionado onde está [Nome do Aluno] na imagem */
.texto-nome-aluno {
  position: absolute;
  top: 44%; /* Ajustado para ficar na linha do exemplo azul */
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c5aa0;
  text-align: center;
  white-space: nowrap;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Nome do Curso - posicionado onde está [Nome do Curso] na imagem */
.texto-nome-curso {
  position: absolute;
  top: 58%; /* Ajustado para ficar na linha do exemplo verde */
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #28a745;
  text-align: center;
  font-style: italic;
  max-width: 80%;
  line-height: 1.2;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Informações adicionais */
.info-adicional {
  border-top: 2px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #6c757d;
}

/* Responsividade */
@media (max-width: 768px) {
  .certificados-container {
    padding: 15px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  /* Cards já responsivos com Bootstrap */
  
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .certificado-preview {
    padding: 0.5rem;
  }

  .certificado-container {
    padding: 0.5rem;
  }
  
  .certificado-background {
    width: 100%;
    height: auto;
  }

  /* Ajustar tamanhos dos textos em mobile */
  .texto-nome-aluno {
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    max-width: 90%;
  }
  
  .texto-nome-curso {
    font-size: 1.1rem;
    max-width: 85%;
    line-height: 1.1;
  }
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.certificado-card {
  animation: fadeInUp 0.5s ease-out;
}
</style>
