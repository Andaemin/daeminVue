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
    // 🔥 포럼 관련 라우트들
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumChoiceView.vue'),
      props: true,
    },
    {
      path: '/forum/:category',
      name: 'boardview',
      component: () => import('../views/BoardView.vue'),
      props: true,
    },
    {
      path: '/forum/:category/:id',
      name: 'postDetail',
      component: () => import('../views/PostDetailView.vue'),
      props: true,
    },
    // 🔥 기존 라우트들 (호환성)
    {
      path: '/foruminfo',
      redirect: '/forum',
    },
    {
      path: '/postlist',
      name: 'postlist',
      component: () => import('../views/PostListView.vue'),
      props: true,
    },
    {
      path: '/forumchoice',
      redirect: '/forum',
    },
    // 🔥 Agora 라우트
    {
      path: '/agora',
      name: 'agora',
      component: () => import('../views/AgoraView.vue'),
      props: true,
    },
    // 🔥 프로필 라우트
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      props: true,
    },
  ],
})

export default router
