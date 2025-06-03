<script setup>
// import { useUserStore } from '@/store/UserStore'
// import SideNav from '@/components/layouts/SideNav.vue'
import SubmitBtn from '@/components/base/SubmitBtn.vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
// const userStore = useUserStore()
</script>

<template>
  <HeaderNav />
  <v-container class="d-flex justify-center h-screen w-100 bg-caf-navy ma-0 fill-height" fluid>
    <v-card class="d-flex flex-column justify-center align-center pa-6" variant="transparent">
      <v-row class="bd-line">
        <v-btn :to="{ name: 'join' }" color="primary" class="mb-4">첫 화면으로 이동.</v-btn>
        <v-card-text class="text-white">이동 실험용</v-card-text>
      </v-row>
      <v-row>
        <SubmitBtn :to="{ name: 'gongsa' }">공사중</SubmitBtn>
        <v-card-text class="text-white">공사중으로 이동.</v-card-text>
      </v-row>
      <v-row>
        <SubmitBtn :to="{ name: 'login' }">로그인</SubmitBtn>
        <v-card-text class="text-white">로그인으로 이동.</v-card-text>
      </v-row>
      <v-row>
        <SubmitBtn :to="{ name: 'register' }">회원가입</SubmitBtn>
        <v-card-text class="text-white">회원가입으로 이동.</v-card-text>
      </v-row>
      <v-col>
        <v-card-text class="text-h6 text-white">게시판 확인용.</v-card-text>
        <v-row>
          <SubmitBtn :to="{ name: 'boardview' }">게시글</SubmitBtn>
          <v-card-text class="text-white">게시글 템플릿으로 이동.</v-card-text>
        </v-row>
      </v-col>
    </v-card>
  </v-container>
</template>
