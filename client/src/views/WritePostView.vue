<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/store/login'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import { categoryChips, getCategoryByKey } from '@/data/chipCategories.js'
import sproutCreature from '@/assets/sproutCreature.png'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()

// 폼 데이터
const postData = ref({
  title: '',
  content: '',
  category: '',
  isAnonymous: false,
})

// UI 상태
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const rules = {
  title: [
    (v) => !!v || '제목을 입력해주세요',
    (v) => (v && v.length >= 2) || '제목은 최소 2자 이상이어야 합니다',
  ],
  content: [
    (v) => !!v || '내용을 입력해주세요',
    (v) => (v && v.length >= 10) || '내용은 최소 10자 이상이어야 합니다',
  ],
  category: [(v) => !!v || '카테고리를 선택해주세요'],
}

// 카테고리 옵션들
const categoryOptions = categoryChips.map((chip) => ({
  title: chip.name,
  value: chip.key,
  color: chip.color,
}))

// 현재 선택된 카테고리 정보
const selectedCategory = computed(() => {
  return getCategoryByKey(postData.value.category)
})

// 로그인 체크
const checkLogin = () => {
  if (!loginStore.isLoggedIn) {
    router.push({ name: 'login' })
    return false
  }
  return true
}

// 게시글 작성
const submitPost = async () => {
  loading.value = true

  try {
    const payload = {
      title: postData.value.title,
      content: postData.value.content,
      category: postData.value.category,
      isAnonymous: postData.value.isAnonymous,
      userId: loginStore.user.id,
    }

    const res = await axios.post('/api/posts', payload, {
      headers: {
        Authorization: `Bearer ${loginStore.token}`,
      },
    })

    showSnackbar('게시글이 성공적으로 작성되었습니다!', 'success')

    // 작성 완료 후 해당 카테고리 게시판으로 이동
    setTimeout(() => {
      router.push({
        name: 'boardview',
        params: { category: postData.value.category },
      })
    }, 1500)
  } catch (err) {
    console.error('게시글 작성 실패:', err)
    showSnackbar('게시글 작성에 실패했습니다.', 'error')
  } finally {
    loading.value = false
  }
}

// 스낵바 표시
const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

// 뒤로가기
const goBack = () => {
  router.go(-1)
}

// 폼 초기화
const resetForm = () => {
  postData.value = {
    title: '',
    content: '',
    category: route.params.category || '',
    isAnonymous: false,
  }
}

// 초기화
onMounted(() => {
  if (!checkLogin()) return

  // URL 파라미터에서 카테고리 설정
  if (route.params.category) {
    postData.value.category = route.params.category
  }
})
</script>

