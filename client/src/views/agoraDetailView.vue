<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgoraStore } from '@/store/agoraStore'
import { useLoginStore } from '@/store/login'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import sproutMangchi from '@/assets/sprout_mangchi.png'

const route = useRoute()
const router = useRouter()
const agoraStore = useAgoraStore()
const loginStore = useLoginStore()

const voting = ref(false)
const hasVoted = ref(false)

// 현재 토론 정보
const debate = computed(() => agoraStore.currentDebate)

// 투표 비율 계산
const votesAPercentage = computed(() => {
  if (!debate.value || debate.value.totalVotes === 0) return 0
  return Math.round((debate.value.votesA / debate.value.totalVotes) * 100)
})

const votesBPercentage = computed(() => {
  if (!debate.value || debate.value.totalVotes === 0) return 0
  return Math.round((debate.value.votesB / debate.value.totalVotes) * 100)
})

// 뒤로가기
const goBack = () => {
  router.push({ name: 'agora' })
}

// 투표하기
const vote = async (option) => {
  if (!loginStore.isLoggedIn) {
    alert('로그인이 필요한 기능입니다.')
    router.push({ name: 'login' })
    return
  }

  if (hasVoted.value) {
    alert('이미 투표하셨습니다.')
    return
  }

  try {
    voting.value = true
    await agoraStore.vote(debate.value.id, option, loginStore.token)
    hasVoted.value = true

    // 성공 메시지
    const optionText = option === 'A' ? debate.value.optionA : debate.value.optionB
    alert(`"${optionText}"에 투표했습니다!`)
  } catch (error) {
    console.error('투표 실패:', error)
    alert('투표에 실패했습니다. 다시 시도해주세요.')
  } finally {
    voting.value = false
  }
}

// 댓글 작성 (준비 중)
const addComment = () => {
  alert('댓글 시스템이 곧 추가됩니다!')
}

onMounted(async () => {
  const debateId = route.params.id
  await agoraStore.loadDebateDetail(debateId)

  // 에러 처리
  if (agoraStore.error) {
    alert(agoraStore.error)
    router.push({ name: 'agora' })
  }
})
</script>

<template>
  <HeaderNav />

  <div class="agora-detail-container">
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
      <v-btn @click="goBack" color="primary">목록으로 돌아가기</v-btn>
    </div>

    <!-- 토론 상세 -->
    <div v-else-if="debate" class="detail-view">
      <!-- 헤더 -->
      <div class="detail-header">
        <v-btn icon variant="text" @click="goBack" class="back-btn">
          <v-icon size="24">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="detail-title-area">
          <h2 class="detail-title">{{ debate.title }}</h2>
          <p class="detail-meta">{{ debate.author }} • {{ debate.totalVotes }}명이 참여했습니다</p>
        </div>
      </div>

      <div class="detail-content">
        <!-- 토론 설명 -->
        <div class="debate-intro">
          <div class="intro-left">
            <p class="debate-desc">{{ debate.description }}</p>
            <div class="debate-info">
              <v-chip size="small" color="primary" variant="tonal">
                {{ debate.category }}
              </v-chip>
              <span class="created-date">
                {{ new Date(debate.createdAt).toLocaleDateString('ko-KR') }} 시작
              </span>
            </div>
          </div>
          <img :src="sproutMangchi" alt="Sprout Mangchi" class="detail-mascot" />
        </div>

        <!-- 투표 섹션 -->
        <div class="voting-section">
          <h3 class="voting-title">당신의 선택은?</h3>

          <div class="voting-options">
            <div
              class="vote-card vote-card-a"
              @click="vote('A')"
              :class="{ 'voting-disabled': voting || hasVoted }"
            >
              <div class="vote-card-content">
                <h4 class="vote-option-title">{{ debate.optionA }}</h4>
                <div class="vote-stats">
                  <span class="vote-count-large">{{ debate.votesA }}표</span>
                  <span class="vote-percentage-large">{{ votesAPercentage }}%</span>
                </div>
              </div>
              <div class="vote-progress-bar">
                <div
                  class="vote-progress-fill progress-a"
                  :style="{ width: `${votesAPercentage}%` }"
                ></div>
              </div>
              <div v-if="voting" class="vote-loading">
                <v-progress-circular indeterminate size="20" width="2"></v-progress-circular>
              </div>
            </div>

            <div class="vs-divider">
              <span>VS</span>
            </div>

            <div
              class="vote-card vote-card-b"
              @click="vote('B')"
              :class="{ 'voting-disabled': voting || hasVoted }"
            >
              <div class="vote-card-content">
                <h4 class="vote-option-title">{{ debate.optionB }}</h4>
                <div class="vote-stats">
                  <span class="vote-count-large">{{ debate.votesB }}표</span>
                  <span class="vote-percentage-large">{{ votesBPercentage }}%</span>
                </div>
              </div>
              <div class="vote-progress-bar">
                <div
                  class="vote-progress-fill progress-b"
                  :style="{ width: `${votesBPercentage}%` }"
                ></div>
              </div>
              <div v-if="voting" class="vote-loading">
                <v-progress-circular indeterminate size="20" width="2"></v-progress-circular>
              </div>
            </div>
          </div>

          <!-- 투표 완료 메시지 -->
          <div v-if="hasVoted" class="vote-completed">
            <v-alert type="success" variant="tonal" class="text-center">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              투표가 완료되었습니다! 다른 ScentStalker들의 의견을 확인해보세요.
            </v-alert>
          </div>

          <!-- 로그인 안내 -->
          <div v-if="!loginStore.isLoggedIn" class="login-notice">
            <v-alert type="info" variant="tonal" class="text-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              투표하려면 로그인이 필요합니다.
              <v-btn
                @click="$router.push({ name: 'login' })"
                color="primary"
                variant="text"
                class="ml-2"
              >
                로그인하기
              </v-btn>
            </v-alert>
          </div>
        </div>

        <!-- 댓글 섹션 -->
        <div class="comments-section">
          <div class="comments-header">
            <h3 class="comments-title">
              <v-icon class="mr-2" color="#57C675">mdi-comment-multiple</v-icon>
              Echo Whispers ({{ debate.comments }})
            </h3>
            <v-btn
              v-if="loginStore.isLoggedIn"
              @click="addComment"
              color="#57C675"
              variant="outlined"
              size="small"
            >
              댓글 작성
            </v-btn>
          </div>

          <div class="comments-placeholder">
            <div class="placeholder-content">
              <v-icon size="48" color="#bdc3c7">mdi-comment-outline</v-icon>
              <h4>댓글 시스템 준비 중입니다</h4>
              <p>곧 ScentStalker들의 다양한 의견을 나눌 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.agora-detail-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 64px;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
}

