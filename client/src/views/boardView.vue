<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import LikeButton from '@/components/base/LikeBtn.vue'
import { getCategoryByKey } from '@/data/chipCategories.js'
import { useLikeStore } from '@/store/likeStore.js'
import { useLoginStore } from '@/store/login'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const likeStore = useLikeStore()
const loginStore = useLoginStore()
const posts = ref([])
const loading = ref(true)
const error = ref(null)

// 페이지네이션 상태
const currentPage = ref(1)
const itemsPerPage = 8 // 페이지당 8개 게시글
const totalPosts = ref(0)

// 현재 카테고리 정보
const currentCategory = computed(() => {
  return getCategoryByKey(route.params.category)
})

const categoryTitle = computed(() => {
  return currentCategory.value ? currentCategory.value.name : '게시판'
})

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(totalPosts.value / itemsPerPage)
})

// 현재 페이지의 게시글들
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return posts.value.slice(start, end)
})

// 게시글 불러오기
const fetchPosts = async () => {
  try {
    loading.value = true
    const res = await axios.get('/api/posts')

    // 현재 카테고리에 해당하는 게시글만 필터링 후 최신순 정렬
    const filteredPosts = res.data
      .filter((post) => post.category === route.params.category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신글 먼저

    posts.value = filteredPosts
    totalPosts.value = filteredPosts.length

    // 좋아요 정보 배치 로드 (현재 페이지 게시글만)
    if (filteredPosts.length > 0) {
      const currentPagePosts = paginatedPosts.value
      const postIds = currentPagePosts.map((post) => post.id)
      await likeStore.loadLikesForPosts(postIds, loginStore.token)
    }
  } catch (err) {
    error.value = '게시글을 불러오는 중 에러가 발생했습니다.'
    console.error('게시글 로딩 실패:', err)
  } finally {
    loading.value = false
  }
}

// 페이지 변경
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page

  // 새 페이지의 좋아요 정보 로드
  const currentPagePosts = paginatedPosts.value
  if (currentPagePosts.length > 0) {
    const postIds = currentPagePosts.map((post) => post.id)
    await likeStore.loadLikesForPosts(postIds, loginStore.token)
  }

  // 페이지 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

// 글쓰기
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
            <p class="text-subtitle-1 text-grey-darken-1 mt-1">
              총 {{ totalPosts }}개의 게시글
              <span v-if="totalPages > 1" class="ml-2">
                ({{ currentPage }}/{{ totalPages }} 페이지)
              </span>
            </p>
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

      <!-- 게시글 카드들 (현재 페이지만 표시) -->
      <v-row v-else>
        <v-col v-for="post in paginatedPosts" :key="post.id" cols="12" md="6">
          <v-card
            class="mb-4 post-card"
            elevation="2"
            @click="goToPost(post.id)"
            style="cursor: pointer"
          >
            <v-card-title class="text-h6 d-flex justify-space-between align-center">
              <span>{{ post.title }}</span>
              <div class="d-flex align-center">
                <!-- 최신글 표시 (24시간 이내) -->
                <v-chip
                  v-if="Date.now() - new Date(post.createdAt).getTime() < 24 * 60 * 60 * 1000"
                  size="x-small"
                  color="red"
                  text-color="white"
                  class="mr-2"
                >
                  NEW
                </v-chip>
                <v-chip
                  size="small"
                  :color="currentCategory?.color || '#CCCCCC'"
                  text-color="white"
                >
                  {{ categoryTitle }}
                </v-chip>
              </div>
            </v-card-title>

            <v-card-subtitle class="text-subtitle-2 d-flex align-center flex-wrap gap-1 pb-2">
              <v-icon size="16" class="mr-1">
                {{ post.isAnonymous ? 'mdi-incognito' : 'mdi-account' }}
              </v-icon>

              <!-- 작성자 이름 (익명일 때만 칩) -->
              <v-chip
                v-if="post.isAnonymous"
                size="x-small"
                color="#95A5A6"
                text-color="white"
                variant="flat"
                class="mr-1"
              >
                익명
              </v-chip>
              <span v-else class="font-weight-medium mr-2">
                {{ post.author?.name || post.authorName || '알 수 없음' }}
              </span>

              <!-- 직업 태그 -->
              <v-chip
                v-if="post.author?.job || post.authorJob"
                size="x-small"
                color="#3498DB"
                text-color="white"
                variant="flat"
                class="mr-1"
              >
                {{ post.author?.job || post.authorJob }}
              </v-chip>

              <!-- 브랜드 태그 -->
              <v-chip size="x-small" color="#E67E22" text-color="white" variant="flat">
                {{ post.author?.brand || post.authorBrand || 'Solo Roaster' }}
              </v-chip>
            </v-card-subtitle>

            <v-card-text>
              <div class="text-truncate">
                {{ post.content }}
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <LikeButton :post-id="post.id" size="small" variant="text-only" />

              <v-spacer></v-spacer>

              <span class="text-caption text-grey">
                {{
                  new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-6 mb-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          variant="elevated"
          color="primary"
          @update:model-value="changePage"
          class="pagination-custom"
        />
      </div>

      <!-- 페이지 정보 -->
      <div v-if="totalPages > 1" class="text-center mt-4 mb-6">
        <v-chip size="small" color="grey-lighten-2" class="mx-1">
          <v-icon start size="16">mdi-file-document-outline</v-icon>
          {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
            Math.min(currentPage * itemsPerPage, totalPosts)
          }}
          / {{ totalPosts }}개
        </v-chip>
      </div>
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

/* 페이지네이션 커스텀 스타일 */
.pagination-custom {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* NEW 뱃지 애니메이션 */
.v-chip[color='red'] {
  animation: newBadgePulse 2s ease-in-out infinite;
}

@keyframes newBadgePulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
