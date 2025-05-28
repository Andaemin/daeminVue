<script setup>
import { useUserStore } from '@/store/UserStore'
import SideNav from '@/components/layouts/SideNav.vue'
const userStore = useUserStore()
</script>

<template>
  <v-container>
    <v-row>
      <router-link :to="{ name: 'about', params: { username: userStore.username || 'default' } }">
        <v-btn color="primary">이동 실험.</v-btn>
      </router-link>
      <h1 v-if="['nayeon', '나연', '임나연', 'yimnayeon'].includes(userStore.username)">
        어머 {{ userStore.username }} 님?! 여기에 와주신건가요 너무 반가워요?
      </h1>
      <h1 v-else>{{ userStore.username }} 님 어서오세요</h1>
      <SideNav />
    </v-row>
  </v-container>
</template>
