<script setup>
import SubmitBtn from '@/components/base/SubmitBtn.vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
</script>
<template>
  <HeaderNav />
  <v-container class="d-flex justify-center align-center h-screen bg-caf-navy ma-0" fluid>
    <v-card class="d-flex mb-6 w-75 h-50" color="indigo-darken-3" variant="transparent">
      <v-sheet
        class="d-flex-column align-center text-white bg-transparent ma-2 pa-2 me-auto"
        variant=""
      >
        <v-card-title class="text-h4 font-weight-black"
          >CaFverse ID를 입력해주세요 <br />이용을 위해 부탁드려요!</v-card-title
        >
        <v-card-subtitle class="text-subtitle-1/2 font-weight-bold"
          >원활한 이용을 위해서는 로그인 하는것을 권장드려요<br /><span class="bold"> BUT</span>,
          CaFVerse는 로그인 하지 않아도 여러분들을 환영해요!</v-card-subtitle
        >
      </v-sheet>
      <v-sheet
        class="flex-1 ma-2 pa-2 d-flex-column justify-center align-center bg-transparent text-white"
      >
        <v-text-field class="" label="Username" model-value=" " variant="outlined"></v-text-field>
        <v-text-field
          label="Password"
          type="password"
          model-value=" "
          variant="outlined"
        ></v-text-field>
        <SubmitBtn :to="{ name: 'join' }" class="font-weight-bold"><slot>Login</slot></SubmitBtn>
        <v-card-text class="gsapBox">
          뭔데 아직도 계정이 없으세요?
          <span class="linker"
            ><router-link :to="{ name: 'login' }"> 지금 계정 만들기</router-link></span
          >
        </v-card-text>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<style scoped></style>
