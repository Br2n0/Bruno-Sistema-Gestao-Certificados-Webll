import type { ValidationError, RegisterForm, LoginForm } from '@/types/auth'

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha
export const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (password.length < 6) {
    errors.push({ field: 'password', message: 'A senha deve ter pelo menos 6 caracteres' })
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'A senha deve conter pelo menos uma letra' })
  }
  
  if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'A senha deve conter pelo menos um número' })
  }
  
  return errors
}

// Validação de telefone (formato brasileiro)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
  return phoneRegex.test(phone)
}

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  
  return phone
}

// Validação do formulário de registro
export const validateRegisterForm = (form: RegisterForm): ValidationError[] => {
  const errors: ValidationError[] = []
  
  // Validação do nome
  if (!form.nome.trim()) {
    errors.push({ field: 'nome', message: 'O nome é obrigatório' })
  } else if (form.nome.trim().length < 2) {
    errors.push({ field: 'nome', message: 'O nome deve ter pelo menos 2 caracteres' })
  }
  
  // Validação do email
  if (!form.email.trim()) {
    errors.push({ field: 'email', message: 'O email é obrigatório' })
  } else if (!validateEmail(form.email)) {
    errors.push({ field: 'email', message: 'Por favor, insira um email válido' })
  }
  
  // Validação do telefone
  if (!form.telefone.trim()) {
    errors.push({ field: 'telefone', message: 'O telefone é obrigatório' })
  } else if (!validatePhone(form.telefone)) {
    errors.push({ field: 'telefone', message: 'Por favor, insira um telefone válido: (00) 00000-0000' })
  }
  
  // Validação da senha
  if (!form.password) {
    errors.push({ field: 'password', message: 'A senha é obrigatória' })
  } else {
    errors.push(...validatePassword(form.password))
  }
  
  // Validação da confirmação de senha
  if (!form.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'A confirmação de senha é obrigatória' })
  } else if (form.password !== form.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' })
  }
  
  // Validação dos termos
  if (!form.terms) {
    errors.push({ field: 'terms', message: 'Você deve aceitar os termos de uso' })
  }
  
  return errors
}

// Validação do formulário de login
export const validateLoginForm = (form: LoginForm): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (!form.email.trim()) {
    errors.push({ field: 'email', message: 'O email é obrigatório' })
  } else if (!validateEmail(form.email)) {
    errors.push({ field: 'email', message: 'Por favor, insira um email válido' })
  }
  
  if (!form.password) {
    errors.push({ field: 'password', message: 'A senha é obrigatória' })
  }
  
  return errors
}

// Simulação de hash de senha (em produção usar bcrypt)
export const hashPassword = async (password: string): Promise<string> => {
  // Simular delay de hash
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Simular hash (em produção usar bcrypt)
  return btoa(password + '_salt_habeis')
}

// Verificação de senha
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}

// Geração de token JWT simulado
export const generateToken = (userId: string): string => {
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }
  
  return btoa(JSON.stringify(payload))
}

// Verificação de token
export const verifyToken = (token: string): { userId: string; valid: boolean } => {
  try {
    const payload = JSON.parse(atob(token))
    const isValid = payload.exp > Date.now()
    
    return {
      userId: payload.userId,
      valid: isValid
    }
  } catch {
    return { userId: '', valid: false }
  }
}

// Geração de ID único
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
} 