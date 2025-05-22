<template>
  <nav class="pc-sidebar">
    <div class="navbar-wrapper">
      <div class="m-header">
        <router-link to="/" class="b-brand text-primary">
          <!-- ========   Change your logo from here   ============ -->
          <img
            src="../assets/imagens/logotipo.png"
            class="img-fluid logo-lg"
            alt="logo"
            style="max-width: 90px; height: auto"
          />
        </router-link>
      </div>
      <div class="navbar-content">
        <ul class="pc-navbar">
          <li class="pc-item">
            <router-link to="/" class="pc-link">
              <span class="pc-micon"><i class="ti ti-dashboard"></i></span>
              <span class="pc-mtext">HABEIS EDUCACIONAL</span>
            </router-link>
          </li>

          <!-- Certificados -->
          <li class="pc-item pc-hasmenu">
            <router-link to="/certificados" class="pc-link">
              <span class="pc-micon"><i class="ti ti-certificate"></i></span>
              <span class="pc-mtext">Certificados</span>
              <span class="pc-arrow"><i data-feather="chevron-right"></i></span>
            </router-link>
            <ul class="pc-submenu">
              <li class="pc-item">
                <router-link class="pc-link" to="/certificados">Meus Certificados</router-link>
              </li>
              <li class="pc-item">
                <router-link class="pc-link" to="/certificados/validar">Validar Certificado</router-link>
              </li>
            </ul>
          </li>

          <li class="pc-item pc-caption">
            <label>Gerenciamento</label>
            <i class="ti ti-settings"></i>
          </li>
          <li class="pc-item">
            <router-link to="/cursos" class="pc-link">
              <span class="pc-micon"><i class="ti ti-book"></i></span>
              <span class="pc-mtext">Cursos</span>
            </router-link>
          </li>
          <li class="pc-item">
            <router-link to="/alunos" class="pc-link">
              <span class="pc-micon"><i class="ti ti-users"></i></span>
              <span class="pc-mtext">Alunos</span>
            </router-link>
          </li>
          <li class="pc-item">
            <router-link to="/professores" class="pc-link">
              <span class="pc-micon"><i class="ti ti-user-star"></i></span>
              <span class="pc-mtext">Professores</span>
            </router-link>
          </li>

          <li class="pc-item pc-caption">
            <label>Sistema</label>
            <i class="ti ti-apps"></i>
          </li>
          <li class="pc-item">
            <router-link to="/login" class="pc-link">
              <span class="pc-micon"><i class="ti ti-lock"></i></span>
              <span class="pc-mtext">Login</span>
            </router-link>
          </li>
          <li class="pc-item">
            <router-link to="/registro" class="pc-link">
              <span class="pc-micon"><i class="ti ti-user-plus"></i></span>
              <span class="pc-mtext">Cadastro</span>
            </router-link>
          </li>

          <li class="pc-item pc-caption">
            <label>Relatórios</label>
            <i class="ti ti-chart-bar"></i>
          </li>
          <li class="pc-item pc-hasmenu">
            <a href="#!" class="pc-link"
              ><span class="pc-micon"><i class="ti ti-report"></i></span
              ><span class="pc-mtext">Estatísticas</span
              ><span class="pc-arrow"><i data-feather="chevron-right"></i></span
            ></a>
            <ul class="pc-submenu">
              <li class="pc-item">
                <router-link class="pc-link" to="/relatorios/emissoes">Emissões</router-link>
              </li>
              <li class="pc-item pc-hasmenu">
                <a href="#!" class="pc-link"
                  >Participação<span class="pc-arrow"><i data-feather="chevron-right"></i></span
                ></a>
                <ul class="pc-submenu">
                  <li class="pc-item">
                    <router-link class="pc-link" to="/relatorios/alunos">Por Aluno</router-link>
                  </li>
                  <li class="pc-item">
                    <router-link class="pc-link" to="/relatorios/cursos">Por Curso</router-link>
                  </li>
                  <li class="pc-item pc-hasmenu">
                    <a href="#!" class="pc-link"
                      >Desempenho<span class="pc-arrow"><i data-feather="chevron-right"></i></span
                    ></a>
                    <ul class="pc-submenu">
                      <li class="pc-item">
                        <router-link class="pc-link" to="/relatorios/desempenho/mensal"
                          >Mensal</router-link
                        >
                      </li>
                      <li class="pc-item">
                        <router-link class="pc-link" to="/relatorios/desempenho/anual"
                          >Anual</router-link
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="pc-item">
            <router-link to="/configuracoes" class="pc-link">
              <span class="pc-micon"><i class="ti ti-settings"></i></span>
              <span class="pc-mtext">Configurações</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'NavSideBar',
  components: {
    RouterLink,
  },
})
</script>
