<script setup>
// import { useUserStore } from '@/store/UserStore'
// import SideNav from '@/components/layouts/SideNav.vue'
// import SubmitBtn from '@/components/base/SubmitBtn.vue'
import Yeedong from '@/components/home/Yeedong.vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
// const userStore = useUserStore()
</script>

<template>
  <HeaderNav />
  <v-container class="d-flex justify-center h-screen w-100 bg-caf-navy ma-0 fill-height" fluid>
    <Yeedong />
  </v-container>
</template>
