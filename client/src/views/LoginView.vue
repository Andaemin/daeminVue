<script setup>
import SubmitBtn from '@/components/base/SubmitBtn.vue'
</script>
<template>
  <v-container class="d-flex justify-center align-center h-screen bg-caf-navy ma-0" fluid>
    <v-card class="d-flex mb-6 w-75 h-50" color="indigo-darken-3" variant="outlined">
      <v-sheet :max-width="400" class="ma-2 pa-2 me-auto" variant="">
        <v-card-text class="text-h3 font-weight-black">CaFverse 찾아주셔서 감사해요!</v-card-text>
        <v-card-text class="text-h3 font-weight-black">ID를 입력해주세요!</v-card-text>
      </v-sheet>
      <v-sheet :max-width="400">
        <v-text-field class="" label="Username" variant="outlined"></v-text-field>
        <v-text-field label="Password" type="password" variant="outlined"></v-text-field>
        <SubmitBtn></SubmitBtn>
        <v-card-text class="gsapBox">
          뭔데 아직도 계정이 없으세요?
          <b class="linker"><router-link :to="{ name: 'login' }"> 지금 계정 만들기</router-link></b>
        </v-card-text>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<style scoped></style>
