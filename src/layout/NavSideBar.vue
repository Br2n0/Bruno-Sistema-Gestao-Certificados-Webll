<template>
  <!-- Overlay para mobile -->
  <div 
    v-if="isMobile && isMobileMenuOpen" 
    class="mobile-overlay"
    @click="closeMobileMenu"
  ></div>
  
  <nav class="pc-sidebar" :class="{ 
    'pc-sidebar-collapsed': isCollapsed && !isMobile,
    'pc-sidebar-mobile-open': isMobile && isMobileMenuOpen 
  }">
    <div class="navbar-wrapper">
      <!-- Logo da empresa -->
      <div class="m-header">
        <router-link to="/" class="b-brand text-primary">
          <!-- Logo normal (quando expandida) -->
          <img
            v-if="!isCollapsed"
            src="../assets/imagens/logotipo.png"
            class="logo-lg"
            alt="Hábeis Educacional"
          />
          <!-- Logo minimizada (quando colapsada) -->
          <div 
            v-else
            class="logo-mini"
            title="Hábeis Educacional"
          >
            <img
              src="../assets/imagens/logotipo.png"
              class="logo-sm"
              alt="Hábeis Educacional"
            />
          </div>
        </router-link>
      </div>
      
      <div class="navbar-content">
        <ul class="pc-navbar">
          <!-- 🏠 Página Inicial -->
          <li class="pc-item">
            <router-link 
              to="/" 
              class="pc-link"
              :title="isCollapsed ? 'Início' : ''"
              @click="closeMobileMenu"
            >
              <span class="pc-micon">
                <i class="ti ti-home"></i>
              </span>
              <span class="pc-mtext">Início</span>
            </router-link>
          </li>

          <!-- 🎓 Seção de Cursos -->
          <li class="pc-item">
            <router-link 
              to="/cursos" 
              class="pc-link"
              :title="isCollapsed ? 'Cursos' : ''"
              @click="closeMobileMenu"
            >
              <span class="pc-micon">
                <i class="ti ti-book"></i>
              </span>
              <span class="pc-mtext">Cursos</span>
            </router-link>
          </li>

          <!-- 📜 Certificados (só para usuários logados) -->
          <li v-if="isAuthenticated" class="pc-item">
            <router-link 
              to="/certificados" 
              class="pc-link"
              :title="isCollapsed ? 'Meus Certificados' : ''"
              @click="closeMobileMenu"
            >
              <span class="pc-micon">
                <i class="ti ti-certificate"></i>
              </span>
              <span class="pc-mtext">Meus Certificados</span>
            </router-link>
          </li>

          <!-- 🛡️ SEÇÃO ADMINISTRATIVA (só para administradores) -->
          <template v-if="isAdmin">
            <!-- Separador visual para admin -->
            <li v-if="!isCollapsed" class="pc-divider">
              <span>Administração</span>
            </li>
            
            <li class="pc-item">
              <router-link 
                to="/admin/usuarios" 
                class="pc-link admin-link"
                :title="isCollapsed ? 'Gestão de Usuários' : ''"
                @click="closeMobileMenu"
              >
                <span class="pc-mtext">Gestão de Usuários</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link 
                to="/admin/cursos" 
                class="pc-link admin-link"
                :title="isCollapsed ? 'Gestão de Cursos' : ''"
                @click="closeMobileMenu"
              >
                <span class="pc-mtext">Gestão de Cursos</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link 
                to="/admin/professores" 
                class="pc-link admin-link"
                :title="isCollapsed ? 'Gestão de Professores' : ''"
                @click="closeMobileMenu"
              >
                <span class="pc-mtext">Gestão de Professores</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link 
                to="/admin/certificados" 
                class="pc-link admin-link"
                :title="isCollapsed ? 'Gestão de Certificados' : ''"
                @click="closeMobileMenu"
              >
                <span class="pc-mtext">Gestão de Certificados</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link 
                to="/admin/configuracoes" 
                class="pc-link admin-link"
                :title="isCollapsed ? 'Configurações do Sistema' : ''"
                @click="closeMobileMenu"
              >
                <span class="pc-mtext">Configurações do Sistema</span>
              </router-link>
            </li>
          </template>


        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useSidebar } from '@/composables/useSidebar'

// Importa as funções de autenticação
const { isAdmin, isAuthenticated } = useAuth()

// Importa as funções da sidebar
const { isCollapsed, isMobile, isMobileMenuOpen } = useSidebar()

// Fecha o menu mobile quando clica em um link
const closeMobileMenu = () => {
  if (isMobile.value && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}
</script>

<style scoped>
/* === SIDEBAR BASE === */
.pc-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  z-index: 1050;
  overflow-y: auto;
}

/* === SIDEBAR COLLAPSED === */
.pc-sidebar.pc-sidebar-collapsed {
  width: 70px;
}

/* === HEADER/LOGO === */
.m-header {
  padding: 8px 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
}

.b-brand {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.logo-lg {
  max-width: 70px;
  height: auto;
  transition: all 0.3s ease;
}

.logo-mini {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 4px;
  overflow: hidden;
}

.logo-sm {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

/* === NAVBAR === */
.navbar-content {
  padding: 5px 0;
}

.pc-navbar {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* === MENU ITEMS === */
.pc-item {
  margin: 1px 10px;
}

.pc-link {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  text-decoration: none;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.pc-link:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
  text-decoration: none;
}

.pc-link.router-link-active {
  background-color: #4f46e5;
  color: white;
}

/* === ADMIN LINKS === */
.admin-link {
  padding-left: 25px !important;
}

.admin-link .pc-mtext {
  font-size: 13px;
  font-weight: 400;
}

/* === ÍCONES E TEXTOS === */
.pc-micon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 18px;
}

.pc-mtext {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 1;
  transition: all 0.3s ease;
}

/* === DIVISORES === */
.pc-divider {
  padding: 16px 15px 8px;
  margin: 10px 0 5px;
}

.pc-divider span {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* === QUANDO COLLAPSED === */
.pc-sidebar-collapsed .pc-mtext,
.pc-sidebar-collapsed .pc-divider {
  opacity: 0;
  visibility: hidden;
  width: 0;
  margin: 0;
  padding: 0;
}

.pc-sidebar-collapsed .pc-micon {
  margin: 0;
}

.pc-sidebar-collapsed .pc-link {
  justify-content: center;
  padding: 8px 0;
}

.pc-sidebar-collapsed .pc-item {
  margin: 1px 5px;
}

/* === ADMIN LINKS NO MODO COLLAPSED === */
.pc-sidebar-collapsed .admin-link {
  padding: 6px 0 !important;
  justify-content: center;
}

.pc-sidebar-collapsed .admin-link .pc-mtext {
  display: none;
}

.pc-sidebar-collapsed .admin-link::after {
  content: '•';
  font-size: 16px;
  color: #6b7280;
}

/* === TOOLTIPS === */
.pc-sidebar-collapsed .pc-link[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 75px;
  top: 50%;
  transform: translateY(-50%);
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  opacity: 1;
}

.pc-sidebar-collapsed .pc-link[title]:hover::before {
  content: '';
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: #1f2937;
  z-index: 1000;
}

/* === MOBILE === */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1049;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@media (max-width: 991px) {
  .pc-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .pc-sidebar.pc-sidebar-mobile-open {
    transform: translateX(0);
  }
}

/* === SCROLLBAR === */
.pc-sidebar::-webkit-scrollbar {
  width: 4px;
}

.pc-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.pc-sidebar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.pc-sidebar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
