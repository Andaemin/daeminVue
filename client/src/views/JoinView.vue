<script setup>
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/UserStore'
// import SubmitBtn from '@/components/base/SubmitBtn.vue'
import sproutcreature from '@/assets/sproutCreature_shadow.png'
import cafverseLogo from '@/assets/cafverse_logo.png'
import { onMounted } from 'vue'
import { gsap } from 'gsap'

// const mainRef = ref()

// const soonseo = gsap,timeline()

onMounted(() => {
  // 테스트용. 나중에 시간설정 하나씩하기.
  gsap.from('.gsapBox', {
    opacity: 0,
    y: 50,
    duration: 2.0,
    stagger: 0.5,
    ease: 'power2.out',
  })
})
</script>
<template>
  <v-container class="d-flex justify-center align-center h-screen">
    <v-sheet class="p5-wrap d-flex justify-center align-center d-flex flex-column h-50">
      <v-sheet class="gsapBox">
        <h1 class="text-h3 font-weight-black">Welcome To</h1>
        <v-sheet class="d-flex align-center">
          <h1 class="text-h3 font-weight-black">
            <b class="green">CaF</b><b class="blue">verse</b>!
          </h1>
          <v-img :width="80" :height="80" :src="cafverseLogo" />
        </v-sheet>
      </v-sheet>
      <v-sheet class="gsapBox">
        <v-card-text class="text-h5 pa-0">
          <b
            >우리의 <b class="green font-weight-black" style="font-size: 28px">피조물</b>을 보기위해
            방문한 여러분을 환영해요!</b
          >
        </v-card-text>
        <v-card-text class="text-h5 pa-0">
          <b
            >당신을 환영하는
            <b class="blue font-weight-black" style="font-size: 28px">SproutCreature</b>와 함께 같이
            시작해봐요!</b
          >
        </v-card-text>
      </v-sheet>
      <v-sheet class="gsapBox">
        <v-img :width="200" :height="200" :src="sproutcreature"></v-img>
      </v-sheet>

      <!-- 나중에 컴포넌트 따로 뺼것 -->
      <v-row class="gsapBox">
        <v-card max-width="400" height="100" link :to="{ name: 'home' }" class="ma-5 card-hover">
          <v-card-title>
            <b class="green">CaF</b><b class="blue">Verse</b> 에 대해서 알고싶어요!</v-card-title
          >
          <v-card-subtitle>여러 세계관을 알고, CaFverse에 대해서 알려줍니다.</v-card-subtitle>
        </v-card>
        <v-card max-width="400" height="100" link :to="{ name: 'home' }" class="ma-5 card-hover">
          <v-card-title> 여러 카페브랜드들의 이야기를 들려주세요!</v-card-title>
          <v-card-subtitle> 대형 프렌차이즈 커피브랜드의 이야기를 들려줍니다</v-card-subtitle>
        </v-card>
      </v-row>
      <v-card-text class="gsapBox"
        >로그인이 필요하신가요?
        <b class="linker"><router-link :to="{ name: 'login' }">로그인하기</router-link></b>
      </v-card-text>
    </v-sheet>
  </v-container>
</template>
<style scoped>
.card-hover {
  border: 2px solid transparent;
  transition: border-color 0.3s;
  border-radius: 8px;
}
.card-hover:hover {
  border-color: #2196f3;
}
</style>
