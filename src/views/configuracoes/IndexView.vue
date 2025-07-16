<template>
  <div class="perfil-container">
    <!-- Header da página com texto descritivo -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <p class="text-dark fs-6 mb-0">Gerencie suas informações pessoais e configurações de segurança</p>
        </div>
      </div>
    </div>

    <!-- Mensagem de sucesso -->
    <div v-if="mostrarSucesso" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ mensagemSucesso }}
      <button type="button" class="btn-close" @click="fecharMensagem"></button>
    </div>

    <!-- SEÇÃO 1: INFORMAÇÕES DA CONTA -->
    <div class="card mb-4 border-0 shadow-sm">
      <div class="card-header bg-light">
        <h5 class="mb-0 d-flex align-items-center">
          <i class="ti ti-user-circle me-2 text-primary"></i>
          Informações da Conta
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Coluna da Foto -->
          <div class="col-md-4 text-center mb-4">
            <div class="profile-photo-section">
              <div class="photo-container">
                <div v-if="!config.perfil.fotoUrl" class="avatar-placeholder">
                  {{ getUserInitials() }}
                </div>
                <img 
                  v-else 
                  :src="config.perfil.fotoUrl" 
                  alt="Foto de perfil" 
                  class="profile-photo"
                >
                <button class="btn btn-sm btn-primary photo-edit-btn" @click="alterarFoto">
                  <i class="ti ti-camera"></i>
                </button>
              </div>
              <p class="text-muted small mt-2">Clique para alterar sua foto</p>
              
              <!-- Botão de salvar foto -->
              <button 
                v-if="config.perfil.fotoUrl && fotoAlterada" 
                class="btn btn-sm btn-success mt-2" 
                @click="salvarFoto"
                :disabled="salvandoFoto"
              >
                <span v-if="salvandoFoto" class="spinner-border spinner-border-sm me-1" role="status"></span>
                <i v-else class="ti ti-device-floppy"></i>
                {{ salvandoFoto ? 'Salvando...' : '' }}
              </button>
              
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                style="display: none" 
                @change="handleFileUpload"
              >
            </div>
          </div>

          <!-- Coluna dos Dados -->
          <div class="col-md-8">
            <form @submit.prevent="salvarPerfil">
              <div class="row">
                <!-- Nome completo -->
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Nome Completo</label>
                  <input 
                    type="text" 
                    class="form-control form-control-readonly" 
                    :value="config.perfil.nome"
                    readonly
                  >
                  <small class="text-muted">Nome não pode ser alterado</small>
                </div>
                
                <!-- Email -->
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Email</label>
                  <input 
                    type="email" 
                    class="form-control form-control-readonly" 
                    :value="config.perfil.email"
                    readonly
                  >
                  <small class="text-muted">Email não pode ser alterado</small>
                </div>

                <!-- Data de cadastro (readonly) -->
                <div class="col-12 mb-3">
                  <label class="form-label fw-medium">Aluno desde</label>
                  <input 
                    type="text" 
                    class="form-control form-control-readonly" 
                    value="2025"
                    readonly
                  >
                </div>
              </div>

              <!-- Botão de salvar removido - redundante -->
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÃO 2: SEGURANÇA DA CONTA -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-light">
        <h5 class="mb-0 d-flex align-items-center">
          <i class="ti ti-shield-lock me-2 text-success"></i>
          Segurança da Conta
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Alterar Senha -->
          <div class="col-md-8 mx-auto mb-4">
            <div class="security-item">
              <h6 class="fw-medium mb-2">Alterar Senha</h6>
              <p class="text-muted small mb-3">Mantenha sua conta segura com uma senha forte</p>
              
              <form @submit.prevent="alterarSenha">
                <div class="mb-3">
                  <label class="form-label">Senha Atual</label>
                  <div class="input-group">
                    <input 
                      :type="mostrarSenhaAtual ? 'text' : 'password'" 
                      class="form-control" 
                      v-model="senhaAtual"
                      placeholder="Digite sua senha atual"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button" 
                      @click="mostrarSenhaAtual = !mostrarSenhaAtual"
                    >
                      <i :class="mostrarSenhaAtual ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Nova Senha</label>
                  <div class="input-group">
                    <input 
                      :type="mostrarNovaSenha ? 'text' : 'password'" 
                      class="form-control" 
                      v-model="novaSenha"
                      placeholder="Digite sua nova senha"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button" 
                      @click="mostrarNovaSenha = !mostrarNovaSenha"
                    >
                      <i :class="mostrarNovaSenha ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                    </button>
                  </div>
                  
                  <!-- Indicador de força da senha -->
                  <div v-if="novaSenha" class="mt-2">
                    <div class="progress" style="height: 4px;">
                      <div 
                        class="progress-bar" 
                        :class="corForcaSenha" 
                        :style="{ width: forcaSenha + '%' }"
                      ></div>
                    </div>
                    <small class="text-muted">{{ textoForcaSenha }}</small>
                    <div v-if="forcaSenha < 60" class="text-warning small mt-1">
                      <i class="ti ti-info-circle me-1"></i>
                      Senha deve ter pelo menos 8 caracteres, letras maiúsculas, minúsculas e números
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Confirmar Nova Senha</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    :class="{ 'is-invalid': confirmarSenha && novaSenha && confirmarSenha !== novaSenha }"
                    v-model="confirmarSenha"
                    placeholder="Confirme sua nova senha"
                  >
                  <div v-if="confirmarSenha && novaSenha && confirmarSenha !== novaSenha" class="text-danger small mt-1">
                    <i class="ti ti-x me-1"></i>
                    As senhas não coincidem
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-success"
                  :disabled="!podeAlterarSenha || alterandoSenha"
                >
                  <span v-if="alterandoSenha" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="ti ti-lock me-2"></i>
                  {{ alterandoSenha ? 'Alterando...' : 'Alterar Senha' }}
                </button>
              </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { currentUser, updateUserProfile, alterarSenhaUsuario } = useAuth()

