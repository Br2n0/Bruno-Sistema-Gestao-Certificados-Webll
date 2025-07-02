import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🏠 Página inicial
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    
    // 🎓 Rotas de Cursos
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('../views/cursos/IndexView.vue'),
    },
    {
      path: '/cursos/buscar',
      name: 'cursos-buscar',
      component: () => import('../views/cursos/IndexView.vue'), // Reutiliza com filtro
    },
    {
      path: '/cursos/meus-cursos',
      name: 'meus-cursos',
      component: () => import('../views/cursos/IndexView.vue'), // Reutiliza com filtro
      meta: { requiresAuth: true }
    },
    
    // 📜 Rotas de Certificados
    {
      path: '/certificados',
      name: 'certificados',
      component: () => import('../views/certificados/IndexView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/certificados/andamento',
      name: 'certificados-andamento',
      component: () => import('../views/certificados/IndexView.vue'), // Reutiliza com filtro
      meta: { requiresAuth: true }
    },
    {
      path: '/certificados/progresso',
      name: 'certificados-progresso',
      component: () => import('../views/certificados/IndexView.vue'), // Reutiliza com filtro
      meta: { requiresAuth: true }
    },
    {
      path: '/certificados/:id',
      name: 'detalhe-certificado',
      component: () => import('../views/certificados/DetalheView.vue'),
    },
    
    // ⚙️ Configurações Pessoais
    {
      path: '/configuracoes',
      name: 'configuracoes',
      redirect: '/configuracoes/perfil'
    },
    {
      path: '/configuracoes/perfil',
      name: 'configuracoes-perfil',
      component: () => import('../views/configuracoes/IndexView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/configuracoes/notificacoes',
      name: 'configuracoes-notificacoes',
      component: () => import('../views/configuracoes/IndexView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/configuracoes/seguranca',
      name: 'configuracoes-seguranca',
      component: () => import('../views/configuracoes/IndexView.vue'),
      meta: { requiresAuth: true }
    },
    
    // 🛡️ Rotas Administrativas (só para admins)
    {
      path: '/admin/usuarios',
      name: 'admin-usuarios',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/cursos',
      name: 'admin-cursos',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/professores',
      name: 'admin-professores',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/certificados',
      name: 'admin-certificados',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/configuracoes',
      name: 'admin-configuracoes',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    
    // 🔐 Autenticação
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/configuracoes/IndexView.vue'), // Placeholder
    }
  ]
})

export default router
