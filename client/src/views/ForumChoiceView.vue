<!-- src/views/ForumChoiceView.vue -->
<script setup>
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { categoryChips } from '@/data/chipCategories.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 서버에서 전체 게시글을 가져와서, 카테고리별 상위 5개씩 분리
const posts = ref([])
const freeboardPosts = ref([])
const starbucksPosts = ref([])

const router = useRouter()

onMounted(async () => {
  try {
    const res = await axios.get('/api/posts')
    posts.value = res.data || []

    // category 는 소문자 key 값을 기준으로 분리
    freeboardPosts.value = posts.value.filter((p) => p.category === 'freeboard').slice(0, 5)
    starbucksPosts.value = posts.value.filter((p) => p.category === 'starbucks').slice(0, 5)
  } catch (err) {
    console.error('게시글 불러오기 실패:', err)
  }
})

// 클릭 시 해당 보드로 이동
const goToBoard = (categoryKey) => {
  if (categoryKey === 'agora') {
    router.push({ name: 'agora' })
  } else {
    router.push({ name: 'boardview', params: { category: categoryKey } })
  }
}

// 클릭 시 /post/:id 로 이동 (예시)
const goToPost = (id) => {
  router.push({ name: 'postDetail', params: { id } })
}

// 칩 색상 가져오기 (카테고리 키에 맞춘 색)
const getColor = (key) => {
  const chip = categoryChips.find((c) => c.key === key)
  return chip ? chip.color : '#2C3E50'
}
</script>

