<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card border-0" style="background-color: transparent;">
        <div class="card-body">
          <!-- Abas de navegação entre as diferentes seções de configurações -->
          <ul class="nav nav-tabs mb-4" id="configTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'perfil' }"
                @click="activeTab = 'perfil'"
                type="button"
              >
                <i class="ti ti-user me-2"></i>Perfil
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'notificacoes' }"
                @click="activeTab = 'notificacoes'"
                type="button"
              >
                <i class="ti ti-bell me-2"></i>Notificações
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'privacidade' }"
                @click="activeTab = 'privacidade'"
                type="button"
              >
                <i class="ti ti-lock me-2"></i>Privacidade
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'aparencia' }"
                @click="activeTab = 'aparencia'"
                type="button"
              >
                <i class="ti ti-palette me-2"></i>Aparência
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'seguranca' }"
                @click="activeTab = 'seguranca'"
                type="button"
              >
                <i class="ti ti-shield-lock me-2"></i>Segurança
              </button>
            </li>
          </ul>

          <!-- Conteúdo das configurações de perfil -->
          <div v-if="activeTab === 'perfil'" class="tab-pane fade show active">
            <div class="row">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3">Informações do perfil</h6>
                
                <!-- Card para foto de perfil -->
                <div class="card mb-3 border-0" style="background-color: transparent;">
                  <div class="card-header" style="background-color: transparent; border-bottom: 1px solid #dee2e6;">
                    <h6 class="mb-0">Foto de perfil</h6>
                  </div>
                  <div class="card-body text-center">
                    <div class="position-relative d-inline-block">
                      <div v-if="!config.perfil.fotoUrl" class="avatar-placeholder">
                        <span>{{ getUserInitials() }}</span>
                      </div>
                      <img v-else :src="config.perfil.fotoUrl" alt="Foto de perfil" class="img-thumbnail rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">
                      <button class="btn btn-sm btn-primary position-absolute bottom-0 end-0" @click="alterarFoto">
                        <i class="ti ti-pencil"></i>
                      </button>
                    </div>
                    <small class="text-muted d-block mt-2">Clique para alterar sua foto</small>
                    <!-- Input de arquivo oculto -->
                    <input 
                      ref="fileInput" 
                      type="file" 
                      accept="image/*" 
                      style="display: none" 
                      @change="handleFileUpload"
                    >
                  </div>
                </div>
                
                <!-- Card para informações pessoais -->
                <div class="card mb-3 border-0" style="background-color: transparent;">
                  <div class="card-header" style="background-color: transparent; border-bottom: 1px solid #dee2e6;">
                    <h6 class="mb-0">Informações pessoais</h6>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="salvarPerfil">
                      <!-- Nome completo (readonly) -->
                      <div class="mb-3">
                        <label class="form-label">Nome completo</label>
                        <input 
                          type="text" 
                          class="form-control form-control-readonly" 
                          :value="config.perfil.nome"
                          readonly
                          placeholder="Seu nome completo"
                        >
                        <small class="text-muted">Nome não pode ser alterado</small>
                      </div>
                      
                      <!-- Email (readonly) -->
                      <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input 
                          type="email" 
                          class="form-control form-control-readonly" 
                          :value="config.perfil.email"
                          readonly
                          placeholder="seu@email.com"
                        >
                        <small class="text-muted">Email não pode ser alterado</small>
                      </div>
                      
                      <!-- Telefone -->
                      <div class="mb-3">
                        <label class="form-label">Telefone</label>
                        <input 
                          type="tel" 
                          class="form-control" 
                          v-model="config.perfil.telefone"
                          placeholder="(00) 00000-0000"
                        >
                      </div>
                      
                      <!-- Botões de ação -->
                      <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Salvar alterações</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de notificações -->
          <div v-if="activeTab === 'notificacoes'" class="tab-pane fade show active">
            <div class="row">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3">Preferências de notificação</h6>
                
                <!-- Notificações por email -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0 d-flex align-items-center">
                      <i class="ti ti-mail me-2"></i>
                      Notificações por Email
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="emailNovosCursos" 
                        v-model="config.notificacoes.email.novosCursos"
                      >
                      <label class="form-check-label" for="emailNovosCursos">
                        Novos cursos disponíveis
                      </label>
                      <p class="text-muted small">Receba avisos quando novos cursos forem adicionados à plataforma</p>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="emailCertificados" 
                        v-model="config.notificacoes.email.certificados"
                      >
                      <label class="form-check-label" for="emailCertificados">
                        Emissão de certificados
                      </label>
                      <p class="text-muted small">Receba um email quando seus certificados forem emitidos</p>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="emailLembretes" 
                        v-model="config.notificacoes.email.lembretes"
                      >
                      <label class="form-check-label" for="emailLembretes">
                        Lembretes de cursos
                      </label>
                      <p class="text-muted small">Receba lembretes sobre cursos em andamento</p>
                    </div>
                  </div>
                </div>
                
                <!-- Notificações no sistema -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0 d-flex align-items-center">
                      <i class="ti ti-bell me-2"></i>
                      Notificações no Sistema
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="sistemaNovosCursos" 
                        v-model="config.notificacoes.sistema.novosCursos"
                      >
                      <label class="form-check-label" for="sistemaNovosCursos">
                        Novos cursos disponíveis
                      </label>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="sistemaCertificados" 
                        v-model="config.notificacoes.sistema.certificados"
                      >
                      <label class="form-check-label" for="sistemaCertificados">
                        Emissão de certificados
                      </label>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="sistemaLembretes" 
                        v-model="config.notificacoes.sistema.lembretes"
                      >
                      <label class="form-check-label" for="sistemaLembretes">
                        Lembretes de cursos
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- Botões de ação -->
                <div class="row mt-4">
                  <div class="col-12">
                    <button type="button" class="btn btn-primary" @click="salvarNotificacoes">Salvar preferências</button>
                    <button type="button" class="btn btn-outline-secondary ms-2">Redefinir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de privacidade -->
          <div v-if="activeTab === 'privacidade'" class="tab-pane fade show active">
            <div class="row">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3">Configurações de privacidade</h6>
                
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Visibilidade do perfil</h6>
                  </div>
                  <div class="card-body">
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="perfilPublico" 
                        v-model="config.privacidade.perfilPublico"
                      >
                      <label class="form-check-label" for="perfilPublico">
                        Perfil público
                      </label>
                      <p class="text-muted small">Quando ativado, seu perfil poderá ser visualizado por outros usuários</p>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="mostrarCursos" 
                        v-model="config.privacidade.mostrarCursos"
                      >
                      <label class="form-check-label" for="mostrarCursos">
                        Mostrar cursos concluídos
                      </label>
                      <p class="text-muted small">Exibe seus cursos concluídos em seu perfil público</p>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="mostrarCertificados" 
                        v-model="config.privacidade.mostrarCertificados"
                      >
                      <label class="form-check-label" for="mostrarCertificados">
                        Mostrar certificados
                      </label>
                      <p class="text-muted small">Permite que outros usuários vejam seus certificados</p>
                    </div>
                    
                    <div class="form-check form-switch mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="compartilharProgresso" 
                        v-model="config.privacidade.compartilharProgresso"
                      >
                      <label class="form-check-label" for="compartilharProgresso">
                        Compartilhar progresso
                      </label>
                      <p class="text-muted small">Compartilha seu progresso nos cursos em andamento</p>
                    </div>
                  </div>
                </div>
                
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Dados pessoais</h6>
                  </div>
                  <div class="card-body">
                    <div class="mb-4">
                      <h6>Exportar seus dados</h6>
                      <p class="text-muted">Baixe uma cópia de todos os seus dados, incluindo certificados, cursos e informações pessoais.</p>
                      <button class="btn btn-outline-primary btn-sm" @click="exportarDados">
                        <i class="ti ti-download me-1"></i>
                        Exportar dados
                      </button>
                    </div>
                    
                    <div class="mt-4 pt-3 border-top">
                      <h6 class="text-danger">Excluir conta</h6>
                      <p class="text-muted">A exclusão da conta é permanente. Todos os seus dados serão removidos permanentemente.</p>
                      <button class="btn btn-outline-danger btn-sm" @click="confirmarExclusao">
                        <i class="ti ti-trash me-1"></i>
                        Excluir minha conta
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Botões de ação -->
                <div class="row mt-4">
                  <div class="col-12">
                    <button type="button" class="btn btn-primary" @click="salvarPrivacidade">Salvar configurações</button>
                    <button type="button" class="btn btn-outline-secondary ms-2">Redefinir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de aparência -->
          <div v-if="activeTab === 'aparencia'" class="tab-pane fade show active">
            <div class="row">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3">Personalização da interface</h6>
                
                <!-- Tema -->
                <div class="mb-4">
                  <label class="form-label">Tema</label>
                  <div class="d-flex gap-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        id="temaClaro" 
                        value="claro" 
                        v-model="config.aparencia.tema"
                      >
                      <label class="form-check-label" for="temaClaro">
                        <i class="ti ti-sun me-1"></i>
                        Claro
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        id="temaEscuro" 
                        value="escuro" 
                        v-model="config.aparencia.tema"
                      >
                      <label class="form-check-label" for="temaEscuro">
                        <i class="ti ti-moon me-1"></i>
                        Escuro
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        id="temaSistema" 
                        value="sistema" 
                        v-model="config.aparencia.tema"
                      >
                      <label class="form-check-label" for="temaSistema">
                        <i class="ti ti-device-desktop me-1"></i>
                        Sistema
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- Tamanho da fonte -->
                <div class="mb-4">
                  <label class="form-label">Tamanho da fonte</label>
                  <div class="d-flex align-items-center">
                    <i class="ti ti-letter-case text-muted fs-6"></i>
                    <input 
                      type="range" 
                      class="form-range mx-2" 
                      min="0" 
                      max="2" 
                      step="1" 
                      :value="fonteSizeIndex" 
                      @input="atualizarTamanhoFonte($event)"
                    >
                    <i class="ti ti-letter-case text-muted fs-4"></i>
                  </div>
                  <small class="text-muted">
                    {{ tamanhoFonteLabel }}
                  </small>
                </div>
                
                <!-- Densidade da interface -->
                <div class="mb-4">
                  <label class="form-label">Densidade da interface</label>
                  <select class="form-select" v-model="config.aparencia.densidadeInterface">
                    <option value="compacta">Compacta</option>
                    <option value="normal">Normal</option>
                    <option value="confortavel">Confortável</option>
                  </select>
                  <small class="text-muted">
                    Controla o espaçamento entre os elementos da interface
                  </small>
                </div>
                
                <!-- Botões de ação -->
                <div class="row mt-4">
                  <div class="col-12">
                    <button type="button" class="btn btn-primary" @click="salvarAparencia">Aplicar alterações</button>
                    <button type="button" class="btn btn-outline-secondary ms-2">Restaurar padrão</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de segurança -->
          <div v-if="activeTab === 'seguranca'" class="tab-pane fade show active">
            <div class="row">
              <div class="col-12">
                <h6 class="border-bottom pb-2 mb-3">Segurança da conta</h6>
                
                <!-- Alterar senha -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Alterar senha</h6>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="alterarSenha">
                      <div class="mb-3">
                        <label class="form-label">Senha atual</label>
                        <input type="password" class="form-control" v-model="senhaAtual">
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Nova senha</label>
                        <input type="password" class="form-control" v-model="novaSenha">
                        <div class="progress mt-2" style="height: 5px;">
                          <div class="progress-bar" :class="forcaSenhaClass" :style="`width: ${forcaSenha}%`"></div>
                        </div>
                        <small :class="forcaSenhaTextClass">{{ forcaSenhaTexto }}</small>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Confirmar nova senha</label>
                        <input type="password" class="form-control" v-model="confirmarSenha">
                      </div>
                      <button type="submit" class="btn btn-primary">Alterar senha</button>
                    </form>
                  </div>
                </div>
                
                <!-- Autenticação de dois fatores -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Autenticação de dois fatores</h6>
                  </div>
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <p class="mb-0">Adicione uma camada extra de segurança à sua conta</p>
                        <small class="text-muted">
                          Você receberá um código via SMS ou app de autenticação ao fazer login
                        </small>
                      </div>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="ativar2FA" 
                          v-model="config.seguranca.autenticacaoDoisFatores"
                          @change="toggle2FA"
                        >
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Sessões ativas -->
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Dispositivos conectados</h6>
                  </div>
                  <div class="card-body">
                    <p class="text-muted mb-3">Dispositivos onde sua conta está conectada atualmente:</p>
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Dispositivo</th>
                            <th>Último acesso</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(dispositivo, index) in config.seguranca.dispositivosConectados" :key="index">
                            <td>
                              <div class="d-flex align-items-center">
                                <i class="ti ti-device-laptop me-2"></i>
                                {{ dispositivo.nome }}
                                <span v-if="dispositivo.ativo" class="badge bg-success ms-2">Atual</span>
                              </div>
                            </td>
                            <td>{{ formatarData(dispositivo.ultimoAcesso) }}</td>
                            <td>
                              <button 
                                class="btn btn-sm btn-outline-danger" 
                                @click="encerrarSessao(index)"
                                :disabled="dispositivo.ativo"
                              >
                                Encerrar
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button class="btn btn-outline-danger btn-sm mt-3" @click="encerrarTodasSessoes">
                      Encerrar todas as outras sessões
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// Aba ativa nas configurações
const activeTab = ref('perfil');
const router = useRouter();
const { currentUser, updateUserProfile } = useAuth();