.loading-section,
.error-section {
  text-align: center;
  padding: 80px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.loading-text {
  margin-top: 16px;
  color: #718096;
  font-size: 1rem;
}

.detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.back-btn {
  color: #57c675 !important;
}

.detail-title-area {
  flex: 1;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.3;
  font-family: 'NanumBarunGothic', sans-serif;
}

.detail-meta {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.debate-intro {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.intro-left {
  flex: 1;
}

.debate-desc {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.debate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.created-date {
  font-size: 0.875rem;
  color: #718096;
}

.detail-mascot {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 투표 섹션 */
.voting-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.voting-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
  text-align: center;
  font-family: 'NanumBarunGothic', sans-serif;
}

.voting-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.vote-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  position: relative;
}

.vote-card:hover:not(.voting-disabled) {
  border-color: #57c675;
  transform: scale(1.02);
  background: #f7fafc;
}

.voting-disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.vote-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vote-option-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.vote-card-a .vote-option-title {
  color: #57c675;
}

.vote-card-b .vote-option-title {
  color: #6fb8f4;
}

.vote-stats {
  text-align: right;
}

.vote-count-large {
  display: block;
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 4px;
}

.vote-percentage-large {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.vote-progress-bar {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.vote-progress-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-a {
  background: linear-gradient(90deg, #57c675, #68d391);
}

.progress-b {
  background: linear-gradient(90deg, #6fb8f4, #90cdf4);
}

.vote-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 8px;
}

.vs-divider {
  text-align: center;
  margin: 8px 0;
}

.vs-divider span {
  background: white;
  color: #a0aec0;
  font-weight: 700;
  font-size: 1rem;
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
}

.vote-completed {
  margin-top: 16px;
}

.login-notice {
  margin-top: 16px;
}

/* 댓글 섹션 */
.comments-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.comments-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  font-family: 'NanumBarunGothic', sans-serif;
}

.comments-placeholder {
  text-align: center;
  padding: 60px 20px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.placeholder-content h4 {
  color: #4a5568;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 16px 0 8px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.placeholder-content p {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .detail-view {
    padding: 16px;
  }

  .debate-intro {
    flex-direction: column;
    text-align: center;
  }

  .vote-card-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .vote-stats {
    text-align: center;
  }

  .comments-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .detail-header,
  .debate-intro,
  .voting-section,
  .comments-section {
    padding: 20px;
  }

  .detail-title {
    font-size: 1.25rem;
  }

  .voting-title {
    font-size: 1.125rem;
  }
}
</style>
