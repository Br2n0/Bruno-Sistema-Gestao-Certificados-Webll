<template>
  <div class="meus-cursos-container">
    <!-- Header da página -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <p class="text-dark fs-6 mb-0">Acompanhe seu progresso e gerencie seus estudos</p>
        </div>
        <div class="col-auto">
          <router-link to="/cursos" class="btn btn-outline-primary">
            <i class="ti ti-plus me-2"></i>
            Explorar Cursos
          </router-link>
        </div>
      </div>
    </div>

    <!-- Estados de carregamento e erro -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Carregando seus cursos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="ti ti-alert-circle me-2"></i>{{ error }}
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <!-- Stats do Usuário -->
      <div class="user-stats mb-4">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="ti ti-trophy"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ cursosFinalizados.length }}</span>
            <span class="stat-title">Cursos Concluídos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="ti ti-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ cursosEmAndamento.length }}</span>
            <span class="stat-title">Em Andamento</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-warning">
            <i class="ti ti-clock-hour-4"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ horasTotaisEstudadas }}</span>
            <span class="stat-title">Horas Estudadas</span>
          </div>
        </div>
      </div>

      <!-- Cursos em Andamento -->
      <div v-if="cursosEmAndamento.length > 0" class="mb-5">
        <div class="d-flex align-items-center mb-3">
          <h3 class="h5 mb-0">
            <i class="ti ti-play-circle text-primary me-2"></i>
            Cursos em Andamento
          </h3>
          <span class="badge bg-primary ms-2">{{ cursosEmAndamento.length }}</span>
        </div>

        <div class="row">
          <div 
            v-for="curso in cursosEmAndamento" 
            :key="curso.id"
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card border-0 shadow-sm h-100 curso-card">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <h5 class="card-title mb-2">{{ curso.titulo }}</h5>
                  <p class="text-muted small mb-2">{{ curso.instrutor }}</p>
                  <span class="badge bg-light text-dark">{{ curso.duracao }}h</span>
                </div>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="text-muted">Progresso</small>
                    <small class="text-primary fw-medium">{{ curso.progresso }}%</small>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div 
                      class="progress-bar bg-primary" 
                      :style="{ width: curso.progresso + '%' }"
                    ></div>
                  </div>
                </div>

                <div class="mt-auto">
                  <router-link 
                    :to="`/curso/${curso.id}`"
                    class="btn btn-primary w-100"
                  >
                    <i class="ti ti-play me-2"></i>
                    Continuar Estudos
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cursos Finalizados -->
      <div v-if="cursosFinalizados.length > 0" class="mb-5">
        <div class="d-flex align-items-center mb-3">
          <h3 class="h5 mb-0">
            <i class="ti ti-check-circle text-success me-2"></i>
            Cursos Concluídos
          </h3>
          <span class="badge bg-success ms-2">{{ cursosFinalizados.length }}</span>
        </div>

        <div class="row">
          <div 
            v-for="curso in cursosFinalizados" 
            :key="curso.id"
            class="col-md-6 col-lg-4 mb-4"
          >
            <div class="card border-0 shadow-sm h-100 curso-card curso-concluido">
              <div class="card-body d-flex flex-column">
                <div class="mb-3">
                  <div class="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 class="card-title mb-2">{{ curso.titulo }}</h5>
                      <p class="text-muted small mb-2">{{ curso.instrutor }}</p>
                      <span class="badge bg-light text-dark">{{ curso.duracao }}h</span>
                    </div>
                    <i class="ti ti-trophy text-success fs-4"></i>
                  </div>
                </div>
                
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="text-success fw-medium">Concluído</small>
                    <small class="text-success fw-bold">100%</small>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-success" style="width: 100%"></div>
                  </div>
                </div>

                <div class="mb-2">
                  <small class="text-muted">
                    <i class="ti ti-calendar me-1"></i>
                    Concluído em {{ formatarData(curso.dataConclusao) }}
                  </small>
                </div>

                <div class="mt-auto d-grid gap-2">
                  <router-link 
                    :to="`/curso/${curso.id}`"
                    class="btn btn-outline-primary"
                  >
                    <i class="ti ti-eye me-2"></i>
                    Revisar Conteúdo
                  </router-link>
                  <router-link 
                    to="/certificados"
                    class="btn btn-success"
                  >
                    <i class="ti ti-certificate me-2"></i>
                    Ver Certificado
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-if="cursosEmAndamento.length === 0 && cursosFinalizados.length === 0" class="text-center py-5">
        <div class="mb-4">
          <i class="ti ti-book-off display-4 text-muted"></i>
        </div>
        <h4 class="h5 mb-3">Você ainda não se matriculou em nenhum curso</h4>
        <p class="text-muted mb-4">
          Explore nossa biblioteca de cursos e comece sua jornada de aprendizado hoje mesmo!
        </p>
        <router-link to="/cursos" class="btn btn-primary">
          <i class="ti ti-search me-2"></i>
          Explorar Cursos Disponíveis
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'

const { currentUser } = useAuth()
const { 
  cursosEmAndamento, 
  certificadosObtidos, 
  cursosFinalizados, 
  loading,
  horasTotaisEstudadas,
  carregarDadosUsuario,
  getAreaLabel,
  formatarData 
} = useUserData()

// Estados locais
const error = ref('')

// Funções removidas - agora vêm do composable

// Funções removidas - agora vêm do composable

// Inicializar
onMounted(() => {
  carregarDadosUsuario()
})
</script>

<style scoped>
.meus-cursos-container {
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

.curso-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.curso-concluido {
  background: white;
  border-left: 4px solid #28a745;
}

.progress {
  border-radius: 10px;
  background-color: #f8f9fa;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.6s ease;
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

/* Responsividade */
@media (max-width: 768px) {
  .meus-cursos-container {
    padding: 15px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .page-header .row {
    text-align: center;
  }
  
  .page-header .col-auto {
    margin-top: 15px;
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

.curso-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Stats do Usuário */
.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
  color: #2d3748;
}

.stat-title {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

@media (max-width: 768px) {
  .user-stats {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style> 