// Referência para o input de arquivo
const fileInput = ref<HTMLInputElement | null>(null);

// Variáveis para o formulário de alteração de senha
const senhaAtual = ref('');
const novaSenha = ref('');
const confirmarSenha = ref('');

// Objeto que mantém todas as configurações do usuário
const config = reactive({
  perfil: {
    nome: '',
    email: '',
    telefone: '',
    fotoUrl: ''
  },
  notificacoes: {
    email: {
      novosCursos: true,
      certificados: true,
      lembretes: false
    },
    sistema: {
      novosCursos: true,
      certificados: true,
      lembretes: true
    }
  },
  privacidade: {
    perfilPublico: false,
    mostrarCursos: true,
    mostrarCertificados: true,
    compartilharProgresso: false
  },
  aparencia: {
    tema: 'claro', // 'claro', 'escuro', 'sistema'
    tamanhoFonte: 'medio', // 'pequeno', 'medio', 'grande'
    densidadeInterface: 'normal' // 'compacta', 'normal', 'confortavel'
  },
  seguranca: {
    autenticacaoDoisFatores: false,
    ultimoAcesso: '2023-11-20T14:30:00',
    dispositivosConectados: [
      { nome: 'Chrome em Windows 10', ultimoAcesso: '2023-11-20T14:30:00', ativo: true },
      { nome: 'Firefox em MacOS', ultimoAcesso: '2023-11-19T10:15:00', ativo: false },
      { nome: 'App Mobile em Android', ultimoAcesso: '2023-11-18T08:30:00', ativo: false }
    ]
  }
});

