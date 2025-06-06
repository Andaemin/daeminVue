<script setup>
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/UserStore'
import { useRegisterStore } from '../store/RegisterChoiseStore.js'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import SubmitCard from '@/components/base/SubmitCard.vue'
// import sproutMulumm from '../assets/sprout_mulumm.png'
import sproutSmile from '../assets/sprout_smile.png'

// const handleSelect = (role) => {
//   registerStore.setRole(role)
//   router.push('/role-form')

// import gaein from '../assets/gaeincaf.png'
// import kalrum from '../assets/kalrum.png'
// import pran from '../assets/starbuck_mejang'

const router = useRouter()
// const userStore = useUserStore()
const registerStore = useRegisterStore()
const registerData = [
  {
    title: '저는 개인 카페에서 종사해요!',
    image: '../../src/assets/gaeincaf.png',
    value: 'gaein',
  },
  {
    title: '저는 프렌차이즈 가맹점에서 종사해요!',
    image: '../../src/assets/starbuck_mejang.png',
    value: 'pran',
  },
  { title: '커피 회사에 종사해요!', image: '../../src/assets/bonsa.png', value: 'company' },
  {
    title: '카페관련해서 글을 써요! ',
    image: '../../src/assets/kalrum.png',
    value: 'kalrum',
  },
  { title: '그냥 커피가 좋아요.', image: '../../src/assets/lovecaffee.png', value: 'kalrum' },
]

// import { onMounted, ref } from 'vue'
// import axios from 'axios'
// const test = ref([])

// onMounted(() => {
//   try { f
//     const res = axios('/api/resister')
//   } catch (err) {
//     console.error(err)
//   }
// })
const handleSelect = (role) => {
  console.log('확인용임', role)
  registerStore.setRole(role)
  // router.push('/registerChoise')
  // router.push({ name : 'registerChoise'})
  if (role === 'gaein' || role === 'pran') {
    router.push('/registerChoise')
  } else {
    router.push('/gongsa')
  }
}
</script>
<template>
  <HeaderNav />
  <v-container class="d-flex justify-center align-center h-screen bg-caf-navy ma-0" fluid>
    <v-container
      class="d-flex flex-column align-center justify-center text-white py-10"
      style="background-color: #2d3e50"
    >
      <h2 class="text-h5 font-weight-bold text-center">
        당신을 <span class="blue">자세히</span> 알고싶어요. 당신은
        <span class="green">어떤</span> 사람인가요?
      </h2>
      <v-img width="140" height="140" class="ma-6" :src="sproutSmile"></v-img>
      <v-row justify="center" align="center" class="gap-4">
        <SubmitCard
          class="ma-2"
          v-for="role in registerData"
          :key="role.value"
          :title="role.title"
          :image="role.image"
          :value="role.value"
          @select="handleSelect"
        ></SubmitCard>
      </v-row>
    </v-container>
  </v-container>
</template>
