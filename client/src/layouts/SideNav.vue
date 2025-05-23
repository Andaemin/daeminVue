<script setup>
import { useUserStore } from '@/store/UserStore'
const userStore = useUserStore()
</script>
<template>
  <v-list>
    <v-navigation-drawer :width="190">
      <v-list-item title="test" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link prepend-icon="mdi-cog" title="List Item 1">{{
        userStore.username
      }}</v-list-item>
      <v-list-item link title="List Item 2"></v-list-item>
      <v-list-item link title="List Item 3"></v-list-item>
    </v-navigation-drawer>
  </v-list>
</template>
<style scoped></style>
