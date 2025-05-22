import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/certificados',
      name: 'certificados',
      //  // route level code-splitting
      //  // this generates a separate chunk (About.[hash].js) for this route
      //  // which is lazy-loaded when the route is visited.
      component: () => import('../views/certificados/IndexView.vue'),
    },
    {
      path: '/certificados/validar',
      name: 'validar-certificado',
      component: () => import('../views/certificados/ValidarView.vue'),
    },
    {
      path: '/certificados/:id',
      name: 'detalhe-certificado',
      component: () => import('../views/certificados/DetalheView.vue'),
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('../views/cursos/IndexView.vue'),
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('../views/configuracoes/IndexView.vue'),
    },
  ],
})

export default router
