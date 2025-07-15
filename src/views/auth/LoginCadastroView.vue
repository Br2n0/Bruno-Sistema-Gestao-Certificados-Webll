<template>
  <div class="auth-fullscreen">
    <div class="auth-container">
      <!-- Logo centralizada acima dos ícones -->
      <div class="auth-logo-header">
        <img src="../../assets/imagens/logotipo.png" alt="Hábeis Educacional">
      </div>
      
      <!-- Container das duas seções -->
      <div class="auth-sections">
        <!-- Seção de Cadastro -->
        <div class="auth-section register-section">
          <div class="auth-card">
            <div class="auth-header">
              <div class="auth-icon register-icon">
                <i class="ti ti-user-plus"></i>
              </div>
              <h2>Crie sua conta gratuita e comece sua jornada de aprendizado!</h2>
            </div>

            <!-- Botão Google -->
            <div class="social-buttons">
              <button class="btn btn-google" @click="handleGoogleRegister">
                <i class="ti ti-brand-google"></i>
                Cadastrar com Google
              </button>
            </div>

            <!-- Formulário de cadastro -->
            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  v-model="registerForm.nome"
                  placeholder="Seu nome completo"
                  :class="{ 'error': registerValidation.nome }"
                  required
                >
                <div v-if="registerValidation.nome" class="field-error">{{ registerValidation.nome }}</div>
              </div>

              <div class="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  v-model="registerForm.email"
                  placeholder="seu@email.com"
                  :class="{ 'error': registerValidation.email }"
                  required
                >
                <div v-if="registerValidation.email" class="field-error">{{ registerValidation.email }}</div>
              </div>

              <div class="form-group">
                <label>Celular</label>
                <input
                  type="tel"
                  v-model="registerForm.telefone"
                  placeholder="(00) 00000-0000"
                  :class="{ 'error': registerValidation.telefone }"
                  @blur="formatPhoneNumber"
                  required
                >
                <div v-if="registerValidation.telefone" class="field-error">{{ registerValidation.telefone }}</div>
              </div>

              <div class="form-group">
                <label>Senha cadastro</label>
                <div class="password-input">
                  <input
                    :type="showRegisterPassword ? 'text' : 'password'"
                    v-model="registerForm.password"
                    placeholder="Crie uma senha forte"
                    :class="{ 'error': registerValidation.password }"
                    required
                  >
                  <button
                    type="button"
                    @click="showRegisterPassword = !showRegisterPassword"
                    class="password-toggle"
                  >
                    <i :class="showRegisterPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                  </button>
                </div>
                <div v-if="registerValidation.password" class="field-error">{{ registerValidation.password }}</div>
                <div class="password-requirements">
                  <small>• Mínimo de 6 caracteres</small>
                  <small>• Mínimo de 1 letra</small>
                  <small>• Mínimo de 1 número</small>
                </div>
              </div>

              <div class="form-group">
                <label>Confirmar senha</label>
                <div class="password-input">
                  <input
                    :type="showRegisterPassword ? 'text' : 'password'"
                    v-model="registerForm.confirmPassword"
                    placeholder="Confirme sua senha"
                    :class="{ 'error': registerValidation.confirmPassword }"
                    required
                  >
                </div>
                <div v-if="registerValidation.confirmPassword" class="field-error">{{ registerValidation.confirmPassword }}</div>
              </div>

              <div class="form-check">
                <input
                  type="checkbox"
                  v-model="registerForm.terms"
                  class="form-check-input"
                  required
                >
                <label class="form-check-label">
                  Ao se cadastrar, você concorda com nossos 
                  <a href="#" class="terms-link">Termos de Uso</a> 
                  e aceita receber comunicações da nossa plataforma.
                </label>
              </div>

              <button type="submit" class="btn btn-primary btn-register" :disabled="isRegisterLoading">
                <span v-if="isRegisterLoading" class="spinner"></span>
                {{ isRegisterLoading ? 'Cadastrando...' : 'Cadastrar' }}
              </button>

              <div v-if="registerError" class="error-message">{{ registerError }}</div>
            </form>
          </div>
        </div>

        <!-- Seção de Login -->
        <div class="auth-section login-section">
          <div class="auth-card">
            <div class="auth-header">
              <div class="auth-icon login-icon">
                <i class="ti ti-login"></i>
              </div>
              <h2>Acesse sua conta e continue explorando nossos cursos!</h2>
            </div>

            <!-- Botão Google -->
            <div class="social-buttons">
              <button class="btn btn-google" @click="handleGoogleLogin">
                <i class="ti ti-brand-google"></i>
                Entrar com Google
              </button>
            </div>

            <!-- Formulário de login -->
            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  v-model="loginForm.email"
                  placeholder="seu@email.com"
                  :class="{ 'error': loginValidation.email }"
                  required
                >
                <div v-if="loginValidation.email" class="field-error">{{ loginValidation.email }}</div>
              </div>

              <div class="form-group">
                <label>Senha</label>
                <div class="password-input">
                  <input
                    :type="showLoginPassword ? 'text' : 'password'"
                    v-model="loginForm.password"
                    placeholder="Digite sua senha"
                    required
                  >
                  <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="password-toggle"
                  >
                    <i :class="showLoginPassword ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-login" :disabled="isLoginLoading">
                <span v-if="isLoginLoading" class="spinner"></span>
                {{ isLoginLoading ? 'Entrando...' : 'Entrar' }}
              </button>

              <div v-if="loginError" class="error-message">{{ loginError }}</div>

              <div class="forgot-password">
                <a href="#" @click="showForgotPassword = true">Esqueceu a senha?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, register } = useAuth()