// Estados reativos
const mostrarSucesso = ref(false)
const mensagemSucesso = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const salvandoFoto = ref(false)
const fotoAlterada = ref(false)

// Estados para senha
const senhaAtual = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')
const mostrarSenhaAtual = ref(false)
const mostrarNovaSenha = ref(false)
const alterandoSenha = ref(false)

// Configurações do perfil
const config = reactive({
  perfil: {
    nome: '',
    email: '',
    fotoUrl: ''
  }
})



// Carregar dados do usuário
onMounted(() => {
  if (currentUser.value) {
    config.perfil.nome = currentUser.value.nome || ''
    config.perfil.email = currentUser.value.email || ''
    config.perfil.fotoUrl = currentUser.value.fotoUrl || ''
  }
})

// Obter iniciais do usuário
const getUserInitials = () => {
  if (!config.perfil.nome) return 'U'
  return config.perfil.nome
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Alterar foto
const alterarFoto = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Upload de arquivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      config.perfil.fotoUrl = e.target?.result as string
      fotoAlterada.value = true
    }
    reader.readAsDataURL(file)
  }
}

// Salvar foto no banco
const salvarFoto = async () => {
  if (!currentUser.value?.id || !config.perfil.fotoUrl) return
  
  salvandoFoto.value = true
  
  try {
    // Chamar API para atualizar foto
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Alunos/${currentUser.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FotoUrl: config.perfil.fotoUrl
      })
    })
    
    if (response.ok) {
      mostrarMensagem('Foto salva com sucesso!')
      fotoAlterada.value = false
      
      // Atualizar dados do usuário no localStorage
      const userData = { 
        ...currentUser.value, 
        fotoUrl: config.perfil.fotoUrl 
      }
      updateUserProfile(userData)
    } else {
      throw new Error('Erro ao salvar foto')
    }
  } catch (error) {
    console.error('Erro ao salvar foto:', error)
    mostrarMensagem('Erro ao salvar foto. Tente novamente.', 'error')
  } finally {
    salvandoFoto.value = false
  }
}

