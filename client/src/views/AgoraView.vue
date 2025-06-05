<script setup>
import { ref, onMounted } from 'vue'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { useRouter } from 'vue-router'
import sproutMangchi from '@/assets/sprout_mangchi.png'
import axios from 'axios'

const router = useRouter()
const debates = ref([])
const loading = ref(true)
const selectedDebate = ref(null)

// 한글 토론 데이터
const mockDebates = [
  {
    id: 1,
    title: '스타벅스 vs 이디야: 가성비 어느 쪽이 더 좋을까?',
    description:
      '같은 가격대 메뉴를 비교했을 때, 어디가 더 만족스러운지 ScentStalker들의 의견을 들어보고 싶어요!',
    optionA: '스타벅스',
    optionB: '이디야',
    votesA: 145,
    votesB: 98,
    totalVotes: 243,
    category: 'brand-comparison',
    author: '향찾는바리스타',
    createdAt: '2024-06-01',
    comments: 32,
  },
  {
    id: 2,
    title: '카페 알바 vs 편의점 알바: 어느 쪽이 더 나을까?',
    description: 'SproutFinder들을 위한 질문! 첫 아르바이트로 어느 쪽을 추천하시나요?',
    optionA: '카페 알바',
    optionB: '편의점 알바',
    votesA: 87,
    votesB: 45,
    totalVotes: 132,
    category: 'work-life',
    author: 'WhiffKeeper_민지',
    createdAt: '2024-06-02',
    comments: 18,
  },
  {
    id: 3,
    title: '개인카페 vs 프렌차이즈: 창업한다면?',
    description:
      'CaFverse에서 창조주가 된다면, Solo Roaster와 Great Roasteries 중 어느 길을 선택하시겠어요?',
    optionA: 'Solo Roaster (개인카페)',
    optionB: 'Great Roasteries (프렌차이즈)',
    votesA: 156,
    votesB: 89,
    totalVotes: 245,
    category: 'business-dream',
    author: 'EchoMaker_준호',
    createdAt: '2024-06-03',
    comments: 41,
  },
  {
    id: 4,
    title: '아침 커피 vs 오후 커피: 언제가 더 맛있을까?',
    description:
      '같은 원두, 같은 바리스타가 내린 커피라도 시간대에 따라 맛이 다르다고 생각하시나요?',
    optionA: '아침 커피',
    optionB: '오후 커피',
    votesA: 67,
    votesB: 54,
    totalVotes: 121,
    category: 'taste-debate',
    author: '아로마시커_수진',
    createdAt: '2024-06-04',
    comments: 15,
  },
]

// 토론 참여하기
const participate = async (debate, option) => {
  // TODO: 실제 투표 API 호출
  if (option === 'A') {
    debate.votesA++
  } else {
    debate.votesB++
  }
  debate.totalVotes++
}

// 토론 상세보기
const viewDebateDetail = (debate) => {
  selectedDebate.value = debate
}

// 상세 닫기
const closeDetail = () => {
  selectedDebate.value = null
}

// 새 토론 만들기
const createDebate = () => {
  alert('새로운 Echo Whisper 토론 생성 기능 준비 중입니다!')
}

// 포럼으로 돌아가기
const goToForum = () => {
  router.push({ name: 'forum' })
}

onMounted(async () => {
  // 나중에 실제 API로 교체
  // try {
  //   const res = await axios.get('/api/agora/debates')
  //   debates.value = res.data
  // } catch (err) {
  //   console.error('토론 데이터 로딩 실패:', err)
  // }

  // 임시 mock 데이터 사용
  setTimeout(() => {
    debates.value = mockDebates
    loading.value = false
  }, 500)
})
</script>

