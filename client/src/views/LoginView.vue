<script setup>
import SubmitBtn from '@/components/base/SubmitBtn.vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/login'
import sproutSmile from '@/assets/sprout_smile.png'
// import { defaultImage } from '../assets/user_default.png'
import axios from 'axios'
const router = useRouter()
const loginStore = useLoginStore()

console.log('loginStore:', loginStore)
console.log('setLogin:', loginStore.setLogin)

const userId = ref('')
const password = ref('')
const errorMsg = ref('')

const login = async () => {
  try {
    const res = await axios.post('/api/login', {
      userId: userId.value,
      password: password.value,
    })
    console.log('서버 응답 전체:', res.data)
    console.log('사용자 데이터:', res.data.user)
    console.log('job:', res.data.user?.job)
    console.log('brand:', res.data.user?.brand)

    if (res.data.token && res.data.user) {
      loginStore.setLogin(res.data.user, res.data.token)
      console.log('store에 저장된 user:', loginStore.user)
      router.push('/home')
    } else {
      errorMsg.value = res.data.message || '로그인 실패'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = '❌ 제대로 안보노?'
  }
}
</script>
<template>
  <HeaderNav />
  <v-container class="d-flex justify-center align-center h-screen bg-caf-navy ma-0" fluid>
    <v-card
      v-if="loginStore.isLoggedIn"
      class="d-flex justify-center mb-66 w-33"
      color="indigo-darken-3"
      variant="transparent"
    >
      <span v-if="loginStore.user?.nickname === 'nayeoni'" class="text-h6 blue">
        <v-img class="w-100" :src="sproutSmile" width="140" height="140"></v-img>
        <span class="green">'{{ loginStore.user.nickname }} '</span> 님!, 이미 로그인되어
        있어요!!<br />
        <span>편하게 이용해주세요 😊</span>
      </span>
      <span v-else class="text-h6 blue">
        <span class="blue">하.... 너는 니가 로그인 되어있는줄도몰라?</span>
      </span>
    </v-card>
    <v-card v-else class="d-flex mb-6 w-66 h-50" color="indigo-darken-3" variant="transparent">
      <v-sheet
        class="d-flex-column align-center text-white bg-transparent ma-2 pa-2 me-auto"
        variant=""
      >
        <v-card-title class="text-h4 font-weight-black"
          ><span class="green font-weight-black">CaF</span><span class="blue">Verse</span> ID를
          입력해주세요 <br />이용을 위해 부탁드려요!</v-card-title
        >
        <v-card-subtitle class="text-subtitle-1/2 font-weight-bold"
          >원활한 이용을 위해서는 로그인 하는것을 권장드려요<br /><span class="bold"> BUT</span>,
          CaFVerse는 로그인 하지 않아도 여러분들을 환영해요!</v-card-subtitle
        >
      </v-sheet>
      <v-sheet
        class="flex-1 ma-2 pa-2 d-flex-column justify-center align-center bg-transparent text-white"
      >
        <v-text-field class="" label="Username" v-model="userId" variant="outlined"></v-text-field>
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
          variant="outlined"
        ></v-text-field>
        <SubmitBtn @click="login" class="font-weight-bold">Login</SubmitBtn>
        <span class="red" style="font-size: 14px">{{ errorMsg }}</span>
        <v-card-text class="gsapBox">
          뭔데 아직도 계정이 없으세요?
          <span class="linker"
            ><router-link :to="{ name: 'register' }"> 지금 계정 만들기</router-link></span
          >
        </v-card-text>
      </v-sheet>
    </v-card>
  </v-container>
</template>
<style scoped></style>
