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
      path: '/gongsa',
      name: 'gongsa',
      component: () => import('../views/GongsaView.vue'),
      props: true,
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView,
      props: true,
    },
    {
      path: '/home',
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
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterChoiseView.vue'),
      props: true,
    },
    {
      path: '/registerChoise',
      name: 'registerChoise',
      component: () => import('../views/RegisterView.vue'),
      props: true,
    },
    {
      path: '/boardview',
      name: 'boardview',
      component: () => import('../views/boardView.vue'),
      props: true,
    },
  ],
})

export default router
