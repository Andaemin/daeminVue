<!-- client/src/views/BoardView.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const post = ref(null)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`/api/posts/${route.params.id}`)
    post.value = res.data
  } catch (err) {
    ;(errorMsg.value = '게시글을 불러오는 데 실패했어요.'), err
  }
})
</script>

<template>
  <v-container class="py-8">
    <v-card v-if="post" elevation="3" class="pa-6">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        {{ post.title }}
      </v-card-title>
      <v-card-subtitle>
        {{ post.isAnonymous ? '익명' : post.author.name }} | {{ post.author.job }} |
        {{ post.author.brand || 'Solo Roaster' }} |
        {{ post.category }}
      </v-card-subtitle>
      <v-card-text class="mt-4" style="white-space: pre-line">
        {{ post.content }}
      </v-card-text>
    </v-card>

    <div v-else class="text-red mt-4">{{ errorMsg }}</div>
  </v-container>
</template>
