<script setup>
import { useUserStore } from '@/store/UserStore'

const userStore = useUserStore()
</script>

<template>
  <v-container>
    <div class="about">
      <h1>{{ userStore.username }} props 테스트용 .</h1>
      <router-link :to="{ name: 'home', params: { username: userStore.username || 'default' } }">
        <v-btn color="primary"> 이동 </v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<style></style>