// Carregar dados do usuário ao montar o componente
onMounted(() => {
  if (currentUser.value) {
    config.perfil.nome = currentUser.value.nome || '';
    config.perfil.email = currentUser.value.email || '';
    config.perfil.telefone = currentUser.value.telefone || '';
    config.perfil.fotoUrl = currentUser.value.fotoUrl || '';
  }
});

// Método para obter iniciais do usuário para avatar
const getUserInitials = () => {
  if (!config.perfil.nome) return 'U';
  return config.perfil.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Função para abrir o seletor de arquivos
const alterarFoto = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Função para lidar com o upload de arquivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      mostrarMensagem('Por favor, selecione apenas arquivos de imagem');
      return;
    }
    
    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      mostrarMensagem('O arquivo deve ter no máximo 5MB');
      return;
    }
    
    // Criar URL temporária para preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        config.perfil.fotoUrl = e.target.result as string;
        
        // Salvar no localStorage (simulando upload)
        if (currentUser.value) {
          const userData = { ...currentUser.value, fotoUrl: config.perfil.fotoUrl };
          updateUserProfile(userData);
        }
        
        mostrarMensagem('Foto de perfil atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  }
};

// Valor numérico do tamanho da fonte
const fonteSizeIndex = computed(() => {
  switch (config.aparencia.tamanhoFonte) {
    case 'pequeno': return 0;
    case 'medio': return 1;
    case 'grande': return 2;
    default: return 1;
  }
});

