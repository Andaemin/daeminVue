import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinView from '@/views/JoinView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/join',
    },
    {
      path: '/main/:username',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/about/:username',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      props: true,
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView,
      props: true,
    },
  ],
})

export default router