// Estados dos formulários
const showRegisterPassword = ref(false)
const showLoginPassword = ref(false)
const showForgotPassword = ref(false)
const isRegisterLoading = ref(false)
const isLoginLoading = ref(false)
const registerError = ref('')
const loginError = ref('')

// Importar funções de validação
import { validateEmail, validatePassword, validatePhone, formatPhone } from '@/utils/autenticacao'

// Formulários
const registerForm = reactive({
  nome: '',
  email: '',
  telefone: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const loginForm = reactive({
  email: '',
  password: ''
})

// Validação em tempo real para cadastro
const registerValidation = computed(() => {
  const errors: Record<string, string> = {}
  
  // Validar nome
  if (registerForm.nome.trim() && registerForm.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres'
  }
  
  // Validar email
  if (registerForm.email && !validateEmail(registerForm.email)) {
    errors.email = 'Email inválido'
  }
  
  // Validar telefone
  if (registerForm.telefone && !validatePhone(registerForm.telefone)) {
    errors.telefone = 'Telefone deve estar no formato (00) 00000-0000'
  }
  
  // Validar senha
  if (registerForm.password) {
    const passwordErrors = validatePassword(registerForm.password)
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0].message
    }
  }
  
  // Validar confirmação de senha
  if (registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
  }
  
  return errors
})

// Validação em tempo real para login
const loginValidation = computed(() => {
  const errors: Record<string, string> = {}
  
  // Validar email
  if (loginForm.email && !validateEmail(loginForm.email)) {
    errors.email = 'Email inválido'
  }
  
  return errors
})

// Formatação automática do telefone
const formatPhoneNumber = () => {
  registerForm.telefone = formatPhone(registerForm.telefone)
}

