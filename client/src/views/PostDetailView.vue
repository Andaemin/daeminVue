<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import LikeBtn from '@/components/base/LikeBtn.vue'
import SproutBadge from '@/components/base/SproutBadge.vue'
import BadgeCollection from '@/components/base/BadgeCollection.vue'
import { getCategoryByKey } from '@/data/chipCategories.js'
import { useLikeStore } from '@/store/likeStore'
import { useLoginStore } from '@/store/login'
import { useBadgeStore } from '@/store/badgeStore'
import userDefault from '@/assets/user_default.png'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const likeStore = useLikeStore()
const loginStore = useLoginStore()
const badgeStore = useBadgeStore()

const post = ref(null)
const loading = ref(true)
const error = ref('')
const authorBadges = ref([])

// 카테고리 정보
const categoryInfo = computed(() => {
  return post.value ? getCategoryByKey(post.value.category) : null
})

// 작성자의 모든 뱃지 (희귀도 순 정렬)
const sortedAuthorBadges = computed(() => {
  if (post.value?.isAnonymous || !Array.isArray(authorBadges.value) || !authorBadges.value.length) {
    return []
  }

  // 희귀도 순서 정의
  const rarityOrder = {
    legendary: 5,
    epic: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
  }

  // 안전하게 복사한 후 정렬
  return [...authorBadges.value]
    .filter((badge) => badge && typeof badge === 'object')
    .sort((a, b) => {
      const rarityA = rarityOrder[a.rarity] || 0
      const rarityB = rarityOrder[b.rarity] || 0
      return rarityB - rarityA
    })
})

// 게시글 로드
const loadPost = async () => {
  try {
    loading.value = true
    const res = await axios.get(`/api/posts/${route.params.id}`)
    post.value = res.data

    // 좋아요 정보 로드
    await likeStore.loadLikesForPost(route.params.id, loginStore.token)

    // 작성자 뱃지 로드 (익명이 아닌 경우만)
    if (!post.value.isAnonymous && post.value.userId) {
      await loadAuthorBadges(post.value.userId)
    }
  } catch (err) {
    error.value = '게시글을 불러오는 데 실패했습니다.'
    console.error('게시글 로딩 실패:', err)
  } finally {
    loading.value = false
  }
}

// 작성자 뱃지 로드
const loadAuthorBadges = async (userId) => {
  try {
    console.log('작성자 뱃지 로드 시작:', userId)
    const badges = await badgeStore.loadUserBadges(userId, loginStore.token)
    console.log('로드된 뱃지:', badges)

    // 안전하게 배열 확인 후 할당
    if (Array.isArray(badges)) {
      authorBadges.value = badges.filter((badge) => badge?.isVisible !== false)
    } else {
      authorBadges.value = []
    }

    console.log('최종 authorBadges:', authorBadges.value)
  } catch (err) {
    console.error('작성자 뱃지 로드 실패:', err)
    authorBadges.value = []
  }
}

const goBack = () => router.go(-1)
const goToBoard = () => {
  if (post.value?.category) {
    router.push({ name: 'boardview', params: { category: post.value.category } })
  }
}

