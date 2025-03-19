<script setup></script>

<template>
  <v-container>
    <router-link to="/About/:username">
      <v-btn color="primary">이동 실험.</v-btn>
      <h1>{{ username }}</h1>
    </router-link>
  </v-container>
</template>