// Salvar perfil
const salvarPerfil = () => {
  if (currentUser.value) {
    const userData = { 
      ...currentUser.value, 
      fotoUrl: config.perfil.fotoUrl 
    }
    updateUserProfile(userData)
  }
  
  mostrarMensagem('Perfil atualizado com sucesso!')
}



// Força da senha
const forcaSenha = computed(() => {
  if (!novaSenha.value) return 0
  
  let pontos = 0
  
  // Comprimento
  if (novaSenha.value.length >= 8) pontos += 25
  if (novaSenha.value.length >= 12) pontos += 25
  
  // Maiúsculas e minúsculas
  if (/[a-z]/.test(novaSenha.value) && /[A-Z]/.test(novaSenha.value)) pontos += 25
  
  // Números
  if (/\d/.test(novaSenha.value)) pontos += 15
  
  // Caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha.value)) pontos += 10
  
  return Math.min(pontos, 100)
})

const corForcaSenha = computed(() => {
  if (forcaSenha.value < 30) return 'bg-danger'
  if (forcaSenha.value < 60) return 'bg-warning'
  return 'bg-success'
})

const textoForcaSenha = computed(() => {
  if (forcaSenha.value < 30) return 'Senha fraca'
  if (forcaSenha.value < 60) return 'Senha média'
  return 'Senha forte'
})

const podeAlterarSenha = computed(() => {
  return senhaAtual.value && 
         novaSenha.value && 
         confirmarSenha.value && 
         novaSenha.value === confirmarSenha.value &&
         novaSenha.value !== senhaAtual.value &&
         novaSenha.value.length >= 8 &&
         forcaSenha.value >= 60 &&
         !alterandoSenha.value
})

// Alterar senha
const alterarSenha = async () => {
  if (!podeAlterarSenha.value) return
  
  alterandoSenha.value = true
  
  try {
    const resultado = await alterarSenhaUsuario(senhaAtual.value, novaSenha.value)
    
    if (resultado.success) {
      mostrarMensagem('Senha alterada com sucesso!')
      // Limpar campos
      senhaAtual.value = ''
      novaSenha.value = ''
      confirmarSenha.value = ''
    } else {
      mostrarMensagem(resultado.message || 'Erro ao alterar senha', 'error')
    }
  } catch (error) {
    mostrarMensagem('Erro ao alterar senha. Tente novamente.', 'error')
  } finally {
    alterandoSenha.value = false
  }
}



// Mostrar mensagem
const mostrarMensagem = (mensagem: string, tipo: 'success' | 'error' = 'success') => {
  mensagemSucesso.value = mensagem
  mostrarSucesso.value = true
  
  setTimeout(() => {
    mostrarSucesso.value = false
  }, 5000)
}

// Fechar mensagem
const fecharMensagem = () => {
  mostrarSucesso.value = false
}
</script>

<style scoped>
.perfil-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Foto de perfil */
.profile-photo-section {
  position: relative;
}

.photo-container {
  position: relative;
  display: inline-block;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  border: 4px solid #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.photo-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Cards */
.card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
}

/* Campos readonly */
.form-control-readonly {
  background-color: #f8f9fa;
  border-color: #e9ecef;
  cursor: not-allowed;
}

.form-control-readonly:focus {
  background-color: #f8f9fa;
  border-color: #e9ecef;
  box-shadow: none;
}

/* Seção de segurança */
.security-item {
  padding: 0;
}

.security-info .info-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* Botões */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .perfil-container {
    padding: 15px;
  }
  
  .page-header {
    padding: 15px;
  }
  
  .profile-photo,
  .avatar-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .avatar-placeholder {
    font-size: 2rem;
  }
  
  .col-md-4,
  .col-md-6,
  .col-md-8 {
    margin-bottom: 20px;
  }
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.5s ease-out;
}
</style> 