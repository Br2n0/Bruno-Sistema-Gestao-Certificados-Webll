<template>
  <header class="modern-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="brand-section">
        <router-link to="/" class="brand-link">
          <img 
            src="../assets/imagens/logotipoazul.png" 
            alt="Hábeis Educacional" 
            class="brand-logo"
          />
        </router-link>
      </div>

      <!-- Barra de Pesquisa Compacta -->
      <div class="search-section">
        <form @submit.prevent="realizarBusca" class="search-form">
          <div class="search-input-group">
            <i class="ti ti-search search-icon"></i>
            <input 
              type="search" 
              class="search-input" 
              placeholder="Pesquisar..."
              v-model="termoBusca"
            />
          </div>
        </form>
      </div>

      <!-- Menu Horizontal + Botões -->
      <div class="nav-section">
        <nav class="horizontal-nav">
          <!-- Link Início -->
          <router-link to="/" class="nav-item" @click="realizarBusca">
            <i class="ti ti-home nav-icon"></i>
            <span class="nav-text">Início</span>
          </router-link>

          <!-- Link Cursos -->
          <router-link to="/cursos" class="nav-item">
            <i class="ti ti-book nav-icon"></i>
            <span class="nav-text">Cursos</span>
          </router-link>
        </nav>

        <!-- Botões de Autenticação -->
        <div class="auth-section">
          <!-- Usuário NÃO logado -->
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              class="btn-entrar"
              :class="{ 'disabled': isLoginPage }"
            >
              <i class="ti ti-login"></i>
              <span>Entrar</span>
            </router-link>
          </template>

          <!-- Usuário logado -->
          <template v-else>
            <!-- Menu do usuário -->
            <div class="user-menu" ref="userMenuRef">
              <button @click="toggleUserMenu" class="user-btn">
                <div class="user-avatar">
                  <img 
                    v-if="currentUser?.fotoUrl" 
                    :src="currentUser.fotoUrl" 
                    alt="Foto de perfil"
                    class="user-avatar-img"
                  />
                  <span v-else>{{ getUserInitials() }}</span>
                </div>
                <span class="user-name">{{ currentUser?.nome?.split(' ')[0] || 'Usuário' }}</span>
                <i class="ti ti-chevron-down"></i>
              </button>

              <!-- Dropdown do usuário -->
              <div v-if="isUserMenuOpen" class="user-dropdown">
                <div class="user-info">
                  <div class="user-avatar-large">
                    <img 
                      v-if="currentUser?.fotoUrl" 
                      :src="currentUser.fotoUrl" 
                      alt="Foto de perfil"
                      class="user-avatar-large-img"
                    />
                    <span v-else>{{ getUserInitials() }}</span>
                  </div>
                  <div class="user-details">
                    <strong>{{ currentUser?.nome || 'Usuário' }}</strong>
                    <small>{{ currentUser?.email || 'email@exemplo.com' }}</small>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <router-link to="/meus-cursos" class="dropdown-item" @click="closeUserMenu">
                  <i class="ti ti-book"></i>
                  <span>Meus Cursos</span>
                </router-link>
                
                <router-link to="/certificados" class="dropdown-item" @click="closeUserMenu">
                  <i class="ti ti-certificate"></i>
                  <span>Certificados</span>
                </router-link>
                
                <router-link to="/configuracoes" class="dropdown-item" @click="closeUserMenu">
                  <i class="ti ti-settings"></i>
                  <span>Configurações</span>
                </router-link>
                
                <!-- 🛡️ SEÇÃO ADMINISTRATIVA (só para administradores) -->
                <template v-if="isAdmin">
                  <div class="dropdown-divider"></div>
                  
                  <div class="dropdown-section-title">
                    <i class="ti ti-shield-lock"></i>
                    <span>Administração</span>
                  </div>
                  
                  <router-link to="/admin/usuarios" class="dropdown-item admin-item" @click="closeUserMenu">
                    <i class="ti ti-users"></i>
                    <span>Gestão de Usuários</span>
                  </router-link>
                  
                  <router-link to="/admin/cursos" class="dropdown-item admin-item" @click="closeUserMenu">
                    <i class="ti ti-book"></i>
                    <span>Gestão de Cursos</span>
                  </router-link>
                  
                  <router-link to="/admin/certificados" class="dropdown-item admin-item" @click="closeUserMenu">
                    <i class="ti ti-certificate"></i>
                    <span>Gestão de Certificados</span>
                  </router-link>
                </template>
                
                <div class="dropdown-divider"></div>
                
                <button @click="logout" class="dropdown-item logout-btn">
                  <i class="ti ti-logout"></i>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Menu Mobile -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="ti ti-menu-2"></i>
        </button>
      </div>
    </div>

    <!-- Menu Mobile Expandido -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">
        <i class="ti ti-home"></i>
        <span>Início</span>
      </router-link>
      
      <router-link to="/cursos" class="mobile-nav-item" @click="closeMobileMenu">
        <i class="ti ti-book"></i>
        <span>Cursos</span>
      </router-link>
      
      <router-link 
        v-if="isAuthenticated" 
        to="/certificados" 
        class="mobile-nav-item" 
        @click="closeMobileMenu"
      >
        <i class="ti ti-certificate"></i>
        <span>Certificados</span>
      </router-link>
      
      <div class="mobile-divider"></div>
      
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="mobile-nav-item login-mobile" @click="closeMobileMenu">
          <i class="ti ti-login"></i>
          <span>Entrar</span>
        </router-link>
      </template>
      
      <template v-else>
        <router-link to="/configuracoes" class="mobile-nav-item" @click="closeMobileMenu">
          <i class="ti ti-settings"></i>
          <span>Configurações</span>
        </router-link>
        
        <button @click="logout" class="mobile-nav-item logout-mobile">
          <i class="ti ti-logout"></i>
          <span>Sair</span>
        </button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const termoBusca = ref('')
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Sistema de autenticação
const { currentUser, logout: authLogout, isAuthenticated, isAdmin } = useAuth()

