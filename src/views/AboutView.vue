<script setup>
import BasicNav from '../components/BasicNav.vue'
import { useUserStore } from '@/store/UserStore'
const userStore = useUserStore()
</script>
<template>
  <v-container>
    <BasicNav />
    <div class="about">
      <h1>{{ userStore.username }} This is an about page</h1>
      <router-link :to="{ name: 'home', params: { username: userStore.username || 'default' } }">
        <v-btn color="primary"> 이동 </v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<style></style>
