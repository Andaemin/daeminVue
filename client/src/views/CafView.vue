<script setup>
// import { useUserStore } from '@/store/UserStore'
// import SideNav from '@/components/layouts/SideNav.vue'
// import SubmitBtn from '@/components/base/SubmitBtn.vue'
import Yeedong from '@/components/home/Yeedong.vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { useLoginStore } from '@/store/login'
// const userStore = useUserStore()

const loginStore = useLoginStore()
</script>

<template>
  <HeaderNav />
  <v-container
    v-if="loginStore.user?.nickname === 'nayeoni'"
    class="d-flex flex-column justify-center h-screen w-100 bg-caf-navy ma-0 fill-height"
    fluid
  >
    <h1>{{ loginStore.user.nickname }} 님!. 여기는 'CafInfo' 입니다</h1>
    <Yeedong />
  </v-container>
  <v-container
    v-else
    class="d-flex justify-center h-screen w-100 bg-caf-navy ma-0 fill-height"
    fluid
  >
  </v-container>
</template>