// Handlers de login
const handleLogin = async () => {
  loginError.value = ''
  isLoginLoading.value = true
  
  try {
    const result = await login(loginForm.email, loginForm.password)
    
    if (result.success) {
      // Definir redirecionamento baseado no tipo de usuário
      const redirect = router.currentRoute.value.query.redirect as string
      
      if (redirect) {
        // Se há uma rota de redirecionamento específica, usar ela
        router.push(redirect)
      } else {
        // Redirecionamento baseado no role do usuário
        const userRole = result.user?.role
        
        if (userRole === 'super-admin' || userRole === 'admin') {
          // Admins vão para página inicial com acesso completo
          router.push('/')
        } else {
          // Usuários comuns vão para cursos
          router.push('/cursos')
        }
      }
    } else {
      // Mostrar erros de validação ou mensagem geral
      if (result.errors && result.errors.length > 0) {
        loginError.value = result.errors.map(err => err.message).join(', ')
      } else {
        loginError.value = result.message || 'Email ou senha inválidos'
      }
    }
  } catch (err) {
    loginError.value = 'Erro ao fazer login. Tente novamente.'
  } finally {
    isLoginLoading.value = false
  }
}

// Handlers de registro
const handleRegister = async () => {
  registerError.value = ''
  isRegisterLoading.value = true
  
  try {
    const result = await register(registerForm)
    
    if (result.success) {
      // Após registro, redirecionar para cursos (usuários novos são sempre 'user')
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/cursos')
    } else {
      // Mostrar erros de validação ou mensagem geral
      if (result.errors && result.errors.length > 0) {
        registerError.value = result.errors.map(err => err.message).join(', ')
      } else {
        registerError.value = result.message || 'Erro ao criar conta'
      }
    }
    
  } catch (err) {
    registerError.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    isRegisterLoading.value = false
  }
}

// Handlers de login social (para implementação futura)
const handleGoogleLogin = () => {
  console.log('Google login - implementar futuramente')
}

const handleGoogleRegister = () => {
  console.log('Google register - implementar futuramente')
}
</script>

<style scoped>
.auth-fullscreen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 15px;
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  position: relative;
}

.auth-logo-header {
  width: 100%;
  text-align: center;
  padding: 20px 0 15px 0;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.auth-logo-header img {
  height: 100px;
  width: auto;
}

.auth-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.auth-section {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.register-section {
  background: white;
  border-right: 1px solid #e5e7eb;
}

.login-section {
  background: white;
}

.auth-card {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 12px;
  min-height: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.auth-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  font-size: 20px;
  color: white;
  background: #4f46e5;
}

.register-icon {
  background: #4f46e5;
}

.login-icon {
  background: #4f46e5;
}

.auth-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.btn {
  padding: 9px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-google {
  background: #f8f9fa;
  color: #5f6368;
  border: 1px solid #dadce0;
}

.btn-google:hover {
  background: #f1f3f4;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
  margin-bottom: 2px;
}

.form-group input {
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.field-error {
  color: #dc2626;
  font-size: 11px;
  margin-top: 2px;
  padding-left: 2px;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}

.password-toggle:hover {
  color: #4f46e5;
}

.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-top: 1px;
}

.password-requirements small {
  color: #6b7280;
  font-size: 10px;
}

.form-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
}

.form-check-input {
  margin-top: 3px;
}

.form-check-label {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.3;
  text-align: left;
}

.terms-link {
  color: #4f46e5;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.btn-register,
.btn-login {
  padding: 9px 18px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 8px;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  text-align: center;
  padding: 6px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  margin-top: 4px;
}

.forgot-password {
  text-align: center;
  margin-top: 6px;
}

.forgot-password a {
  color: #4f46e5;
  text-decoration: none;
  font-size: 12px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 450px;
  }
  
  .auth-sections {
    grid-template-columns: 1fr;
  }
  
  .register-section {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .auth-section {
    padding: 15px 20px;
  }
  
  .auth-fullscreen {
    padding: 10px;
  }
  
  .auth-logo-header {
    padding: 12px 0 10px 0;
  }
  
  .auth-logo-header img {
    height: 80px;
  }
  
  .auth-header {
    min-height: 80px;
  }
}

@media (max-width: 480px) {
  .auth-section {
    padding: 12px 15px;
  }
  
  .auth-card {
    max-width: 100%;
  }
  
  .auth-logo-header img {
    height: 60px;
  }
  
  .auth-header {
    min-height: 70px;
  }
}
</style> 