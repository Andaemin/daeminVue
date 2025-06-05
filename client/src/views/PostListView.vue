<script setup>
import { ref, onMounted } from 'vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import axios from 'axios'

const posts = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('/api/posts')
    posts.value = res.data
  } catch (err) {
    error.value = '게시글을 불러오는 중 에러 발생'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeaderNav />
  <v-container class="py-10">
    <h2 class="text-h5 font-weight-bold mb-6">📚 게시글 목록</h2>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    <v-progress-circular v-if="loading" indeterminate color="primary" class="mx-auto my-6" />

    <v-card v-for="post in posts" :key="post.id" class="mb-4" elevation="2">
      <v-card-title>
        <span class="text-h6 font-weight-bold">{{ post.title }}</span>
        <v-spacer />
        <span class="text-caption text-grey-darken-1"> {{ post.category }} 게시판 </span>
      </v-card-title>
      <v-card-subtitle class="text-subtitle-2">
        {{ post.isAnonymous ? '익명' : post.author?.name }} / {{ post.author?.job || '-' }} /
        {{ post.author?.brand || 'Solo Roaster' }}
      </v-card-subtitle>
      <v-card-text> {{ post.content.slice(0, 100) }}... </v-card-text>
    </v-card>
  </v-container>
</template>
