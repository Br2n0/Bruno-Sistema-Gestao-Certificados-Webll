<template>
<header class="pc-header" :class="{ 'sidebar-collapsed': isCollapsed && !isMobile }">
  <div class="header-wrapper"> 
    <!-- [Mobile Media Block] start -->
    <div class="me-auto pc-mob-drp">
      <ul class="list-unstyled">
        <!-- ======= Menu collapse Icon ===== -->
        <li class="pc-h-item pc-sidebar-collapse">
          <a href="#" class="pc-head-link ms-0" @click.prevent="toggleSidebar">
            <i class="ti ti-menu-2"></i>
          </a>
        </li>
        <li class="pc-h-item pc-sidebar-popup">
          <a href="#" class="pc-head-link ms-0" @click.prevent="toggleSidebar">
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
        <!-- Quando usuário NÃO está logado - mostrar apenas Entrar -->
        <template v-if="!isAuthenticated">
          <li class="pc-h-item d-flex align-items-center">
            <div class="auth-buttons-container">
              <router-link 
                to="/login" 
                class="btn-entrar-azul"
              >
                <i class="ti ti-login me-2"></i>
                Entrar
              </router-link>
            </div>
          </li>
        </template>

        <!-- Quando usuário ESTÁ logado - mostrar Notificações/Minha Conta -->
        <template v-else>
          <!-- Notificações -->
          <li class="dropdown pc-h-item">
            <a
              class="pc-head-link dropdown-toggle arrow-none me-0"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i class="ti ti-bell"></i>
            </a>
          </li>
          
          <!-- Perfil do Usuário -->
          <li class="dropdown pc-h-item header-user-profile" ref="dropdownRef">
            <a
              class="pc-head-link dropdown-toggle arrow-none me-0"
              href="#"
              role="button"
              aria-haspopup="false"
              :aria-expanded="isDropdownOpen"
              @click.prevent="toggleDropdown"
            >
              <div class="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                <span>{{ getUserInitials().charAt(0) }}</span>
              </div>
              <span>Minha Conta</span>
            </a>
            <div 
              class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown" 
              :class="{ 'show': isDropdownOpen }"
            >
              <div class="dropdown-header">
                <div class="d-flex mb-1">
                  <div class="flex-shrink-0">
                    <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                      <span>{{ getUserInitials().charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1">{{ currentUser?.nome || 'Usuário' }}</h6>
                    <span>{{ currentUser?.email || 'email@exemplo.com' }}</span>
                  </div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/configuracoes" class="dropdown-item" @click="closeDropdown">
                <i class="ti ti-settings"></i>
                <span>Configurações</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <a href="#!" class="dropdown-item text-danger" @click="logout">
                <i class="ti ti-power"></i>
                <span>Sair da conta</span>
              </a>
              <div class="dropdown-divider"></div>
              <small class="dropdown-item-text text-muted">
                <i class="ti ti-info-circle me-1"></i>
                Faça logout para ver os botões de login
              </small>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useSidebar } from '@/composables/useSidebar';

const router = useRouter();
const termoBusca = ref('');

// Usa o sistema de autenticação
const { currentUser, logout: authLogout, isAuthenticated, isAdmin } = useAuth();

// Usa o sistema de sidebar
const { toggleSidebar, isCollapsed, isMobile } = useSidebar();

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
  if (!currentUser.value?.nome) return 'U';
  return currentUser.value.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Método de logout
const logout = () => {
  authLogout();
  router.push('/');
  closeDropdown();
};

// Controle do dropdown
const dropdownRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Adicionar/remover event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
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

.user-avatar {
  width: 30px;
  height: 30px;
  font-weight: bold;
  font-size: 14px;
}

/* === BOTÕES DE AUTENTICAÇÃO MODERNOS === */
.auth-buttons-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-entrar-azul {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-width: 90px;
  white-space: nowrap;
  height: 38px;
  color: #ffffff;
  background: #4f46e5;
  border: 1px solid #4f46e5;
}

.btn-entrar-azul:hover {
  color: #ffffff;
  background: #4338ca;
  border-color: #4338ca;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
  text-decoration: none;
}

.btn-entrar-azul:active {
  transform: translateY(0px);
  box-shadow: 0 1px 4px rgba(79, 70, 229, 0.2);
}

/* Ícones do botão */
.btn-entrar-azul i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.btn-entrar-azul:hover i {
  transform: translateX(-1px);
}

/* Responsividade para mobile */
@media (max-width: 576px) {
  .btn-entrar-azul {
    min-width: 80px;
    padding: 6px 12px;
    font-size: 13px;
    height: 34px;
  }
  
  .btn-entrar-azul i {
    font-size: 13px;
  }
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

/* Controle de visibilidade do dropdown */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 280px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: transparent;
  border: 0;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #1e2125;
}

.dropdown-item.text-danger {
  color: #dc3545 !important;
}

.dropdown-item.text-danger:hover {
  background-color: #f8f9fa;
  color: #dc3545 !important;
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #dee2e6;
}

.dropdown-header {
  display: block;
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  color: #6c757d;
  white-space: nowrap;
}
</style>