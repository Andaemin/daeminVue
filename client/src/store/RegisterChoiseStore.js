import { defineStore } from 'pinia'

export const useRegisterStore = defineStore('register', {
  state: () => ({
    selectedRole: '',
  }),
  actions: {
    setRole(role) {
      this.selectedRole = role
    },
  },
})
