<template>
  <nav class="pc-sidebar" :class="sidebarClass">
    <div class="navbar-wrapper">
      <!-- Logo da empresa -->
      <div class="m-header">
        <router-link to="/" class="b-brand text-primary">
          <img
            src="../assets/imagens/logotipo.png"
            class="img-fluid logo-lg"
            alt="Hábeis Educacional"
            style="max-width: 90px; height: auto"
          />
        </router-link>
      </div>
      
      <div class="navbar-content">
        <ul class="pc-navbar">
          <!-- 🏠 Página Inicial -->
          <li class="pc-item">
            <router-link to="/" class="pc-link">
              <span class="pc-micon"><i class="ti ti-home"></i></span>
              <span class="pc-mtext">Início</span>
            </router-link>
          </li>

          <!-- 🎓 Seção de Cursos -->
          <li class="pc-item pc-hasmenu">
            <router-link to="/cursos" class="pc-link">
              <span class="pc-micon"><i class="ti ti-book"></i></span>
              <span class="pc-mtext">Cursos</span>
              <span class="pc-arrow"><i data-feather="chevron-right"></i></span>
            </router-link>
            <ul class="pc-submenu">
              <li class="pc-item">
                <router-link class="pc-link" to="/cursos">📋 Catálogo de Cursos</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/cursos/buscar">🔍 Buscar Cursos</router-link>
              </li>
              <!-- Só aparece para usuários logados -->
              <li v-if="isAuthenticated" class="pc-item">
                <router-link class="pc-link" to="/cursos/meus-cursos">📚 Meus Cursos</router-link>
              </li>
            </ul>
          </li>

          <!-- 📜 Certificados (só para usuários logados) -->
          <li v-if="isAuthenticated" class="pc-item pc-hasmenu">
            <router-link to="/certificados" class="pc-link">
              <span class="pc-micon"><i class="ti ti-certificate"></i></span>
              <span class="pc-mtext">Meus Certificados</span>
              <span class="pc-arrow"><i data-feather="chevron-right"></i></span>
            </router-link>
            <ul class="pc-submenu">
              <li class="pc-item">
                <router-link class="pc-link" to="/certificados">✅ Certificados Conquistados</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/certificados/andamento">⏳ Cursos em Andamento</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/certificados/progresso">📈 Meu Progresso</router-link>
              </li>
            </ul>
          </li>

          <!-- ⚙️ Configurações Pessoais (só para usuários logados) -->
          <li v-if="isAuthenticated" class="pc-item pc-hasmenu">
            <router-link to="/configuracoes" class="pc-link">
              <span class="pc-micon"><i class="ti ti-settings"></i></span>
              <span class="pc-mtext">Configurações</span>
              <span class="pc-arrow"><i data-feather="chevron-right"></i></span>
            </router-link>
            <ul class="pc-submenu">
              <li class="pc-item">
                <router-link class="pc-link" to="/configuracoes/perfil">👤 Meu Perfil</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/configuracoes/notificacoes">🔔 Notificações</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/configuracoes/seguranca">🔐 Segurança</router-link>
              </li>
            </ul>
          </li>

          <!-- 🛡️ SEÇÃO ADMINISTRATIVA (só para administradores) -->
          <template v-if="isAdmin">
            <li class="pc-item pc-caption">
              <label>🛡️ Administração</label>
              <i class="ti ti-shield"></i>
            </li>
            
            <li class="pc-item">
              <router-link to="/admin/usuarios" class="pc-link">
                <span class="pc-micon"><i class="ti ti-users"></i></span>
                <span class="pc-mtext">👥 Gestão de Usuários</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link to="/admin/cursos" class="pc-link">
                <span class="pc-micon"><i class="ti ti-book-2"></i></span>
                <span class="pc-mtext">🎓 Gestão de Cursos</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link to="/admin/professores" class="pc-link">
                <span class="pc-micon"><i class="ti ti-user-star"></i></span>
                <span class="pc-mtext">👨‍🏫 Gestão de Professores</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link to="/admin/certificados" class="pc-link">
                <span class="pc-micon"><i class="ti ti-certificate-2"></i></span>
                <span class="pc-mtext">📜 Gestão de Certificados</span>
              </router-link>
            </li>
            
            <li class="pc-item">
              <router-link to="/admin/configuracoes" class="pc-link">
                <span class="pc-micon"><i class="ti ti-settings-cog"></i></span>
                <span class="pc-mtext">⚙️ Configurações do Sistema</span>
              </router-link>
            </li>
          </template>

          <!-- 🔐 Autenticação (só para usuários não logados) -->
          <template v-if="!isAuthenticated">
            <li class="pc-item pc-caption">
              <label>Acesso</label>
              <i class="ti ti-lock"></i>
            </li>
            <li class="pc-item">
              <router-link to="/login" class="pc-link">
                <span class="pc-micon"><i class="ti ti-login"></i></span>
                <span class="pc-mtext">Entrar</span>
              </router-link>
            </li>
            <li class="pc-item">
              <router-link to="/registro" class="pc-link">
                <span class="pc-micon"><i class="ti ti-user-plus"></i></span>
                <span class="pc-mtext">Criar Conta</span>
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
const { sidebarClass } = useSidebar()
</script>
