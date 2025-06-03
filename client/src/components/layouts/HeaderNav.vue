<script setup>
import { useLoginStore } from '@/store/login'
import cafverseLogo from '@/assets/cafverse_logo_white.png'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import userDefault from '../../assets/user_default.png'

const loginStore = useLoginStore()
const router = useRouter()

const menu = ref(false)

const goToLogin = () => {
  router.push({ name: 'login' })
}

const goToProfile = () => {
  router.push({ name: 'profile' })
}

const handleLogout = () => {
  loginStore.logout()
  router.push({ name: 'login' })
}
</script>
<template>
  <v-app-bar color="transparent" class="" flat>
    <!-- 왼쪽 로고 -->
    <v-toolbar-title class="d-flex">
      <v-btn
        to="/home"
        variant="plain"
        class="d-flex align-center"
        style="text-transform: none; background-color: transparent; box-shadow: none"
      >
        <v-img :src="cafverseLogo" width="36" height="36" class="mr-2" />
        <span class="text-h6 font-weight-bold">
          <span class="green">CaF</span><span class="blue">Verse</span>
        </span>
      </v-btn>
    </v-toolbar-title>

    <v-spacer />

    <!-- 오른쪽: 로그인 상태에 따라 다르게 표시 -->
    <v-toolbar-items class="pa-8" v-if="loginStore.isLoggedIn">
      <v-menu v-model="menu" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="32">
              <v-img :src="loginStore.user?.profileImage || userDefault" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="goToProfile">
            <v-list-item-title>프로필 설정</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span v-if="loginStore.user.nickname === 'nayeoni'" class="ml-2 font-weight-bold white"
        ><span class="blue font-weight-bold"> 나연</span> 님! 너무나 환영해요.
      </span>
      <span v-else class="ml-2 font-weight-bold white">{{ loginStore.user?.nickname }}</span>
    </v-toolbar-items>

    <v-toolbar-items class="pa-8" v-else>
      <v-btn text @click="goToLogin" class="tx-caf-blue"><span class="blue">로그인</span></v-btn>
      <span class="white" style="font-size: 14px"> 로그인도 안했어?</span>
    </v-toolbar-items>
  </v-app-bar>
</template>
