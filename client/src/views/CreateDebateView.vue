<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgoraStore } from '@/store/agoraStore'
import { useLoginStore } from '@/store/login'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import sproutMulumm from '@/assets/sprout_mulumm.png'

const router = useRouter()
const agoraStore = useAgoraStore()
const loginStore = useLoginStore()

// 폼 데이터
const formData = ref({
  title: '',
  description: '',
  optionA: '',
  optionB: '',
  category: 'general',
})

// 폼 상태
const loading = ref(false)
const errors = ref({})

// 카테고리 옵션
const categories = [
  { value: 'general', title: '일반 토론', color: '#6BB6FF' },
  { value: 'brand-comparison', title: '브랜드 비교', color: '#FF6F00' },
  { value: 'work-life', title: '직장/알바', color: '#4CAF50' },
  { value: 'business-dream', title: '창업/사업', color: '#9C27B0' },
  { value: 'taste-debate', title: '맛/취향', color: '#F44336' },
  { value: 'lifestyle', title: '라이프스타일', color: '#00BCD4' },
]

// 유효성 검사
const validateForm = () => {
  const newErrors = {}

  if (!formData.value.title.trim()) {
    newErrors.title = '토론 제목을 입력해주세요'
  } else if (formData.value.title.length < 5) {
    newErrors.title = '제목은 5자 이상 입력해주세요'
  } else if (formData.value.title.length > 100) {
    newErrors.title = '제목은 100자 이하로 입력해주세요'
  }

  if (!formData.value.description.trim()) {
    newErrors.description = '토론 설명을 입력해주세요'
  } else if (formData.value.description.length < 10) {
    newErrors.description = '설명은 10자 이상 입력해주세요'
  } else if (formData.value.description.length > 500) {
    newErrors.description = '설명은 500자 이하로 입력해주세요'
  }

  if (!formData.value.optionA.trim()) {
    newErrors.optionA = '첫 번째 선택지를 입력해주세요'
  } else if (formData.value.optionA.length > 50) {
    newErrors.optionA = '선택지는 50자 이하로 입력해주세요'
  }

  if (!formData.value.optionB.trim()) {
    newErrors.optionB = '두 번째 선택지를 입력해주세요'
  } else if (formData.value.optionB.length > 50) {
    newErrors.optionB = '선택지는 50자 이하로 입력해주세요'
  }

  if (formData.value.optionA.trim() === formData.value.optionB.trim()) {
    newErrors.optionB = '두 선택지는 서로 달라야 합니다'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// 폼 유효성
const isFormValid = computed(() => {
  return (
    formData.value.title.trim() &&
    formData.value.description.trim() &&
    formData.value.optionA.trim() &&
    formData.value.optionB.trim()
  )
})

// 뒤로가기
const goBack = () => {
  if (isFormDirty.value) {
    if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
      router.push({ name: 'agora' })
    }
  } else {
    router.push({ name: 'agora' })
  }
}

// 폼 변경 감지
const isFormDirty = computed(() => {
  return (
    formData.value.title.trim() ||
    formData.value.description.trim() ||
    formData.value.optionA.trim() ||
    formData.value.optionB.trim()
  )
})

// 토론 생성
const createDebate = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    const debateData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      optionA: formData.value.optionA.trim(),
      optionB: formData.value.optionB.trim(),
      category: formData.value.category,
      authorId: loginStore.user.id,
      authorName: loginStore.user.nickname || loginStore.user.name,
    }

    const newDebate = await agoraStore.createDebate(debateData, loginStore.token)

    // 성공 시 상세 페이지로 이동
    router.push({
      name: 'agoraDetail',
      params: { id: newDebate.id },
    })
  } catch (error) {
    console.error('토론 생성 실패:', error)
    alert('토론 생성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

// 폼 초기화
const resetForm = () => {
  if (confirm('작성한 내용을 모두 지우시겠습니까?')) {
    formData.value = {
      title: '',
      description: '',
      optionA: '',
      optionB: '',
      category: 'general',
    }
    errors.value = {}
  }
}

// 로그인 체크
onMounted(() => {
  if (!loginStore.isLoggedIn) {
    alert('로그인이 필요한 기능입니다.')
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <HeaderNav />

  <div class="create-debate-container">
    <div class="create-view">
      <!-- 헤더 -->
      <div class="header-section">
        <div class="header-content">
          <v-btn icon variant="text" @click="goBack" class="back-btn">
            <v-icon size="24">mdi-arrow-left</v-icon>
          </v-btn>

          <div class="title-area">
            <h1 class="page-title">🌱 새로운 Agora!</h1>
            <p class="page-subtitle">SproutFinder들과 토론을 시작해보세요</p>
          </div>

          <img :src="sproutMulumm" alt="Sprout Question" class="mascot-img" />
        </div>
      </div>

      <!-- 메인 폼 -->
      <div class="form-container">
        <div class="form-section">
          <v-form @submit.prevent="createDebate">
            <!-- 토론 제목 -->
            <div class="field-group">
              <label class="field-label">토론 제목</label>
              <v-text-field
                v-model="formData.title"
                placeholder="어떤 주제로 토론하고 싶으신가요?"
                variant="outlined"
                :error-messages="errors.title"
                :counter="100"
                maxlength="100"
                class="custom-field"
              />
            </div>

            <!-- 토론 설명 -->
            <div class="field-group">
              <label class="field-label">토론 설명</label>
              <v-textarea
                v-model="formData.description"
                placeholder="토론 주제에 대해 자세히 설명해주세요. ScentStalker들이 쉽게 이해할 수 있도록 구체적으로 작성해주세요."
                variant="outlined"
                :error-messages="errors.description"
                :counter="500"
                maxlength="500"
                rows="4"
                class="custom-field"
              />
            </div>

            <!-- 카테고리 선택 -->
            <div class="field-group">
              <label class="field-label">카테고리</label>
              <v-select
                v-model="formData.category"
                :items="categories"
                item-title="title"
                item-value="value"
                variant="outlined"
                class="custom-field"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <div class="category-dot" :style="{ backgroundColor: item.raw.color }"></div>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>

            <!-- 선택지 입력 -->
            <div class="options-section">
              <h3 class="options-title">투표 선택지</h3>

              <div class="options-grid">
                <!-- 선택지 A -->
                <div class="option-field">
                  <label class="option-label option-a-label">선택지 A</label>
                  <v-text-field
                    v-model="formData.optionA"
                    placeholder="첫 번째 선택지"
                    variant="outlined"
                    :error-messages="errors.optionA"
                    :counter="50"
                    maxlength="50"
                    class="custom-field option-a-field"
                  />
                </div>

                <div class="vs-divider">VS</div>

                <!-- 선택지 B -->
                <div class="option-field">
                  <label class="option-label option-b-label">선택지 B</label>
                  <v-text-field
                    v-model="formData.optionB"
                    placeholder="두 번째 선택지"
                    variant="outlined"
                    :error-messages="errors.optionB"
                    :counter="50"
                    maxlength="50"
                    class="custom-field option-b-field"
                  />
                </div>
              </div>
            </div>

            <!-- 미리보기 -->
            <div v-if="isFormValid" class="preview-section">
              <h3 class="preview-title">미리보기</h3>
              <div class="preview-card">
                <h4 class="preview-debate-title">{{ formData.title }}</h4>
                <p class="preview-description">{{ formData.description }}</p>

                <div class="preview-options">
                  <div class="preview-option preview-option-a">
                    <span class="preview-option-name">{{ formData.optionA }}</span>
                    <span class="preview-percentage">0%</span>
                  </div>

                  <div class="preview-vs">VS</div>

                  <div class="preview-option preview-option-b">
                    <span class="preview-option-name">{{ formData.optionB }}</span>
                    <span class="preview-percentage">0%</span>
                  </div>
                </div>

                <div class="preview-footer">
                  <span class="preview-author">{{
                    loginStore.user?.nickname || loginStore.user?.name
                  }}</span>
                  <span class="preview-date">{{ new Date().toLocaleDateString('ko-KR') }}</span>
                </div>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="action-buttons">
              <v-btn
                @click="resetForm"
                variant="outlined"
                color="grey"
                size="large"
                :disabled="!isFormDirty || loading"
              >
                초기화
              </v-btn>

              <v-btn
                type="submit"
                color="#57C675"
                size="large"
                :disabled="!isFormValid || loading"
                :loading="loading"
              >
                토론 시작하기
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-debate-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 64px;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
}

.create-view {
  max-width: 800px;
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

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
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

/* 폼 컨테이너 */
.form-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.form-section {
  max-width: 100%;
}

/* 필드 그룹 */
.field-group {
  margin-bottom: 32px;
}

.field-label {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.custom-field {
  font-family: 'NanumSquareRound', sans-serif;
}

.custom-field :deep(.v-field) {
  border-radius: 12px;
}

.custom-field :deep(.v-field--focused) {
  border-color: #57c675;
}

/* 카테고리 선택 */
.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

/* 선택지 섹션 */
.options-section {
  margin-bottom: 32px;
}

.options-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: start;
}

.option-field {
  display: flex;
  flex-direction: column;
}

.option-label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.option-a-label {
  color: #57c675;
}

.option-b-label {
  color: #6fb8f4;
}

.option-a-field :deep(.v-field--focused) {
  border-color: #57c675;
}

.option-b-field :deep(.v-field--focused) {
  border-color: #6fb8f4;
}

.vs-divider {
  align-self: center;
  margin-top: 20px;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 700;
  font-size: 1rem;
  padding: 12px 16px;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
}

/* 미리보기 섹션 */
.preview-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px dashed #cbd5e1;
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 16px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.preview-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.preview-debate-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
  line-height: 1.4;
  font-family: 'NanumBarunGothic', sans-serif;
}

.preview-description {
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.preview-options {
  margin-bottom: 16px;
}

.preview-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.preview-option-a {
  border-left: 4px solid #57c675;
}

.preview-option-b {
  border-left: 4px solid #6fb8f4;
}

.preview-option-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.preview-percentage {
  font-weight: 700;
  color: #64748b;
  font-size: 0.875rem;
}

.preview-vs {
  text-align: center;
  font-weight: 700;
  color: #a0aec0;
  font-size: 0.875rem;
  margin: 8px 0;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #718096;
}

.preview-author {
  font-weight: 600;
  color: #4a5568;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.action-buttons .v-btn {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 600;
  text-transform: none;
  min-width: 120px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .create-view {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .form-container {
    padding: 24px;
  }

  .options-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .vs-divider {
    margin-top: 0;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .v-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-section,
  .form-container {
    padding: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .field-group {
    margin-bottom: 24px;
  }

  .preview-section {
    padding: 16px;
  }
}

/* 폼 애니메이션 */
.field-group {
  transition: all 0.3s ease;
}

.field-group:focus-within {
  transform: translateY(-2px);
}

.preview-card {
  transition: all 0.3s ease;
}

.preview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
