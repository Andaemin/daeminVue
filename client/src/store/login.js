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
      // 명시적으로 모든 필드 설정
      this.isLoggedIn = true
      this.user = {
        id: userData.id,
        userId: userData.userId,
        nickname: userData.nickname,
        name: userData.name,
        profileImage: userData.profileImage,
        job: userData.job, // 명시적으로 추가
        brand: userData.brand, // 명시적으로 추가
      }
      this.token = token

      // 디버깅용 (나중에 제거)
      console.log('setLogin 완료 - user:', this.user)
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
    },
  },
  persist: true,
})