// Texto do tamanho da fonte
const tamanhoFonteLabel = computed(() => {
  switch (config.aparencia.tamanhoFonte) {
    case 'pequeno': return 'Pequeno';
    case 'medio': return 'Médio';
    case 'grande': return 'Grande';
    default: return 'Médio';
  }
});

// Atualizar tamanho da fonte baseado no slider
const atualizarTamanhoFonte = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value);
  switch (value) {
    case 0: 
      config.aparencia.tamanhoFonte = 'pequeno';
      break;
    case 1: 
      config.aparencia.tamanhoFonte = 'medio';
      break;
    case 2: 
      config.aparencia.tamanhoFonte = 'grande';
      break;
  }
};

// Cálculo da força da senha
const forcaSenha = computed(() => {
  if (!novaSenha.value) return 0;
  
  let pontos = 0;
  
  // Comprimento
  if (novaSenha.value.length >= 8) pontos += 20;
  if (novaSenha.value.length >= 12) pontos += 10;
  
  // Complexidade
  if (/[a-z]/.test(novaSenha.value)) pontos += 10;
  if (/[A-Z]/.test(novaSenha.value)) pontos += 20;
  if (/[0-9]/.test(novaSenha.value)) pontos += 20;
  if (/[^a-zA-Z0-9]/.test(novaSenha.value)) pontos += 20;
  
  return Math.min(pontos, 100);
});

