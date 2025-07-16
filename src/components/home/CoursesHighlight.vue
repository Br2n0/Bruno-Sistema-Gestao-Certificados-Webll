<template>
  <section class="cursos-section">
    <div class="section-header">
      <h2>{{ sectionTitle }}</h2>
      <router-link to="/cursos" class="btn btn-outline-primary">
        Ver Todos
        <i class="ti ti-arrow-right ms-2"></i>
      </router-link>
    </div>
    
    <div class="row">
      <div 
        v-for="curso in cursos" 
        :key="curso.id" 
        class="col-md-4 mb-4"
      >
        <div class="card h-100 border-0 shadow-sm curso-card">
          <div class="position-relative">
            <div :class="`curso-header ${curso.headerColor} d-flex align-items-center justify-content-center`">
              <i :class="`ti ${curso.icon} text-white fs-1`"></i>
            </div>
            <div class="position-absolute top-0 end-0 p-2">
              <span class="badge bg-light text-dark fs-6 fw-bold">
                {{ curso.duracao }} horas
              </span>
            </div>
          </div>
          
          <div class="card-body d-flex flex-column">
                          <h5 class="card-title fw-bold mb-3">{{ curso.titulo }}</h5>
            <p class="card-text text-muted mb-4">
              {{ curso.descricao }}
            </p>
            
            <router-link 
              :to="`/cursos/${curso.id}/estudo`" 
              class="btn btn-primary w-100 mt-auto"
            >
              {{ buttonText }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  cursos: any[]
  sectionTitle: string
  buttonText: string
}

defineProps<Props>()

const getAreaLabel = (area: string) => {
  switch (area) {
    case 'tecnologia': return 'Tecnologia'
    case 'administrativa': return 'Administrativo'
    case 'juridica': return 'Jurídico'
    default: return area
  }
}
</script>

<style scoped>
/* Seção de Cursos */
.cursos-section {
  margin-bottom: 4rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
  background: #fcfcfc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-outline-primary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline-primary:hover {
  background: #667eea;
  color: white;
  text-decoration: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  text-decoration: none;
  color: white;
}

.ms-2 {
  margin-left: 0.5rem;
}

/* Cards de curso - usando o mesmo estilo da página de cursos */
.curso-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.curso-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.curso-header {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-primary {
  background: #667eea;
}

.bg-warning {
  background: #ed8936;
}

.bg-info {
  background: #0bc5ea;
}

.bg-success {
  background: #48bb78;
}

.bg-danger {
  background: #f56565;
}

.bg-dark {
  background: #2d3748;
}

.badge {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 768px) {
  .cursos-section {
    padding: 0 15px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style> 