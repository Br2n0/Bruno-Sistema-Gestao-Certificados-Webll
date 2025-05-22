<template>
<header class="pc-header">
  <div class="header-wrapper"> 
    <!-- [Mobile Media Block] start -->
    <div class="me-auto pc-mob-drp">
      <ul class="list-unstyled">
        <!-- ======= Menu collapse Icon ===== -->
        <li class="pc-h-item pc-sidebar-collapse">
          <a href="#" class="pc-head-link ms-0" id="sidebar-hide">
            <i class="ti ti-menu-2"></i>
          </a>
        </li>
        <li class="pc-h-item pc-sidebar-popup">
          <a href="#" class="pc-head-link ms-0" id="mobile-collapse">
            <i class="ti ti-menu-2"></i>
          </a>
        </li>
        <li class="dropdown pc-h-item d-inline-flex d-md-none">
          <a
            class="pc-head-link dropdown-toggle arrow-none m-0"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="false"
            aria-expanded="false"
          >
            <i class="ti ti-search"></i>
          </a>
          <div class="dropdown-menu pc-h-dropdown drp-search">
            <form class="px-3" @submit.prevent="realizarBusca">
              <div class="form-group mb-0 d-flex align-items-center">
                <i class="ti ti-search"></i>
                <input 
                  type="search" 
                  class="form-control border-0 shadow-none" 
                  placeholder="Buscar cursos..." 
                  v-model="termoBusca"
                >
              </div>
            </form>
          </div>
        </li>
      </ul>
    </div>
    <!-- [Mobile Media Block end] -->
    
    <!-- [Desktop Search] -->
    <div class="d-none d-md-flex align-items-center justify-content-center" style="width: 50%;">
      <form class="header-search w-100" @submit.prevent="realizarBusca">
        <div class="input-group">
          <input 
            type="search" 
            class="form-control" 
            placeholder="Buscar cursos, certificados ou áreas..." 
            v-model="termoBusca"
          >
          <button class="btn btn-primary" type="submit">
            <i class="ti ti-search"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- [Right Side Menu] -->
    <div class="ms-auto">
      <ul class="list-unstyled">
        <!-- Notificações -->
        <li class="dropdown pc-h-item">
          <a
            class="pc-head-link dropdown-toggle arrow-none me-0"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="false"
            aria-expanded="false"
          >
            <i class="ti ti-bell"></i>
            <span class="badge bg-danger pc-h-badge">3</span>
          </a>
          <div class="dropdown-menu dropdown-notification dropdown-menu-end pc-h-dropdown">
            <div class="dropdown-header d-flex align-items-center justify-content-between">
              <h5 class="m-0">Notificações</h5>
              <a href="#!" class="pc-head-link bg-transparent"><i class="ti ti-x text-danger"></i></a>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-header px-0 text-wrap header-notification-scroll position-relative" style="max-height: calc(100vh - 215px)">
              <div class="list-group list-group-flush w-100">
                <a class="list-group-item list-group-item-action">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <i class="ti ti-certificate bg-light text-primary p-2 rounded"></i>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <span class="float-end text-muted">Agora</span>
                      <p class="text-body mb-1">Seu certificado foi emitido!</p>
                      <span class="text-muted">Curso de HTML5 e CSS3</span>
                    </div>
                  </div>
                </a>
                <a class="list-group-item list-group-item-action">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <i class="ti ti-clock bg-light text-warning p-2 rounded"></i>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <span class="float-end text-muted">2 horas atrás</span>
                      <p class="text-body mb-1">Lembrete de curso agendado</p>
                      <span class="text-muted">JavaScript Avançado</span>
                    </div>
                  </div>
                </a>
                <a class="list-group-item list-group-item-action">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <i class="ti ti-message-circle bg-light text-success p-2 rounded"></i>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <span class="float-end text-muted">Ontem</span>
                      <p class="text-body mb-1">Novo comentário em seu certificado</p>
                      <span class="text-muted">Administrador</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="text-center py-2">
              <a href="#!" class="link-primary">Ver todas as notificações</a>
            </div>
          </div>
        </li>
        
        <!-- Perfil do Usuário -->
        <li class="dropdown pc-h-item header-user-profile">
          <a
            class="pc-head-link dropdown-toggle arrow-none me-0"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="false"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            <img src="../assets/imagens/logotipo.png" alt="user-image" class="user-avtar" style="object-fit: cover;">
            <span>Minha Conta</span>
          </a>
          <div class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
            <div class="dropdown-header">
              <div class="d-flex mb-1">
                <div class="flex-shrink-0">
                  <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                    <span>{{ getUserInitials() }}</span>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="mb-1">{{ userName }}</h6>
                  <span>{{ userEmail }}</span>
                </div>
                <a href="#!" class="pc-head-link bg-transparent" @click="logout"><i class="ti ti-power text-danger"></i></a>
              </div>
            </div>
            <ul class="nav drp-tabs nav-fill nav-tabs" id="mydrpTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="drp-t1"
                  data-bs-toggle="tab"
                  data-bs-target="#drp-tab-1"
                  type="button"
                  role="tab"
                  aria-controls="drp-tab-1"
                  aria-selected="true"
                ><i class="ti ti-user"></i> Perfil</button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="drp-t2"
                  data-bs-toggle="tab"
                  data-bs-target="#drp-tab-2"
                  type="button"
                  role="tab"
                  aria-controls="drp-tab-2"
                  aria-selected="false"
                ><i class="ti ti-settings"></i> Configurações</button>
              </li>
            </ul>
            <div class="tab-content" id="mysrpTabContent">
              <div class="tab-pane fade show active" id="drp-tab-1" role="tabpanel" aria-labelledby="drp-t1" tabindex="0">
                <router-link to="/perfil/editar" class="dropdown-item">
                  <i class="ti ti-edit-circle"></i>
                  <span>Editar Perfil</span>
                </router-link>
                <router-link to="/perfil" class="dropdown-item">
                  <i class="ti ti-user"></i>
                  <span>Meu Perfil</span>
                </router-link>
                <router-link to="/certificados" class="dropdown-item">
                  <i class="ti ti-certificate"></i>
                  <span>Meus Certificados</span>
                </router-link>
                <router-link to="/cursos/meus-cursos" class="dropdown-item">
                  <i class="ti ti-book"></i>
                  <span>Meus Cursos</span>
                </router-link>
                <a href="#!" class="dropdown-item" @click="logout">
                  <i class="ti ti-power"></i>
                  <span>Sair</span>
                </a>
              </div>
              <div class="tab-pane fade" id="drp-tab-2" role="tabpanel" aria-labelledby="drp-t2" tabindex="0">
                <router-link to="/perfil/configuracoes" class="dropdown-item">
                  <i class="ti ti-settings"></i>
                  <span>Configurações da Conta</span>
                </router-link>
                <router-link to="/perfil/privacidade" class="dropdown-item">
                  <i class="ti ti-lock"></i>
                  <span>Privacidade</span>
                </router-link>
                <router-link to="/notificacoes" class="dropdown-item">
                  <i class="ti ti-bell"></i>
                  <span>Notificações</span>
                </router-link>
                <router-link to="/ajuda" class="dropdown-item">
                  <i class="ti ti-help"></i>
                  <span>Ajuda e Suporte</span>
                </router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const termoBusca = ref('');

// Dados do usuário (simulados por enquanto)
// Em uma aplicação real, esses dados viriam de um estado global ou API
const userName = ref('Usuário Demo');
const userEmail = ref('usuario@exemplo.com');

// Método para realizar a busca
const realizarBusca = () => {
  if (termoBusca.value.trim() !== '') {
    router.push({ 
      path: '/cursos',
      query: { q: termoBusca.value }
    });
    termoBusca.value = '';
  }
};

// Método para obter as iniciais do usuário para o avatar
const getUserInitials = () => {
  if (!userName.value) return 'U';
  return userName.value
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Método de logout
const logout = () => {
  // Aqui implementaríamos a lógica real de logout
  // Por enquanto apenas simularemos redirecionando para a home
  router.push('/');
};
</script>

<style scoped>
.header-search {
  position: relative;
}

.header-search .form-control {
  padding-left: 2.5rem;
  border-radius: 50px;
  background-color: #f8f9fa; 
}

.header-search .btn {
  border-radius: 0 50px 50px 0;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}

.user-avtar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  font-weight: bold;
}
</style>