// Classe CSS para a barra de força da senha
const forcaSenhaClass = computed(() => {
  if (forcaSenha.value < 40) return 'bg-danger';
  if (forcaSenha.value < 70) return 'bg-warning';
  return 'bg-success';
});

// Classe CSS para o texto de força da senha
const forcaSenhaTextClass = computed(() => {
  if (forcaSenha.value < 40) return 'text-danger';
  if (forcaSenha.value < 70) return 'text-warning';
  return 'text-success';
});

// Texto de força da senha
const forcaSenhaTexto = computed(() => {
  if (!novaSenha.value) return '';
  if (forcaSenha.value < 40) return 'Senha fraca';
  if (forcaSenha.value < 70) return 'Senha média';
  return 'Senha forte';
});

// Formatar data para exibição
const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
};

// Simula o salvamento das configurações de perfil
const salvarPerfil = () => {
  if (currentUser.value) {
    const userData = { 
      ...currentUser.value, 
      telefone: config.perfil.telefone,
      fotoUrl: config.perfil.fotoUrl 
    };
    updateUserProfile(userData);
  }
  
  setTimeout(() => {
    mostrarMensagem('Perfil atualizado com sucesso!');
  }, 500);
};

// Cancelar edição
const cancelarEdicao = () => {
  // Restaurar dados originais
  if (currentUser.value) {
    config.perfil.telefone = currentUser.value.telefone || '';
  }
};

// Simula o salvamento das configurações de notificações
const salvarNotificacoes = () => {
  setTimeout(() => {
    mostrarMensagem('Preferências de notificação atualizadas!');
  }, 500);
};

// Simula o salvamento das configurações de privacidade
const salvarPrivacidade = () => {
  setTimeout(() => {
    mostrarMensagem('Configurações de privacidade atualizadas!');
  }, 500);
};

// Simula o salvamento das configurações de aparência
const salvarAparencia = () => {
  // Aplica o tema escuro/claro de forma simples
  const html = document.documentElement;
  const body = document.body;
  
  if (config.aparencia.tema === 'escuro') {
    html.classList.add('dark-theme');
    body.classList.add('dark-theme');
  } else if (config.aparencia.tema === 'claro') {
    html.classList.remove('dark-theme');
    body.classList.remove('dark-theme');
  } else if (config.aparencia.tema === 'sistema') {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      html.classList.add('dark-theme');
      body.classList.add('dark-theme');
    } else {
      html.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
    }
  }
  
  // Salva a preferência
  localStorage.setItem('theme-preference', config.aparencia.tema);
  
  setTimeout(() => {
    // Em uma aplicação real, aplicaríamos o tema, tamanho da fonte, etc.
    mostrarMensagem('Aparência personalizada aplicada!');
  }, 500);
};

