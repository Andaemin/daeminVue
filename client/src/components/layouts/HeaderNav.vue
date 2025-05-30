<script setup>
import cafverseLogo from '../../assets/cafverse_logo_white.png'
// import { useRouter } from 'vue-router'

// const router = useRouter()

// const logout = () => {
//   router.push({ name: login })
// }
</script>
<template>
  <v-app-bar color="transparent" flat>
    <!-- 좌측 로고 -->
    <v-toolbar-title class="d-flex">
      <router-link to="/home" class="d-flex-column">
        <v-img :src="cafverseLogo" width="40" height="40" contain />
        <span class="text-h6 font-weight-bold">
          <span class="green">CaF</span><span class="blue">Verse</span>
        </span>
      </router-link>
    </v-toolbar-title>
    <!-- 우측 컴포넌트-->
  </v-app-bar>
</template>