// Verificar se está na página de login
const isLoginPage = computed(() => {
  return route.path.startsWith('/login')
})

// Realizar busca
const realizarBusca = () => {
  if (termoBusca.value.trim() !== '') {
    router.push({ 
      path: '/cursos',
      query: { q: termoBusca.value }
    })
    termoBusca.value = ''
  }
}

// Obter iniciais do usuário
const getUserInitials = () => {
  if (!currentUser.value?.nome) return 'U'
  return currentUser.value.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Controles de menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Logout
const logout = () => {
  authLogout()
  router.push('/')
  closeUserMenu()
  closeMobileMenu()
}

// Fechar menus ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* === HEADER PRINCIPAL === */
.modern-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #2c3cdc;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(44, 60, 220, 0.3);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* === SEÇÃO DA MARCA === */
.brand-section {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  gap: 12px;
}

.brand-logo {
  height: 65px;
  width: auto;
}



/* === SEÇÃO DE PESQUISA === */
.search-section {
  flex: 1;
  max-width: 400px;
  margin: 0 30px;
}

.search-form {
  width: 100%;
}

.search-input-group {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 16px;
  z-index: 2;
}

.search-input {
  width: 100%;
  height: 45px;
  padding: 0 20px 0 45px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  background: #fcfcfc;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

/* === SEÇÃO DE NAVEGAÇÃO === */
.nav-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.horizontal-nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-icon {
  font-size: 16px;
}

.nav-text {
  font-size: 14px;
}

/* === SEÇÃO DE AUTENTICAÇÃO === */
.auth-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-entrar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-entrar:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
}

.btn-entrar.disabled {
  background: rgba(108, 117, 125, 0.3);
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(108, 117, 125, 0.3);
  cursor: not-allowed;
  pointer-events: none;
}



/* === MENU DO USUÁRIO === */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  overflow: hidden;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 250px;
  background: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 1001;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
}

.user-avatar-large {
  width: 40px;
  height: 40px;
  background: #2c3cdc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;
}

.user-avatar-large-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-details strong {
  display: block;
  color: #111827;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-details small {
  color: #6b7280;
  font-size: 12px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
  text-decoration: none;
  color: #374151;
}

.logout-btn {
  color: #dc2626 !important;
}

.logout-btn:hover {
  background: #fef2f2 !important;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

.dropdown-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-section-title i {
  font-size: 14px;
  color: #2c3cdc;
}

.admin-item {
  color: #2c3cdc !important;
  font-weight: 500;
}

.admin-item:hover {
  background: #f1f5f9 !important;
  color: #1e40af !important;
}

.admin-item i {
  color: #2c3cdc;
}

/* === MENU MOBILE === */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2c3cdc;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  gap: 5px;
  flex-direction: column;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
}

.mobile-nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.mobile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 0;
}

.login-mobile {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.logout-mobile {
  color: #fca5a5 !important;
}

/* === RESPONSIVIDADE === */

/* Tablet */
@media (max-width: 768px) {
  .header-container {
    padding: 0 15px;
  }
  
  .brand-text {
    display: none;
  }
  
  .search-section {
    max-width: 300px;
    margin: 0 20px;
  }
  
  .horizontal-nav {
    display: none;
  }
  
  .auth-section .btn-entrar span,
  .auth-section .user-name {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: flex;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .modern-header {
    height: 70px;
  }
  
  .header-container {
    padding: 0 10px;
  }
  
  .search-section {
    max-width: 200px;
    margin: 0 10px;
  }
  
  .search-input {
    height: 40px;
    font-size: 13px;
  }
  
  .brand-logo {
    height: 35px;
  }
}
</style>