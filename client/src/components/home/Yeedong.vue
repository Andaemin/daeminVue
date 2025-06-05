<script setup>
import SubmitBtn from '../base/SubmitBtn.vue'
</script>
<template>
  <v-card class="d-flex justify-center align-center w-66 pa-4" variant="transparent">
    <v-col class="pa-8">
      <v-card-text class="text-h6 text-white font-weight-bold">이동용</v-card-text>
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
    </v-col>
    <v-col class="pa-8 border-s-md">
      <v-card-text class="text-h6 text-white font-weight-bold">게시판 확인용.</v-card-text>
      <v-row>
        <SubmitBtn color="primary" :to="{ name: 'forum' }">포럼메인</SubmitBtn>
        <v-card-text class="text-white">포럼 메인으로 이동.</v-card-text>
      </v-row>
      <v-row>
        <SubmitBtn :to="{ name: 'postlist' }">게시글</SubmitBtn>
        <v-card-text class="text-white">게시글 템플릿으로 이동.</v-card-text>
      </v-row>
    </v-col>
  </v-card>
</template>
