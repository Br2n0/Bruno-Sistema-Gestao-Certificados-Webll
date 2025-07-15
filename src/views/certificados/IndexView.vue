<template>
  <div class="certificados-container">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando certificados...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="page-header mb-4">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="h3 mb-0 text-gray-800">Meus Certificados</h1>
            <p class="text-dark fs-6 mb-0">Visualize e gerencie seus certificados obtidos</p>
          </div>
          <div class="col-auto">
            <router-link to="/cursos" class="btn btn-primary">
              <i class="ti ti-plus me-2"></i>Explorar Cursos
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-container mb-4">
        <div class="stat-item">
          <div class="stat-icon bg-success">
            <i class="ti ti-certificate"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ certificados.length }}</span>
            <span class="stat-label">Certificados</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-primary">
            <i class="ti ti-clock"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ totalHoras }}</span>
            <span class="stat-label">Horas Certificadas</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon bg-info">
            <i class="ti ti-calendar"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ totalCursos }}</span>
            <span class="stat-label">Cursos Concluídos</span>
          </div>
        </div>
      </div>

      <!-- Certificados Grid -->
      <div v-if="certificados.length > 0" class="certificados-grid">
        <div v-for="certificado in certificados" :key="certificado.id" class="certificado-card">
          <div class="card h-100">
            <div class="card-header bg-gradient-primary text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                  <i class="ti ti-certificate me-2"></i>
                  Certificado
                </h6>
                <span class="badge bg-light text-dark">{{ certificado.codigo }}</span>
              </div>
            </div>
            
            <div class="card-body">
              <h5 class="card-title mb-3">{{ certificado.titulo }}</h5>
              
              <div class="certificado-info mb-3">
                <div class="info-row">
                  <i class="ti ti-calendar text-primary me-2"></i>
                  <span>Emitido em {{ formatarData(certificado.dataEmissao) }}</span>
                </div>
                <div class="info-row">
                  <i class="ti ti-clock text-primary me-2"></i>
                  <span>40 horas</span> <!-- Valor fixo por agora -->
                </div>
                <div class="info-row">
                  <i class="ti ti-shield-check text-primary me-2"></i>
                  <span>Código: {{ certificado.codigo }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer bg-transparent">
              <div class="d-flex gap-2">
                <router-link 
                  :to="`/certificados/${certificado.id}`"
                  class="btn btn-outline-primary flex-fill"
                >
                  <i class="ti ti-eye me-1"></i>
                  Visualizar
                </router-link>
                <button 
                  class="btn btn-primary flex-fill"
                  @click="baixarCertificado(certificado)"
                >
                  <i class="ti ti-download me-1"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state text-center py-5">
        <i class="ti ti-certificate-off display-1 text-muted mb-3"></i>
        <h3 class="text-muted">Nenhum certificado ainda</h3>
        <p class="text-muted mb-4">Complete cursos para obter seus certificados.</p>
        <router-link to="/cursos" class="btn btn-primary">
          <i class="ti ti-book me-2"></i>Explorar Cursos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import apiService from '@/services/apiService'
import type { CertificadoDTO } from '@/services/apiService'

// Estados reativos
const certificados = ref<Array<{
  id: number
  titulo: string
  codigo: string
  dataEmissao: string
}>>([])

const loading = ref(false)
const error = ref('')

// Composables
const { isAuthenticated, currentUser } = useAuth()

// Computed properties
const totalHoras = computed(() => {
  return certificados.value.length * 40 // 40 horas por certificado (valor fixo)
})

const totalCursos = computed(() => certificados.value.length)

// Métodos
const formatarData = (dataISO: string): string => {
  try {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}

const baixarCertificado = (certificado: any) => {
  // Simular download do certificado
  alert(`Download do certificado: ${certificado.titulo}`)
}

// Buscar certificados do usuário
const buscarCertificados = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (!currentUser.value?.id) {
      error.value = 'Usuário não autenticado'
      return
    }

    // Buscar todos os certificados e filtrar pelo usuário atual
    const todosCertificados = await apiService.getCertificados()
    const certificadosDoUsuario = todosCertificados.filter(c => c.Aluno_ID === currentUser.value!.id)
    
    certificados.value = certificadosDoUsuario.map(cert => ({
      id: cert.ID,
      titulo: cert.CursoTitulo,
      codigo: cert.Codigo_Validacao,
      dataEmissao: cert.Data_Emissao
    }))
    
  } catch (err: any) {
    console.error('Erro ao carregar certificados:', err)
    error.value = 'Erro ao carregar certificados. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Inicializar
onMounted(() => {
  if (!isAuthenticated.value) {
    error.value = 'Você precisa estar logado para ver seus certificados'
    return
  }
  
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
  margin-bottom: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.certificados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.certificado-card {
  transition: transform 0.2s ease;
}

.certificado-card:hover {
  transform: translateY(-4px);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.certificado-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.empty-state {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .certificados-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