const writeComment = () => {
  if (!loginStore.isLoggedIn) {
    alert('로그인이 필요합니다.')
    return
  }
  alert('댓글 기능은 준비 중입니다.')
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value?.title,
      text: post.value?.content.substring(0, 100) + '...',
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('링크가 클립보드에 복사되었습니다!')
  }
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <HeaderNav />

  <v-container fluid class="h-screen bg-caf-navy">
    <!-- 헤더 여백 -->
    <div style="height: 64px"></div>

    <!-- 로딩 -->
    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      style="height: calc(100vh - 64px)"
    >
      <div class="text-center">
        <v-progress-circular indeterminate color="white" size="48"></v-progress-circular>
        <div class="text-white mt-3">게시글을 불러오는 중...</div>
      </div>
    </div>

    <!-- 에러 -->
    <div
      v-else-if="error"
      class="d-flex align-center justify-center"
      style="height: calc(100vh - 64px)"
    >
      <div class="text-center">
        <v-icon size="48" color="red-lighten-1" class="mb-3"></v-icon>
        <div class="text-white mb-4">{{ error }}</div>
        <v-btn color="white" variant="outlined" @click="goBack">돌아가기</v-btn>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div v-else-if="post" style="height: calc(100vh - 64px); overflow-y: auto">
      <!-- 브레드크럼 네비 -->
      <div class="py-3 px-4">
        <div class="d-flex align-center" style="max-width: 1000px; margin: 0 auto">
          <v-btn icon size="small" @click="goBack" class="mr-2" color="white">
            <v-icon color="white">mdi-arrow-left</v-icon>
          </v-btn>

          <v-chip
            v-if="categoryInfo"
            :color="categoryInfo.color"
            size="small"
            @click="goToBoard"
            class="cursor-pointer"
          >
            {{ categoryInfo.name }}
          </v-chip>

          <v-icon class="mx-2" size="small" color="white">mdi-chevron-right</v-icon>
          <span class="text-white">게시글</span>

          <v-spacer />

          <v-btn
            size="small"
            variant="outlined"
            @click="sharePost"
            prepend-icon="mdi-share"
            color="white"
          >
            공유
          </v-btn>
        </div>
      </div>

      <!-- 게시글 컨텐츠 -->
      <div style="max-width: 1000px; margin: 0 auto; padding: 32px 16px">
        <v-row>
          <!-- 메인 포스트 -->
          <v-col cols="12" md="8">
            <v-card class="mb-4" elevation="1">
              <v-card-text class="pa-6">
                <!-- 제목 -->
                <h1 class="text-h5 font-weight-bold mb-4 text-grey-darken-3">
                  {{ post.title }}
                </h1>

                <!-- 메타 정보 -->
                <div class="d-flex align-center mb-4 pb-4 border-bottom">
                  <v-avatar size="36" class="mr-3">
                    <v-img :src="post.author?.profileImage || userDefault" />
                  </v-avatar>
                  <div class="flex-grow-1">
                    <!-- 작성자 이름과 뱃지를 한 줄에 자연스럽게 배치 -->
                    <div class="d-flex align-center flex-wrap mb-2">
                      <span class="font-weight-bold author-name mr-2">
                        {{
                          post.isAnonymous
                            ? '익명의 SproutFinder'
                            : post.author?.name || post.authorName
                        }}
                      </span>

                      <!-- 모든 보유 뱃지 표시 (익명이 아닌 경우만) -->
                      <div
                        v-if="!post.isAnonymous && sortedAuthorBadges.length"
                        class="d-flex align-center flex-wrap"
                      >
                        <!-- 직접 뱃지 렌더링 -->
                        <div
                          v-for="badge in sortedAuthorBadges"
                          :key="badge.badgeType || badge.id"
                          class="badge-item"
                        >
                          <SproutBadge :badge="badge" size="small" />
                        </div>
                      </div>
                    </div>

                    <!-- 작성자 정보 태그들 -->
                    <div class="d-flex align-center flex-wrap gap-1 mb-1">
                      <!-- 직업 태그 -->
                      <v-chip
                        v-if="post.author?.job || post.authorJob"
                        size="x-small"
                        color="green-lighten-3"
                        variant="flat"
                      >
                        {{ post.author?.job || post.authorJob }}
                      </v-chip>

                      <!-- 브랜드 태그 -->
                      <v-chip size="x-small" color="orange-lighten-3" variant="flat">
                        {{ post.author?.brand || post.authorBrand || 'Solo Roaster' }}
                      </v-chip>
                    </div>

                    <div class="text-caption text-grey">
                      {{ new Date(post.createdAt).toLocaleString('ko-KR') }}
                    </div>
                  </div>
                  <LikeBtn :post-id="post.id" />
                </div>

                <!-- 본문 -->
                <div class="text-body-1 mb-4" style="line-height: 1.7; white-space: pre-line">
                  {{ post.content }}
                </div>

                <!-- 액션 버튼들 -->
                <div class="d-flex align-center pt-4 border-top">
                  <LikeBtn :post-id="post.id" variant="text-only" />
                  <v-btn
                    variant="text"
                    size="small"
                    @click="writeComment"
                    prepend-icon="mdi-comment-outline"
                    class="ml-2"
                  >
                    <v-icon>mdi-comment-outline</v-icon>
                    댓글
                  </v-btn>
                  <v-spacer />
                  <v-btn variant="text" size="small" @click="sharePost" prepend-icon="mdi-share">
                    <v-icon>mdi-share</v-icon>
                    공유
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 사이드바 -->
          <v-col cols="12" md="4">
            <!-- 작성자 정보 -->
            <v-card class="mb-4" elevation="1">
              <v-card-text class="text-center pa-4">
                <v-avatar size="64" class="mb-3">
                  <v-img :src="post.author?.profileImage || userDefault" />
                </v-avatar>
                <div class="font-weight-bold mb-2 author-name">
                  {{
                    post.isAnonymous ? '익명의 SproutFinder' : post.author?.name || post.authorName
                  }}
                </div>

                <!-- 작성자 뱃지 컬렉션 (익명이 아닌 경우만) -->
                <div v-if="!post.isAnonymous && sortedAuthorBadges.length" class="mb-3">
                  <div class="text-caption text-grey mb-2">보유 뱃지</div>
                  <div class="d-flex flex-wrap">
                    <div
                      v-for="badge in sortedAuthorBadges"
                      :key="badge.badgeType || badge.id"
                      class="badge-item mr-1 mb-1"
                    >
                      <SproutBadge :badge="badge" size="small" />
                    </div>
                  </div>
                </div>

                <!-- 사이드바 태그들 -->
                <div class="d-flex justify-center flex-wrap gap-1">
                  <!-- 직업 태그 -->
                  <v-chip
                    v-if="post.author?.job || post.authorJob"
                    size="small"
                    color="green-lighten-3"
                    variant="flat"
                  >
                    {{ post.author?.job || post.authorJob }}
                  </v-chip>

                  <!-- 브랜드 태그 -->
                  <v-chip size="small" color="orange-lighten-3" variant="flat">
                    {{ post.author?.brand || post.authorBrand || 'Solo Roaster' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>

            <!-- 게시글 정보 -->
            <v-card class="mb-4" elevation="1">
              <v-card-text class="pa-4">
                <div class="font-weight-bold mb-3">게시글 정보</div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-grey">작성일</span>
                  <span>{{ new Date(post.createdAt).toLocaleDateString('ko-KR') }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-grey">조회수</span>
                  <span>준비중</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-grey">댓글</span>
                  <span>준비중</span>
                </div>
              </v-card-text>
            </v-card>

            <!-- 댓글 섹션 -->
            <v-card elevation="1">
              <v-card-text class="pa-4">
                <div class="font-weight-bold mb-3 d-flex align-center">
                  <v-icon class="mr-2" color="primary" size="20">mdi-comment-multiple</v-icon>
                  댓글
                </div>
                <div class="text-center py-6">
                  <v-icon size="48" color="grey-lighten-2" class="mb-3">mdi-comment-outline</v-icon>
                  <div class="text-body-2 mb-2">댓글 시스템 준비 중</div>
                  <div class="text-caption text-grey mb-4">
                    곧 다른 사용자들과 소통할 수 있습니다
                  </div>
                  <v-btn color="primary" size="small" @click="writeComment" block>
                    댓글 작성 준비하기
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.bf-caf-navy {
  background-color: #1a237e !important;
}

.cursor-pointer {
  cursor: pointer;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

/* 나눔바른고딕 폰트 적용 */
* {
  font-family: 'NanumBarunGothic', sans-serif !important;
}

/* 작성자 이름 스타일링 */
.author-name {
  font-size: 1rem;
  color: #2d3748;
}

/* 뱃지 자연스러운 배치 */
.badge-item {
  margin: 0 4px 4px 0;
  display: inline-block;
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
