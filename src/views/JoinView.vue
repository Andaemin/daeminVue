<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/UserStore'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()
const join = () => {
  const finalName = username.value.trim() || 'default'
  userStore.setUserName(finalName)
  router.push({
    name: 'home',
    params: {
      name: finalName,
    },
  })
}
</script>

<template>
  <v-container>
    <div class="join">
      <h1>vue-test feat</h1>
      <v-text-field
        label="Username"
        v-model="username"
        placeholder="이름을 입력해주세요. (비워두면 'default')"
      />
      <v-row class="d-flex align-center">
        <v-btn @click="join" class="ma-2">Select</v-btn>
        <div v-if="['기본', 'default'].includes(username)" class="ma-2">
          <p class="red-fonts">정말 '기본' 으로 하시려구요..?</p>
        </div>
        <div v-else-if="['나연', '임나연', 'yimnayeon', 'nayeon'].includes(username)">
          <h1 class="red-fonts">
            어머 Twice {{ username }} 님이신가요?! <br />
            여기에 방문해주셔서 너무나 감사해요!
          </h1>
        </div>
      </v-row>
    </div>
  </v-container>
</template>
