<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})

const emits = defineEmits('click')

const handler = () => {
  emits(['click'])
}
</script>
<template>
  <v-btn @click="handler" :disabled="props.disabled" corsor="pointer" color="info" class="ma-2">
    <slot>Submit!</slot>
  </v-btn>
</template>