<template>
  <HeaderNav />

  <div class="agora-container">
    <!-- 메인 리스트 뷰 -->
    <div v-if="!selectedDebate" class="main-view">
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
      <div v-if="loading" class="loading-section">
        <v-progress-circular indeterminate color="#57C675" size="50"></v-progress-circular>
        <p class="loading-text">토론을 불러오는 중...</p>
      </div>

      <!-- 토론 목록 -->
      <div v-else class="debates-grid">
        <div
          v-for="debate in debates"
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
                <span class="option-percentage"
                  >{{ Math.round((debate.votesA / debate.totalVotes) * 100) }}%</span
                >
              </div>
              <div class="vote-bar">
                <div
                  class="vote-fill option-a-fill"
                  :style="{ width: `${(debate.votesA / debate.totalVotes) * 100}%` }"
                ></div>
              </div>
              <span class="vote-count">{{ debate.votesA }}표</span>
            </div>

            <div class="vs-text">VS</div>

            <div class="vote-option">
              <div class="option-header">
                <span class="option-name">{{ debate.optionB }}</span>
                <span class="option-percentage"
                  >{{ Math.round((debate.votesB / debate.totalVotes) * 100) }}%</span
                >
              </div>
              <div class="vote-bar">
                <div
                  class="vote-fill option-b-fill"
                  :style="{ width: `${(debate.votesB / debate.totalVotes) * 100}%` }"
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
      </div>
    </div>

    <!-- 상세 뷰 -->
    <div v-else class="detail-view">
      <div class="detail-header">
        <v-btn icon variant="text" @click="closeDetail" class="back-btn">
          <v-icon size="24">mdi-arrow-left</v-icon>
        </v-btn>
        <div class="detail-title-area">
          <h2 class="detail-title">{{ selectedDebate.title }}</h2>
          <p class="detail-meta">
            {{ selectedDebate.author }} • {{ selectedDebate.totalVotes }}명이 참여했습니다
          </p>
        </div>
      </div>

      <div class="detail-content">
        <!-- 토론 설명 -->
        <div class="debate-intro">
          <div class="intro-left">
            <p class="debate-desc">{{ selectedDebate.description }}</p>
          </div>
          <img :src="sproutMangchi" alt="Sprout Mangchi" class="detail-mascot" />
        </div>

        <!-- 투표 섹션 -->
        <div class="voting-section">
          <h3 class="voting-title">당신의 선택은?</h3>

          <div class="voting-options">
            <div class="vote-card vote-card-a" @click="participate(selectedDebate, 'A')">
              <div class="vote-card-content">
                <h4 class="vote-option-title">{{ selectedDebate.optionA }}</h4>
                <div class="vote-stats">
                  <span class="vote-count-large">{{ selectedDebate.votesA }}표</span>
                  <span class="vote-percentage-large"
                    >{{
                      Math.round((selectedDebate.votesA / selectedDebate.totalVotes) * 100)
                    }}%</span
                  >
                </div>
              </div>
              <div class="vote-progress-bar">
                <div
                  class="vote-progress-fill progress-a"
                  :style="{
                    width: `${(selectedDebate.votesA / selectedDebate.totalVotes) * 100}%`,
                  }"
                ></div>
              </div>
            </div>

            <div class="vs-divider">
              <span>VS</span>
            </div>

            <div class="vote-card vote-card-b" @click="participate(selectedDebate, 'B')">
              <div class="vote-card-content">
                <h4 class="vote-option-title">{{ selectedDebate.optionB }}</h4>
                <div class="vote-stats">
                  <span class="vote-count-large">{{ selectedDebate.votesB }}표</span>
                  <span class="vote-percentage-large"
                    >{{
                      Math.round((selectedDebate.votesB / selectedDebate.totalVotes) * 100)
                    }}%</span
                  >
                </div>
              </div>
              <div class="vote-progress-bar">
                <div
                  class="vote-progress-fill progress-b"
                  :style="{
                    width: `${(selectedDebate.votesB / selectedDebate.totalVotes) * 100}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 댓글 섹션 -->
        <div class="comments-section">
          <div class="comments-header">
            <h3 class="comments-title">
              <v-icon class="mr-2" color="#57C675">mdi-comment-multiple</v-icon>
              Echo Whispers ({{ selectedDebate.comments }})
            </h3>
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

/* 상세 뷰 */
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
  align-items: center;
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
  margin: 0;
}

.detail-mascot {
  width: 80px;
  height: 80px;
  object-fit: contain;
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
}

.vote-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.vote-card:hover {
  border-color: #57c675;
  transform: scale(1.02);
  background: #f7fafc;
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

/* 댓글 섹션 */
.comments-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.comments-header {
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
}

@media (max-width: 480px) {
  .main-view,
  .detail-view {
    padding: 16px;
  }

  .header-section,
  .debate-intro,
  .voting-section,
  .comments-section {
    padding: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .detail-title {
    font-size: 1.25rem;
  }
}
</style>
