<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: String,
  image: String,
  value: String,
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.value)
}
</script>

<template>
  <v-card
    class="pa-4 d-flex flex-column align-center justify-center hover-card"
    elevation="4"
    width="180"
    height="220"
    @click="handleClick"
  >
    <v-img :src="image" width="60" height="60" class="mb-3" />
    <span class="text-center font-weight-medium text-body-1">{{ title }}</span>
  </v-card>
</template>

<style scoped>
.hover-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
}
</style>