<template>
  <!-- HeaderNav -->
  <HeaderNav />

  <!-- 전체 컨테이너 -->
  <div class="forum-container">
    <!-- 메인 컨텐츠 영역 -->
    <div class="content-wrapper">
      <!-- 메인 타이틀 -->
      <div class="title-section">
        <h1 class="main-title">
          Welcome to <span class="cafverse-text">CaF<span class="blue-text">verse</span></span>
        </h1>
        <p class="subtitle">Where Coffee Stories Begin</p>
      </div>

      <!-- 고퀄리티 칩(Chip) 영역 -->
      <div class="chips-section">
        <!-- 첫 번째 줄: FreeBoard, Starbucks, BlueBottle, EDIYA -->
        <div class="chips-row">
          <div
            v-for="chip in categoryChips.slice(0, 4)"
            :key="chip.key"
            class="category-chip-wrapper"
            @click="goToBoard(chip.key)"
          >
            <div
              class="category-chip"
              :style="{
                backgroundColor: chip.color,
                borderLeft: `3px solid ${chip.dotColor}`,
              }"
            >
              <div class="chip-icon" :style="{ backgroundColor: chip.dotColor }"></div>
              <span class="chip-text" :style="{ color: chip.textColor }">
                {{ chip.name }}
              </span>
              <div class="chip-glow" :style="{ backgroundColor: chip.dotColor }"></div>
            </div>
          </div>
        </div>

        <!-- 두 번째 줄: Tom & Toms, Twosome Place -->
        <div class="chips-row">
          <div
            v-for="chip in categoryChips.slice(4, 6)"
            :key="chip.key"
            class="category-chip-wrapper"
            @click="goToBoard(chip.key)"
          >
            <div
              class="category-chip"
              :style="{
                backgroundColor: chip.color,
                borderLeft: `3px solid ${chip.dotColor}`,
              }"
            >
              <div class="chip-icon" :style="{ backgroundColor: chip.dotColor }"></div>
              <span class="chip-text" :style="{ color: chip.textColor }">
                {{ chip.name }}
              </span>
              <div class="chip-glow" :style="{ backgroundColor: chip.dotColor }"></div>
            </div>
          </div>
        </div>

        <!-- 세 번째 줄: DUNKIN' DONUTS, Myeongji College BluePort -->
        <div class="chips-row">
          <div
            v-for="chip in categoryChips.slice(6, 8)"
            :key="chip.key"
            class="category-chip-wrapper"
            @click="goToBoard(chip.key)"
          >
            <div
              class="category-chip"
              :style="{
                backgroundColor: chip.color,
                borderLeft: `3px solid ${chip.dotColor}`,
                minWidth: chip.name.includes('College') ? '280px' : '180px',
              }"
            >
              <div class="chip-icon" :style="{ backgroundColor: chip.dotColor }"></div>
              <span class="chip-text" :style="{ color: chip.textColor }">
                {{ chip.name }}
              </span>
              <div class="chip-glow" :style="{ backgroundColor: chip.dotColor }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agora 특별 섹션 -->
      <div class="agora-section">
        <div class="agora-chip" @click="goToBoard('agora')">
          <div class="agora-content">
            <div class="agora-icon">🏛️</div>
            <div class="agora-text">
              <h3>Agora</h3>
              <p>Join the Great Coffee Debate</p>
            </div>
          </div>
          <div class="agora-arrow">→</div>
        </div>
      </div>

      <!-- 구분선 -->
      <div class="section-divider">
        <div class="divider-line"></div>
        <span class="divider-text">Popular Echo Whispers</span>
        <div class="divider-line"></div>
      </div>

      <!-- 인기글 섹션: ScentStalker들의 이야기 -->
      <div class="popular-section">
        <div class="popular-boards">
          <!-- 자유게시판 인기글 -->
          <div class="board-section">
            <div class="board-header">
              <h3 class="board-title">
                <span class="board-icon">🔥</span>
                <span>FreeBoard</span>
                <span class="board-subtitle">ScentStalkers' Stories</span>
              </h3>
            </div>
            <div class="board-content">
              <div v-if="freeboardPosts.length === 0" class="empty-state">
                <div class="empty-icon">📝</div>
                <p>No whispers yet...</p>
                <small>Be the first ScentStalker to share!</small>
              </div>
              <div v-else class="posts-list">
                <div
                  v-for="post in freeboardPosts"
                  :key="'free-' + post.id"
                  @click="goToPost(post.id)"
                  class="post-item"
                >
                  <div
                    class="post-indicator"
                    :style="{ backgroundColor: getColor(post.category) }"
                  ></div>
                  <div class="post-content">
                    <span class="post-title">{{ post.title }}</span>
                    <span class="post-author"
                      >by
                      {{ post.isAnonymous ? 'Anonymous SproutFinder' : post.author?.name }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 스타벅스 게시판 인기글 -->
          <div class="board-section">
            <div class="board-header">
              <h3 class="board-title">
                <span class="board-icon">☕</span>
                <span>Starbucks</span>
                <span class="board-subtitle">Great Roasteries Tales</span>
              </h3>
            </div>
            <div class="board-content">
              <div v-if="starbucksPosts.length === 0" class="empty-state">
                <div class="empty-icon">☕</div>
                <p>No whispers yet...</p>
                <small>Share your Great Roasteries experience!</small>
              </div>
              <div v-else class="posts-list">
                <div
                  v-for="post in starbucksPosts"
                  :key="'star-' + post.id"
                  @click="goToPost(post.id)"
                  class="post-item"
                >
                  <div
                    class="post-indicator"
                    :style="{ backgroundColor: getColor(post.category) }"
                  ></div>
                  <div class="post-content">
                    <span class="post-title">{{ post.title }}</span>
                    <span class="post-author"
                      >by {{ post.isAnonymous ? 'Anonymous WhiffKeeper' : post.author?.name }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forum-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4fa 0%, #e8f2ff 100%);
  padding-top: 64px;
  display: flex;
  justify-content: center;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 24px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-section {
  margin: 40px 0;
  text-align: center;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 900;
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.cafverse-text {
  color: #57c675;
}

.blue-text {
  color: #6fb8f4;
}

.subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 500;
  font-style: italic;
}

.chips-section {
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.chips-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-chip-wrapper {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-chip-wrapper:hover {
  transform: translateY(-4px) scale(1.02);
}

.category-chip {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  min-width: 140px;
  height: 36px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-chip:hover {
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.25);
}

.category-chip:hover .chip-glow {
  opacity: 0.1;
  transform: scale(1.5);
}

.chip-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  z-index: 2;
}

.chip-text {
  font-size: 0.9rem;
  font-weight: 700;
  z-index: 2;
  font-family: 'NanumBarunGothic', sans-serif;
}

.chip-glow {
  position: absolute;
  top: 50%;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  transform: translateY(-50%) scale(0.5);
  transition: all 0.3s ease;
}

.agora-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 32px;
}

.agora-chip {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.2);
  border: 2px solid transparent;
}

.agora-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(44, 62, 80, 0.3);
  border-color: #6fb8f4;
}

.agora-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.agora-icon {
  font-size: 2rem;
}

.agora-text h3 {
  color: #6fb8f4;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.agora-text p {
  color: #bdc3c7;
  font-size: 0.9rem;
  margin: 0;
}

.agora-arrow {
  color: #6fb8f4;
  font-size: 1.5rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.agora-chip:hover .agora-arrow {
  transform: translateX(4px);
}

.section-divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 24px 0;
  gap: 16px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #bdc3c7 50%, transparent 100%);
}

.divider-text {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  font-family: 'NanumBarunGothic', sans-serif;
}

.popular-section {
  width: 100%;
}

.popular-boards {
  display: flex;
  gap: 24px;
  width: 100%;
}

.board-section {
  flex: 1;
}

.board-header {
  margin-bottom: 16px;
}

.board-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.board-subtitle {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
  margin-left: 4px;
}

.board-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  min-height: 200px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #7f8c8d;
  text-align: center;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.5);
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

.post-indicator {
  width: 4px;
  height: 24px;
  border-radius: 2px;
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  line-height: 1.2;
  font-family: 'NanumBarunGothic', sans-serif;
}

.post-author {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.2rem;
  }

  .chips-row {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }

  .category-chip {
    width: 100%;
    justify-content: center;
  }

  .popular-boards {
    flex-direction: column;
  }

  .agora-chip {
    padding: 16px 20px;
  }

  .agora-text h3 {
    font-size: 1.2rem;
  }
}
</style>