// Simula a alteração de senha
const alterarSenha = () => {
  if (!senhaAtual.value) {
    mostrarMensagem('Por favor, informe sua senha atual');
    return;
  }
  
  if (novaSenha.value !== confirmarSenha.value) {
    mostrarMensagem('As senhas não coincidem');
    return;
  }
  
  if (forcaSenha.value < 40) {
    mostrarMensagem('Por favor, escolha uma senha mais forte');
    return;
  }
  
  // Em uma aplicação real, enviaríamos a solicitação para a API
  setTimeout(() => {
    mostrarMensagem('Senha alterada com sucesso!');
    senhaAtual.value = '';
    novaSenha.value = '';
    confirmarSenha.value = '';
  }, 500);
};

// Simula a ativação/desativação da autenticação de dois fatores
const toggle2FA = () => {
  const status = config.seguranca.autenticacaoDoisFatores;
  
  if (status) {
    // Em uma aplicação real, mostraríamos um QR code ou enviaríamos um SMS
    mostrarMensagem('Autenticação de dois fatores ativada!');
  } else {
    mostrarMensagem('Autenticação de dois fatores desativada');
  }
};

// Simula a exportação de dados
const exportarDados = () => {
  mostrarMensagem('Seus dados serão enviados para seu email em alguns instantes');
};

// Simula a confirmação de exclusão da conta
const confirmarExclusao = () => {
  const confirmar = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
  
  if (confirmar) {
    // Em uma aplicação real, enviaríamos a solicitação para a API
    setTimeout(() => {
      mostrarMensagem('Conta excluída com sucesso');
      router.push('/');
    }, 1000);
  }
};

// Simula o encerramento de uma sessão
const encerrarSessao = (index: number) => {
  // Em uma aplicação real, enviaríamos a solicitação para a API
  setTimeout(() => {
    config.seguranca.dispositivosConectados.splice(index, 1);
    mostrarMensagem('Sessão encerrada com sucesso');
  }, 500);
};

// Simula o encerramento de todas as sessões
const encerrarTodasSessoes = () => {
  // Em uma aplicação real, enviaríamos a solicitação para a API
  setTimeout(() => {
    config.seguranca.dispositivosConectados = config.seguranca.dispositivosConectados.filter(d => d.ativo);
    mostrarMensagem('Todas as outras sessões foram encerradas');
  }, 500);
};

// Função auxiliar para mostrar mensagens (simulada)
const mostrarMensagem = (mensagem: string) => {
  alert(mensagem);
};
</script>

<style scoped>
/* Estilos específicos da página de configurações */
.nav-tabs .nav-link {
  display: flex;
  align-items: center;
  border: none;
  color: #6c757d;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link.active {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  background-color: transparent;
}

.nav-tabs .nav-link:hover:not(.active) {
  border-bottom: 2px solid #e9ecef;
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.form-check-input:checked {
  background-color: #1976d2;
  border-color: #1976d2;
}

.form-control-readonly {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed;
}

/* Estilos básicos para tema escuro */
:global(.dark-theme) {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
}

:global(.dark-theme .card) {
  background-color: transparent !important;
  border-color: #424242 !important;
  color: #e0e0e0 !important;
}

:global(.dark-theme .card-header) {
  background-color: transparent !important;
  border-bottom-color: #424242 !important;
}

:global(.dark-theme .form-control) {
  background-color: #2d2d2d !important;
  border-color: #424242 !important;
  color: #e0e0e0 !important;
}

:global(.dark-theme .form-control::placeholder) {
  color: #888888 !important;
}

:global(.dark-theme .btn-outline-secondary) {
  color: #e0e0e0 !important;
  border-color: #424242 !important;
}

:global(.dark-theme .nav-tabs .nav-link) {
  color: #b0b0b0 !important;
}

:global(.dark-theme .nav-tabs .nav-link.active) {
  color: #2196f3 !important;
}

:global(.dark-theme .text-muted) {
  color: #888888 !important;
}

:global(.dark-theme .pc-container) {
  background-color: #121212 !important;
}

:global(.dark-theme .pc-content) {
  background-color: #121212 !important;
}

:global(.dark-theme .form-control-readonly) {
  background-color: #2d2d2d !important;
  color: #888888 !important;
}
</style> 