<template>
  <section class="dashboard-section">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Olá, {{ userName }}! 👋</h1>
      <p class="dashboard-subtitle">Continue sua jornada de aprendizado</p>
    </div>

    <!-- Stats do Usuário -->
    <div class="user-stats">
      <div class="stat-card">
        <div class="stat-icon bg-primary">
          <i class="ti ti-book"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ cursosEmAndamento.length }}</span>
          <span class="stat-title">Em Andamento</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-success">
          <i class="ti ti-certificate"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ certificadosObtidos.length }}</span>
          <span class="stat-title">Certificados</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-warning">
          <i class="ti ti-clock"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ horasTotaisEstudadas }}</span>
          <span class="stat-title">Horas Estudadas</span>
        </div>
      </div>
    </div>

    <!-- Curso em Andamento -->
    <div v-if="ultimoCursoEmAndamento" class="curso-destaque">
      <div class="curso-destaque-header">
        <h3>Continue de onde parou</h3>
      </div>
      <div class="curso-destaque-content">
        <div class="curso-info">
          <h4>{{ ultimoCursoEmAndamento.nome }}</h4>
          <p class="text-muted">{{ ultimoCursoEmAndamento.instrutor }}</p>
          <div class="progress-container">
            <div class="progress">
              <div 
                class="progress-bar" 
                :style="`width: ${ultimoCursoEmAndamento.progresso}%`"
              ></div>
            </div>
            <span class="progress-text">{{ ultimoCursoEmAndamento.progresso }}% concluído</span>
          </div>
        </div>
        <div class="curso-action">
          <router-link 
            :to="`/cursos/${ultimoCursoEmAndamento.cursoId}/estudo`" 
            class="btn btn-primary"
          >
            Continuar
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  userName: string
  cursosEmAndamento: any[]
  certificadosObtidos: any[]
  horasTotaisEstudadas: number
  ultimoCursoEmAndamento: any
}

defineProps<Props>()
</script>

<style scoped>
@import '../../assets/css/home/dashboard.css';
</style> 