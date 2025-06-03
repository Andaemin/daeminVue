<script setup>
import { computed, ref } from 'vue'
import { useRegisterStore } from '@/store/RegisterChoiseStore'
import { useRouter } from 'vue-router'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import axios from 'axios'
// import sproutSmile from '@/assets/sprout_smile.png'
import gaeinphoto from '@/assets/gaeincaf.png'
import pranphoto from '@/assets/starbuck_mejang.png'
const registerStore = useRegisterStore()
const role = computed(() => registerStore.selectedRole)
const router = useRouter()

const name = ref('')
const userId = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const agreeDongil = ref(true)
const job = ref('')
const selectedBrand = ref('') // 프렌차이즈 전용임. 쓸지 안쓸지는 모름.

const errMsg = ref('')
const successMsg = ref('')

const jobs = ['직원', '점주', '바리스타', '건물주', '아르바이트생']
const brands = [
  '스타벅스',
  '블루보틀',
  '투썸플레이스',
  '이디야커피',
  '할리스커피',
  '탐앤탐스',
  '던킨도너츠',
  '블루포트 (명지 본관 1층)',
]

const roleImage = computed(() => {
  if (role.value === 'gaein') {
    return gaeinphoto
  } else return pranphoto
})

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    errMsg.value = '비밀번호가 일치하지 않아요.'
    return
  }

  try {
    const payload = {
      name: name.value,
      userId: userId.value,
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      agreeDongil: agreeDongil.value,
      role: role.value,
      job: job.value,
      brand: role.value === 'pran' ? selectedBrand.value : null,
    }

    const res = await axios.post('/api/register', payload)

    successMsg.value = '회원가입 테스트 성공하면 이거뜸'
    console.log(res.data)

    alert('성공!')
    router.push('/login')
  } catch (err) {
    errMsg.value = err.response?.data?.message || '에러메세지 테스트용.'
    console.error(err)
  }
}
</script>
<template>
  <HeaderNav />
  <v-container
    class="bg-caf-navy d-flex align-center h-screen justify-center fill-height pa-0"
    fluid
  >
    <v-row no-gutters class="w-100" style="max-width: 1000px">
      <!-- LEFT -->
      <v-col cols="12" md="6" class="d-flex-column justify-center text-white px-10 py-12">
        <h3 class="text-h6 font-weight-bold mb-4">
          아! 당신은
          <span v-if="role === 'gaein'" class="green--text">
            혼자서 우리 커피를 알리는<br />‘Solo Roaster’
          </span>
          <span v-else class="blue--text">
            Great Roasteries를 곁에서 돕는<br />‘Support Roasteries’
          </span>
          군요!
        </h3>
        <p class="text-subtitle-2">
          당신의 이용을 도와줄게요!<br />우리가 당신에 대해서 알 수 있게 알려주세요!
        </p>
        <v-img :src="roleImage" width="140" class="mt-6" />
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="6" class="pa-4 h-50 d-flex flex-column justify-center align-center">
        <v-card
          class="pa-4 w-100"
          elevation="2"
          style="background-color: white; border-radius: 12px"
        >
          <h4 class="font-weight-bold mb-2">기본 정보</h4>
          <v-text-field
            v-model="name"
            label="이름"
            class="mb-2"
            density="compact"
            variant="outlined"
          />
          <v-text-field
            v-model="userId"
            label="User ID"
            class="mb-2"
            density="compact"
            variant="outlined"
          />
          <v-text-field
            v-model="nickname"
            label="닉네임"
            class="mb-2"
            density="compact"
            variant="outlined"
          />
          <v-text-field
            v-model="email"
            label="이메일"
            class="mb-2"
            density="compact"
            variant="outlined"
          />
          <v-text-field
            v-model="password"
            label="비밀번호"
            type="password"
            class="mb-2"
            density="compact"
            variant="outlined"
          />
          <v-text-field
            v-model="confirmPassword"
            label="비밀번호 확인"
            type="password"
            class="mb-3"
            density="compact"
            variant="outlined"
          />

          <h4 class="font-weight-bold mb-2">직책</h4>
          <v-select v-model="job" :items="jobs" label="직책" class="mb-3" variant="outlined" />

          <div v-if="role === 'pran'" class="mb-3">
            <h4 class="font-weight-bold mb-2">브랜드 선택</h4>
            <v-select v-model="selectedBrand" :items="brands" label="브랜드" variant="outlined" />
          </div>

          <v-btn color="primary" block size="default" class="mt-2" @click="handleSubmit"
            >제출</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.green--text {
  color: #39e09b;
}
.blue--text {
  color: #7fcdff;
}
</style>
