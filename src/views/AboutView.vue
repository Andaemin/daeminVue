<script setup>
import BasicNav from '../components/BasicNav.vue'
</script>
<template>
  <v-container>
    <BasicNav />
    <div class="about">
      <h1>This is an about page</h1>
      <router-link to="/main/:name">
        <v-btn> go</v-btn>
      </router-link>
    </div>
  </v-container>
</template>

<style></style>
