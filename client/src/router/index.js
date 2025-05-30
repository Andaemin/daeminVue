import { createRouter, createWebHistory } from 'vue-router'
import JoinView from '@/views/JoinView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/join',
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView,
      props: true,
    },
    {
      path: '/info',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      props: true,
    },
    {
      path: '/CafInfo',
      name: 'cafInfo',
      component: () => import('../views/CafView.vue'),
      props: true,
    },
  ],
})

export default router
