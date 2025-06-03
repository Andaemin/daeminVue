// client/src/store/login.js
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null,
  }),
  actions: {
    setLogin(userData, token = null) {
      this.isLoggedIn = true
      this.user = userData
      this.token = token
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
    },
  },
  persist: true,
})
