<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgoraStore } from '@/store/agoraStore'
import { useLoginStore } from '@/store/login'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import sproutMangchi from '@/assets/sprout_mangchi.png'

const router = useRouter()
const agoraStore = useAgoraStore()
const loginStore = useLoginStore()

// 토론 목록으로 이동
const goToForum = () => {
  router.push({ name: 'forum' })
}

// 새 토론 작성으로 이동
const createDebate = () => {
  if (!loginStore.isLoggedIn) {
    alert('로그인이 필요한 기능입니다.')
    router.push({ name: 'login' })
    return
  }
  router.push({ name: 'createDebate' })
}

// 토론 상세보기로 이동
const viewDebateDetail = (debate) => {
  router.push({
    name: 'agoraDetail',
    params: { id: debate.id },
  })
}

onMounted(async () => {
  await agoraStore.loadDebates()
})
</script>

<template>
  <HeaderNav />

  <div class="agora-container">
    <div class="main-view">
      <!-- 헤더 영역 -->
      <div class="header-section">
        <div class="header-top">
          <v-btn icon variant="text" @click="goToForum" class="back-btn">
            <v-icon size="24">mdi-arrow-left</v-icon>
          </v-btn>

          <div class="title-area">
            <h1 class="page-title">🏛️ Agora</h1>
            <p class="page-subtitle">커피 토론의 광장</p>
          </div>

          <img :src="sproutMangchi" alt="Sprout Mangchi" class="mascot-img" />
        </div>

        <div class="header-bottom">
          <p class="agora-description">
            ScentStalker들이 모여 커피에 대한 다양한 의견을 나누는 공간입니다
          </p>
          <v-btn
            color="#57C675"
            size="large"
            @click="createDebate"
            class="create-btn"
            prepend-icon="mdi-plus"
          >
            새 토론 시작하기
          </v-btn>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="agoraStore.loading" class="loading-section">
        <v-progress-circular indeterminate color="#57C675" size="50"></v-progress-circular>
        <p class="loading-text">토론을 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="agoraStore.error" class="error-section">
        <v-alert type="error" variant="tonal" class="mb-4">
          {{ agoraStore.error }}
        </v-alert>
        <v-btn @click="agoraStore.loadDebates()" color="primary">다시 시도</v-btn>
      </div>

      <!-- 토론 목록 -->
      <div v-else class="debates-grid">
        <div
          v-for="debate in agoraStore.debates"
          :key="debate.id"
          class="debate-card"
          @click="viewDebateDetail(debate)"
        >
          <!-- 카드 헤더 -->
          <div class="card-header">
            <h3 class="debate-title">{{ debate.title }}</h3>
            <div class="debate-stats">
              <span class="stat-item">
                <v-icon size="16" color="#7f8c8d">mdi-account-group</v-icon>
                {{ debate.totalVotes }}명 참여
              </span>
              <span class="stat-item">
                <v-icon size="16" color="#7f8c8d">mdi-comment</v-icon>
                {{ debate.comments }}개 댓글
              </span>
            </div>
          </div>

          <!-- 설명 -->
          <p class="debate-description">{{ debate.description }}</p>

          <!-- 투표 결과 미리보기 -->
          <div class="vote-preview">
            <div class="vote-option">
              <div class="option-header">
                <span class="option-name">{{ debate.optionA }}</span>
                <span class="option-percentage">
                  {{
                    debate.totalVotes > 0
                      ? Math.round((debate.votesA / debate.totalVotes) * 100)
                      : 0
                  }}%
                </span>
              </div>
              <div class="vote-bar">
                <div
                  class="vote-fill option-a-fill"
                  :style="{
                    width:
                      debate.totalVotes > 0
                        ? `${(debate.votesA / debate.totalVotes) * 100}%`
                        : '0%',
                  }"
                ></div>
              </div>
              <span class="vote-count">{{ debate.votesA }}표</span>
            </div>

            <div class="vs-text">VS</div>

            <div class="vote-option">
              <div class="option-header">
                <span class="option-name">{{ debate.optionB }}</span>
                <span class="option-percentage">
                  {{
                    debate.totalVotes > 0
                      ? Math.round((debate.votesB / debate.totalVotes) * 100)
                      : 0
                  }}%
                </span>
              </div>
              <div class="vote-bar">
                <div
                  class="vote-fill option-b-fill"
                  :style="{
                    width:
                      debate.totalVotes > 0
                        ? `${(debate.votesB / debate.totalVotes) * 100}%`
                        : '0%',
                  }"
                ></div>
              </div>
              <span class="vote-count">{{ debate.votesB }}표</span>
            </div>
          </div>

          <!-- 카드 푸터 -->
          <div class="card-footer">
            <span class="author">{{ debate.author }}</span>
            <span class="date">{{ new Date(debate.createdAt).toLocaleDateString('ko-KR') }}</span>
          </div>
        </div>

        <!-- 토론이 없는 경우 -->
        <div v-if="agoraStore.debates.length === 0" class="empty-state">
          <img :src="sproutMangchi" alt="Sprout Mangchi" class="empty-mascot" />
          <h3>아직 토론이 없습니다</h3>
          <p>첫 번째 Echo Whisper를 시작해보세요!</p>
          <v-btn @click="createDebate" color="#57C675" size="large" class="mt-4">
            새 토론 시작하기
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agora-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 64px;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
}

.main-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 헤더 섹션 */
.header-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.back-btn {
  color: #57c675 !important;
}

.title-area {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 900;
  color: #2d3748;
  margin: 0 0 4px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.page-subtitle {
  color: #718096;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.mascot-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.header-bottom {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agora-description {
  color: #4a5568;
  font-size: 1rem;
  margin: 0;
  flex: 1;
  margin-right: 20px;
}

.create-btn {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 600;
  text-transform: none;
}

/* 로딩 섹션 */
.loading-section {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  margin-top: 16px;
  color: #718096;
  font-size: 1rem;
}

/* 에러 섹션 */
.error-section {
  text-align: center;
  padding: 40px 20px;
}

/* 토론 그리드 */
.debates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.debate-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.debate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #57c675;
}

.card-header {
  margin-bottom: 16px;
}

.debate-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.4;
  font-family: 'NanumBarunGothic', sans-serif;
}

.debate-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: #718096;
}

.debate-description {
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

/* 투표 미리보기 */
.vote-preview {
  margin-bottom: 16px;
}

.vote-option {
  margin-bottom: 12px;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.option-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.option-percentage {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.875rem;
}

.vote-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.vote-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.option-a-fill {
  background: linear-gradient(90deg, #57c675, #68d391);
}

.option-b-fill {
  background: linear-gradient(90deg, #6fb8f4, #90cdf4);
}

.vote-count {
  font-size: 0.75rem;
  color: #718096;
}

.vs-text {
  text-align: center;
  font-weight: 700;
  color: #a0aec0;
  font-size: 0.875rem;
  margin: 8px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #718096;
}

.author {
  font-weight: 600;
  color: #4a5568;
}

/* 빈 상태 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.empty-mascot {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.empty-state p {
  color: #718096;
  font-size: 1rem;
  margin-bottom: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .debates-grid {
    grid-template-columns: 1fr;
  }

  .header-top {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .header-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .agora-description {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .main-view {
    padding: 16px;
  }

  .header-section {
    padding: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }
}
</style>
