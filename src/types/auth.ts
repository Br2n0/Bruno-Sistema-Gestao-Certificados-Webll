// Tipos do sistema de autenticação
export type UserRole = 'user' | 'admin' | 'super-admin'

export interface User {
  id: string
  nome: string
  email: string
  telefone?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  lastLogin?: Date
}

export interface RegisterForm {
  nome: string
  email: string
  telefone: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface LoginForm {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

export interface ValidationError {
  field: string
  message: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  errors?: ValidationError[]
  message?: string
}

// Configurações de roles
export const ROLE_PERMISSIONS = {
  'user': {
    canViewCourses: true,
    canViewCertificates: true,
    canEditProfile: true,
    canAccessAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canManageAdmins: false,
    canManageSystem: false
  },
  'admin': {
    canViewCourses: true,
    canViewCertificates: true,
    canEditProfile: true,
    canAccessAdmin: true,
    canManageUsers: true,
    canManageCourses: true,
    canManageAdmins: false,
    canManageSystem: false
  },
  'super-admin': {
    canViewCourses: true,
    canViewCertificates: true,
    canEditProfile: true,
    canAccessAdmin: true,
    canManageUsers: true,
    canManageCourses: true,
    canManageAdmins: true,
    canManageSystem: true
  }
} as const

// Tipo para todas as permissões
export type Permission = keyof typeof ROLE_PERMISSIONS.user 