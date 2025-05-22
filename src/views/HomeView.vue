<template>
  <div class="row">
    <!-- Banner principal -->
    <div class="col-sm-12 mb-4">
      <div class="card bg-primary text-white">
        <div class="card-body py-5">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="display-5 fw-bold">Hábeis Centro Educacional</h1>
              <p class="lead">Certificados de qualidade para impulsionar sua carreira em concursos públicos</p>
              <p class="mb-4">Oferecemos cursos preparatórios com certificados válidos em diversas áreas para concurseiros.</p>
              <router-link to="/cursos" class="btn btn-light">Conheça nossos cursos</router-link>
            </div>
            <div class="col-md-4 text-center">
              <img src="../assets/imagens/logotipo.png" alt="Habeis Educacional" class="img-fluid" style="max-height: 180px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sobre Nós -->
    <div class="col-sm-12 mb-4">
      <div class="card">
        <div class="card-header">
          <h5>Sobre o Hábeis Centro Educacional</h5>
        </div>
        <div class="card-body">
          <p>O Hábeis Centro Educacional é uma instituição especializada em oferecer certificados de cursos preparatórios de alta qualidade para concurseiros e profissionais que buscam aprimoramento.</p>
          <p>Nossa missão é fornecer uma plataforma online acessível e conveniente para candidatos que precisam de certificados válidos para inscrição em concursos públicos nas áreas administrativa, jurídica, saúde, educação, entre outras.</p>
          <p>Todos os nossos cursos são desenvolvidos por profissionais especializados e emitimos certificados reconhecidos, em conformidade com as regulamentações pertinentes.</p>
        </div>
      </div>
    </div>

    <!-- Áreas de Atuação -->
    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <div class="card-header">
          <h5>Áreas Administrativas</h5>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Gestão Pública</li>
            <li class="list-group-item">Administração Financeira</li>
            <li class="list-group-item">Recursos Humanos</li>
            <li class="list-group-item">Licitações e Contratos</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <div class="card-header">
          <h5>Áreas Jurídicas</h5>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Direito Constitucional</li>
            <li class="list-group-item">Direito Administrativo</li>
            <li class="list-group-item">Direito Civil</li>
            <li class="list-group-item">Direito Penal</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <div class="card-header">
          <h5>Áreas Tecnológicas</h5>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Desenvolvimento Web</li>
            <li class="list-group-item">Banco de Dados</li>
            <li class="list-group-item">Ciência de Dados</li>
            <li class="list-group-item">Segurança da Informação</li>
            <li class="list-group-item">Desenvolvimento Mobile</li>
            <li class="list-group-item">Infraestrutura</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Cursos em Destaque -->
    <div class="col-sm-12 mb-4">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="m-0">Cursos em Destaque</h5>
          <router-link to="/cursos" class="btn btn-sm btn-primary">Ver todos os cursos</router-link>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                  <div class="d-flex justify-content-between align-items-center">
                    <h6 class="m-0">Desenvolvimento Web com HTML5 e CSS3</h6>
                    <span class="badge bg-success">40 horas</span>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">Aprenda os fundamentos do desenvolvimento web moderno com HTML5 e CSS3.</p>
                  <div class="d-flex justify-content-between">
                    <span class="badge bg-success">Básico</span>
                    <span class="badge bg-success">Disponível</span>
                  </div>
                </div>
                <div class="card-footer bg-white border-0">
                  <button class="btn btn-primary w-100">Acessar Curso</button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                  <div class="d-flex justify-content-between align-items-center">
                    <h6 class="m-0">Inteligência Artificial e Machine Learning</h6>
                    <span class="badge bg-success">160 horas</span>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">Aprenda conceitos avançados de IA e Machine Learning para análise de dados.</p>
                  <div class="d-flex justify-content-between">
                    <span class="badge bg-danger">Avançado</span>
                    <span class="badge bg-warning">Em breve</span>
                  </div>
                </div>
                <div class="card-footer bg-white border-0">
                  <button class="btn btn-secondary w-100">Lista de Espera</button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header bg-primary text-white">
                  <div class="d-flex justify-content-between align-items-center">
                    <h6 class="m-0">Segurança da Informação e Pentest</h6>
                    <span class="badge bg-success">120 horas</span>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text">Aprenda técnicas avançadas de segurança da informação e testes de penetração.</p>
                  <div class="d-flex justify-content-between">
                    <span class="badge bg-danger">Avançado</span>
                    <span class="badge bg-warning">Em breve</span>
                  </div>
                </div>
                <div class="card-footer bg-white border-0">
                  <button class="btn btn-secondary w-100">Lista de Espera</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefícios -->
    <div class="col-sm-12 mb-4">
      <div class="card">
        <div class="card-header">
          <h5>Por que escolher nossos certificados?</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 text-center mb-3">
              <div class="rounded-circle bg-light p-3 d-inline-block mb-3">
                <i class="ti ti-certificate fs-3 text-primary"></i>
              </div>
              <h6>Certificados Válidos</h6>
              <p class="small">Documentos reconhecidos em concursos públicos</p>
            </div>
            <div class="col-md-3 text-center mb-3">
              <div class="rounded-circle bg-light p-3 d-inline-block mb-3">
                <i class="ti ti-device-laptop fs-3 text-primary"></i>
              </div>
              <h6>100% Online</h6>
              <p class="small">Estude quando e onde quiser</p>
            </div>
            <div class="col-md-3 text-center mb-3">
              <div class="rounded-circle bg-light p-3 d-inline-block mb-3">
                <i class="ti ti-download fs-3 text-primary"></i>
              </div>
              <h6>Download Imediato</h6>
              <p class="small">Receba seu certificado após conclusão</p>
            </div>
            <div class="col-md-3 text-center mb-3">
              <div class="rounded-circle bg-light p-3 d-inline-block mb-3">
                <i class="ti ti-shield-check fs-3 text-primary"></i>
              </div>
              <h6>Validação Online</h6>
              <p class="small">Certificados com código de autenticidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="col-sm-12 mb-4">
      <div class="card bg-success text-white">
        <div class="card-body text-center py-4">
          <h2>Pronto para impulsionar sua carreira?</h2>
          <p class="lead">Cadastre-se agora e explore nossos cursos com certificados reconhecidos.</p>
          <button class="btn btn-light btn-lg mt-3">Cadastre-se Gratuitamente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// HomeView.vue
</script>

<style scoped>
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
