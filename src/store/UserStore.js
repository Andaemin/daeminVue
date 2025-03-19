import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('')

  const setUserName = (name) => {
    username.value = name
  }
  return { username, setUserName }
})
