<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { getCategoryByKey } from '@/data/chipCategories.js'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const posts = ref([])
const loading = ref(true)
const error = ref(null)

// 현재 카테고리 정보
const currentCategory = computed(() => {
  return getCategoryByKey(route.params.category)
})

const categoryTitle = computed(() => {
  return currentCategory.value ? currentCategory.value.name : '게시판'
})

const fetchPosts = async () => {
  try {
    loading.value = true
    const res = await axios.get('/api/posts')
    console.log(`받은 데이터 : ${res.body}`)
    posts.value = res.data.filter((post) => post.category === route.params.category)
  } catch (err) {
    error.value = '게시글을 불러오는 중 에러가 발생했습니다.'
    console.error('게시글 로딩 실패:', err)
  } finally {
    loading.value = false
  }
}

// 게시글 상세로 이동
const goToPost = (postId) => {
  router.push({
    name: 'postDetail',
    params: {
      category: route.params.category,
      id: postId,
    },
  })
}

// 포럼 메인으로 돌아가기
const goToForum = () => {
  router.push({ name: 'forum' })
}

// 글쓰기 (임시)
const writePost = () => {
  router.push({
    name: 'writePostCategory',
    params: { category: route.params.category },
  })
}

onMounted(fetchPosts)
</script>

<template>
  <HeaderNav />
  <v-container
    fluid
    class="pa-0"
    style="max-width: 1080px; margin: 0 auto; margin-top: 64px; min-height: calc(100vh - 64px)"
  >
    <!-- 헤더 영역 -->
    <v-sheet class="pa-6 mb-4" color="white" elevation="1">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goToForum" class="mr-3">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <div>
            <h1 class="text-h4 font-weight-bold d-flex align-center">
              <v-avatar
                :color="currentCategory?.color || '#CCCCCC'"
                size="12"
                class="mr-3"
              ></v-avatar>
              {{ categoryTitle }}
            </h1>
            <p class="text-subtitle-1 text-grey-darken-1 mt-1">{{ posts.length }}개의 게시글</p>
          </div>
        </div>

        <v-btn color="primary" size="large" @click="writePost" prepend-icon="mdi-pencil">
          글쓰기
        </v-btn>
      </div>
    </v-sheet>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">게시글을 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <v-alert v-else-if="error" type="error" class="ma-4">
      {{ error }}
    </v-alert>

    <!-- 게시글 목록 -->
    <div v-else class="pa-4">
      <!-- 게시글 없음 -->
      <v-sheet v-if="posts.length === 0" class="pa-8 text-center" color="grey-lighten-4" rounded>
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-post-outline</v-icon>
        <h3 class="text-h6 mb-2">아직 게시글이 없습니다</h3>
        <p class="text-body-2 text-grey-darken-1 mb-4">
          {{ categoryTitle }}의 첫 번째 게시글을 작성해보세요!
        </p>
        <v-btn color="primary" @click="writePost"> 첫 게시글 작성하기 </v-btn>
      </v-sheet>

      <!-- 게시글 카드들 -->
      <v-row v-else>
        <v-col v-for="post in posts" :key="post.id" cols="12" md="6">
          <v-card
            class="mb-4 post-card"
            elevation="2"
            @click="goToPost(post.id)"
            style="cursor: pointer"
          >
            <v-card-title class="text-h6 d-flex justify-space-between align-center">
              <span>{{ post.title }}</span>
              <v-chip size="small" :color="currentCategory?.color || '#CCCCCC'" text-color="white">
                {{ categoryTitle }}
              </v-chip>
            </v-card-title>

            <v-card-subtitle class="text-subtitle-2">
              <v-icon size="16" class="mr-1">
                {{ post.isAnonymous ? 'mdi-incognito' : 'mdi-account' }}
              </v-icon>
              {{ post.isAnonymous ? '익명' : post.author?.name || '알 수 없음' }}
              <span class="mx-1">•</span>
              {{ post.author?.job || '-' }}
              <span class="mx-1">•</span>
              {{ post.author?.brand || 'Solo Roaster' }}
            </v-card-subtitle>
            <!-- 1. 일단  -->
            <v-card-text>
              <div class="text-truncate">
                {{ post.content }}
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">
                {{ new Date(post.createdAt).toLocaleDateString('ko-KR') }}
              </span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.post-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
