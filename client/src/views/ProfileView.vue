<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/login'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import BadgeCollection from '@/components/base/BadgeCollection.vue'
import userDefault from '@/assets/user_default.png'
import sproutCreature from '@/assets/sproutCreature.png'
import axios from 'axios'

const router = useRouter()
const loginStore = useLoginStore()

// 폼 데이터
const profileData = ref({
  name: '',
  nickname: '',
  email: '',
  job: '',
  brand: '',
  profileImage: null,
})

// UI 상태
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const imagePreview = ref('')
const showAllBadges = ref(false) // 뱃지 토글 상태 추가

// 직업 옵션들 (단순화)
const jobOptions = ['직원', '점주', '바리스타', '건물주', '아르바이트생']

// 브랜드 옵션들 (Great Roasteries 제거)
const brandOptions = [
  'Solo Roaster',
  '스타벅스',
  '블루보틀',
  '투썸플레이스',
  '이디야커피',
  '할리스커피',
  '탐앤탐스',
  '던킨도너츠',
  '블루포트 (명지 본관 1층)',
]

// 로그인 체크
const checkLogin = () => {
  if (!loginStore.isLoggedIn) {
    router.push({ name: 'login' })
    return false
  }
  return true
}

// 프로필 데이터 로드
const loadProfile = async () => {
  if (!loginStore.user?.id) return

  try {
    const res = await axios.get(`/api/users/${loginStore.user.id}`)
    const userData = res.data

    profileData.value = {
      name: userData.name || '',
      nickname: userData.nickname || '',
      email: userData.email || '',
      job: userData.job || '',
      brand: userData.brand || 'Solo Roaster',
      profileImage: null,
    }

    imagePreview.value = userData.profileImage || userDefault
  } catch (err) {
    console.error('프로필 로딩 실패:', err)
    showSnackbar('프로필 정보를 불러오는데 실패했습니다.', 'error')
  }
}

// 이미지 파일 선택 처리
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileData.value.profileImage = file

    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 프로필 업데이트
const updateProfile = async () => {
  loading.value = true

  try {
    // FormData 생성 (이미지 업로드 포함)
    const formData = new FormData()
    formData.append('name', profileData.value.name)
    formData.append('nickname', profileData.value.nickname)
    formData.append('email', profileData.value.email)
    formData.append('job', profileData.value.job)
    formData.append('brand', profileData.value.brand)

    if (profileData.value.profileImage) {
      formData.append('profileImage', profileData.value.profileImage)
    }

    const res = await axios.put(`/api/users/${loginStore.user.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${loginStore.token}`,
      },
    })

    // 로그인 스토어 업데이트
    loginStore.setLogin(
      {
        ...loginStore.user,
        name: profileData.value.name,
        nickname: profileData.value.nickname,
        profileImage: res.data.profileImage || loginStore.user.profileImage,
      },
      loginStore.token,
    )

    showSnackbar('프로필이 성공적으로 업데이트되었습니다!', 'success')
  } catch (err) {
    console.error('프로필 업데이트 실패:', err)
    showSnackbar('프로필 업데이트에 실패했습니다.', 'error')
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

// 로그아웃
const logout = () => {
  loginStore.logout()
  router.push({ name: 'login' })
}

// 뒤로가기
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  if (checkLogin()) {
    loadProfile()
  }
})
</script>

<template>
  <HeaderNav />

  <v-container
    fluid
    class="bg-caf-navy h-screen d-flex align-center justify-center"
    style="padding-top: 64px"
  >
    <v-card max-width="900" width="100%" class="mx-4" rounded="lg" elevation="8">
      <!-- 헤더 -->
      <v-card-title class="pa-6 d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" class="mr-4" />
        <v-avatar size="32" class="mr-3">
          <v-img :src="sproutCreature" alt="SproutCreature" />
        </v-avatar>

        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold">프로필 설정</div>
          <div class="text-body-2 text-grey-darken-1">CaFverse 정보 업데이트</div>
        </div>
      </v-card-title>

      <!-- 메인 컨텐츠 -->
      <v-card-text class="pa-8">
        <v-row>
          <!-- 왼쪽: 프로필 이미지 -->
          <v-col cols="12" md="4" class="d-flex flex-column align-center">
            <div class="position-relative mb-4">
              <v-avatar size="120">
                <v-img :src="imagePreview" alt="프로필 이미지" />
              </v-avatar>

              <v-btn
                icon
                size="small"
                color="primary"
                class="position-absolute"
                style="bottom: -4px; right: -4px"
                @click="$refs.imageInput.click()"
                elevation="2"
              >
                <v-icon size="16">mdi-camera</v-icon>
              </v-btn>
            </div>

            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              style="display: none"
            />

            <v-chip color="primary" size="default" class="mb-4">
              {{ loginStore.user?.nickname || 'User' }}
            </v-chip>
          </v-col>

          <!-- 오른쪽: 폼 -->
          <v-col cols="12" md="8">
            <v-form @submit.prevent="updateProfile">
              <!-- 기본 정보 -->
              <div class="mb-6">
                <div class="text-h6 font-weight-bold mb-4">기본 정보</div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="mb-2 text-body-2 font-weight-medium">이름</div>
                    <v-text-field
                      v-model="profileData.name"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="mb-2 text-body-2 font-weight-medium">닉네임</div>
                    <v-text-field
                      v-model="profileData.nickname"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <div class="mb-2 text-body-2 font-weight-medium">이메일</div>
                    <v-text-field
                      v-model="profileData.email"
                      type="email"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- CaFverse 정보 -->
              <div class="mb-6">
                <div class="text-h6 font-weight-bold mb-4">CaFverse 정보</div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="mb-2 text-body-2 font-weight-medium">직책/역할</div>
                    <v-select
                      v-model="profileData.job"
                      :items="jobOptions"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="mb-2 text-body-2 font-weight-medium">소속 브랜드</div>
                    <v-select
                      v-model="profileData.brand"
                      :items="brandOptions"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- 버튼들 -->
              <div class="d-flex gap-4 justify-center">
                <v-btn
                  type="submit"
                  color="indigo-darken-3"
                  :loading="loading"
                  size="large"
                  class="font-weight-bold ma-2 px-8"
                >
                  저장
                </v-btn>

                <v-btn
                  color="red"
                  variant="outlined"
                  @click="logout"
                  size="large"
                  class="font-weight-bold px-8"
                >
                  로그아웃
                </v-btn>
              </div>
            </v-form>
          </v-col>
        </v-row>

        <!-- 뱃지 섹션 -->
        <v-card rounded="lg" elevation="1" class="mt-4">
          <v-card-title class="pa-3 d-flex align-center">
            <v-icon icon="mdi-medal" class="mr-2" color="orange" size="20" />
            <span class="text-subtitle-1 font-weight-bold">SproutFinder 뱃지</span>
            <v-spacer />
            <!-- 전체/보유 토글 버튼 -->
            <v-btn
              variant="text"
              size="small"
              color="primary"
              @click="showAllBadges = !showAllBadges"
              class="text-caption px-2"
            >
              {{ showAllBadges ? '보유만' : '전체' }}
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-3">
            <!-- 뱃지 컬렉션 -->
            <BadgeCollection
              :user-id="loginStore.user?.id"
              :show-all="showAllBadges"
              :max-display="showAllBadges ? 0 : 6"
              size="small"
              @show-more="showAllBadges = true"
            />
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
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

.speech-bubble-tail {
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
}

/* 뱃지 섹션 애니메이션 */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