<template>
  <HeaderNav />

  <v-container
    class="bg-caf-navy h-screen w-100"
    style="min-height: calc(100vh - 64px); padding: 32px"
    fluid
  >
    <!-- SproutCreature 안내 -->
    <div class="creature-guide">
      <v-avatar size="60" class="creature-avatar">
        <v-img :src="sproutCreature" alt="SproutCreature" />
      </v-avatar>
      <div class="guide-bubble">
        <div class="bubble-content">
          게시글 작성을 해봐! 🌱<br />
          멋진 이야기를 CaFverse에 남겨보자!
        </div>
        <div class="bubble-tail"></div>
      </div>
    </div>

    <!-- 헤더 -->
    <div class="write-header">
      <v-btn icon variant="text" @click="goBack" color="white" class="back-button">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <div class="header-content">
        <h1 class="page-title">게시글 작성</h1>
        <p class="page-subtitle">CaFverse에 당신의 이야기를 남겨보세요</p>
      </div>
    </div>

    <!-- 메인 폼 -->
    <v-form @submit.prevent="submitPost" class="write-form">
      <v-row>
        <!-- 왼쪽: 기본 정보 -->
        <v-col cols="12" lg="8">
          <!-- 제목 -->
          <div class="form-section">
            <label class="form-label">제목</label>
            <v-text-field
              v-model="postData.title"
              variant="outlined"
              placeholder="어떤 이야기를 들려주실 건가요?"
              :rules="rules.title"
              hide-details="auto"
              class="title-input"
              density="comfortable"
              bg-color="white"
            />
          </div>

          <!-- 내용 -->
          <div class="form-section">
            <label class="form-label">내용</label>
            <v-textarea
              v-model="postData.content"
              variant="outlined"
              placeholder="당신의 CaFverse 경험을 자세히 들려주세요..."
              :rules="rules.content"
              rows="16"
              hide-details="auto"
              counter="2000"
              maxlength="2000"
              class="content-textarea"
              bg-color="white"
            />
          </div>
        </v-col>

        <!-- 오른쪽: 설정 -->
        <v-col cols="12" lg="4">
          <!-- 카테고리 선택 -->
          <div class="form-section">
            <label class="form-label">카테고리</label>
            <v-select
              v-model="postData.category"
              :items="categoryOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              :rules="rules.category"
              hide-details="auto"
              placeholder="카테고리를 선택하세요"
              density="comfortable"
              bg-color="white"
            >
              <template v-slot:selection="{ item }">
                <v-chip :color="item.raw.color" text-color="white" size="small">
                  {{ item.raw.title }}
                </v-chip>
              </template>
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar size="12" :color="item.raw.color" class="mr-3"></v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>

          <!-- 작성 옵션 -->
          <div class="form-section">
            <label class="form-label">작성 옵션</label>
            <div class="option-card">
              <v-checkbox
                v-model="postData.isAnonymous"
                label="익명으로 작성"
                color="primary"
                hide-details
                class="anonymous-checkbox"
              />
              <p class="option-description">익명 작성 시 '익명'으로 표시됩니다</p>
            </div>
          </div>

          <!-- 작성자 미리보기 -->
          <div class="form-section">
            <label class="form-label">작성자 정보</label>
            <div class="author-preview">
              <v-avatar size="32" class="author-avatar">
                <v-img
                  :src="loginStore.user?.profileImage || '/src/assets/user_default.png'"
                  alt="프로필"
                />
              </v-avatar>
              <div class="author-info">
                <div class="author-name">
                  {{ postData.isAnonymous ? '익명' : loginStore.user?.name }}
                </div>
                <div class="author-details">
                  {{ loginStore.user?.job || '직원' }} •
                  {{ loginStore.user?.brand || 'Solo Roaster' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 버튼들 -->
          <div class="form-section">
            <div class="button-group">
              <v-btn variant="outlined" @click="resetForm" class="reset-button" block color="white">
                초기화
              </v-btn>

              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="!postData.title || !postData.content || !postData.category"
                class="submit-button"
                block
              >
                게시글 작성
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <!-- 스낵바 -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar = false"> 닫기 </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.bg-caf-navy {
  background-color: #2c3e50;
}

/* SproutCreature 안내 */
.creature-guide {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.creature-avatar {
  margin-right: 16px;
}

.guide-bubble {
  position: relative;
  background: white;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.bubble-content {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  line-height: 1.5;
  font-family: 'NanumBarunGothic', sans-serif;
}

.bubble-tail {
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid white;
}

/* 헤더 */
.write-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.back-button {
  margin-right: 16px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-family: 'NanumBarunGothic', sans-serif;
}

/* 폼 */
.write-form {
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 32px;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.title-input :deep(.v-field__input) {
  font-size: 1.1rem;
  font-family: 'NanumBarunGothic', sans-serif;
}

.content-textarea :deep(.v-field__input) {
  font-size: 1rem;
  line-height: 1.6;
  font-family: 'NanumBarunGothic', sans-serif;
}

.option-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.anonymous-checkbox :deep(.v-label) {
  font-family: 'NanumBarunGothic', sans-serif;
  color: white;
}

.option-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 8px 0 0 32px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.author-preview {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.author-avatar {
  margin-right: 12px;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.author-details {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'NanumBarunGothic', sans-serif;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reset-button,
.submit-button {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 600;
  text-transform: none;
}

.submit-button {
  font-size: 1rem;
}

/* 반응형 */
@media (max-width: 1280px) {
  .creature-guide {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .creature-guide {
    flex-direction: column;
    text-align: center;
  }

  .creature-avatar {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .bubble-tail {
    display: none;
  }

  .write-header {
    flex-direction: column;
    text-align: center;
  }

  .back-button {
    position: absolute;
    left: 0;
    top: 0;
    margin-right: 0;
  }

  .form-section {
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
