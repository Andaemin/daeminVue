<!-- client/src/views/UserProfileView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/layouts/HeaderNav.vue'
import BadgeCollection from '@/components/base/BadgeCollection.vue'
import userDefault from '@/assets/user_default.png'
import sproutCreature from '@/assets/sproutCreature.png'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// 사용자 정보
const user = ref(null)
const loading = ref(true)
const error = ref(false)

// 사용자 ID 가져오기
const userId = route.params.id

// 사용자 정보 로드
const loadUserProfile = async () => {
  try {
    loading.value = true
    const res = await axios.get(`/api/users/${userId}`)
    user.value = res.data
  } catch (err) {
    console.error('사용자 정보 로드 실패:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 뒤로가기
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  loadUserProfile()
})
</script>

<template>
  <HeaderNav />

  <v-container
    fluid
    class="bg-caf-navy min-h-screen d-flex align-center justify-center"
    style="padding-top: 64px"
  >
    <!-- 로딩 상태 -->
    <v-card v-if="loading" class="pa-8 text-center" max-width="400" rounded="lg">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
      <div class="text-body-1">사용자 정보를 불러오는 중...</div>
    </v-card>

    <!-- 에러 상태 -->
    <v-card v-else-if="error" class="pa-8 text-center" max-width="400" rounded="lg">
      <v-icon icon="mdi-account-off" size="64" color="grey" class="mb-4" />
      <div class="text-h6 mb-2">사용자를 찾을 수 없습니다</div>
      <div class="text-body-2 text-grey-darken-1 mb-4">
        존재하지 않는 사용자이거나 접근할 수 없습니다.
      </div>
      <v-btn color="primary" @click="goBack">뒤로가기</v-btn>
    </v-card>

    <!-- 사용자 프로필 -->
    <v-card v-else max-width="800" width="100%" class="mx-4" rounded="lg" elevation="8">
      <!-- 헤더 -->
      <v-card-title class="pa-6 d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" class="mr-4" />
        <v-avatar size="32" class="mr-3">
          <v-img :src="sproutCreature" alt="SproutCreature" />
        </v-avatar>

        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold">SproutFinder 프로필</div>
          <div class="text-body-2 text-grey-darken-1">{{ user.nickname }}님의 정보</div>
        </div>
      </v-card-title>

      <!-- 메인 컨텐츠 -->
      <v-card-text class="pa-8">
        <v-row>
          <!-- 왼쪽: 프로필 이미지 및 기본 정보 -->
          <v-col cols="12" md="5" class="d-flex flex-column align-center">
            <!-- 프로필 이미지 -->
            <v-avatar size="120" class="mb-4">
              <v-img :src="user.profileImage || userDefault" alt="프로필 이미지" />
            </v-avatar>

            <!-- 닉네임 -->
            <div class="text-h5 font-weight-bold mb-2">{{ user.nickname }}</div>

            <!-- 이름 -->
            <div class="text-body-1 text-grey-darken-1 mb-4">{{ user.name }}</div>

            <!-- 태그들 -->
            <div class="d-flex flex-wrap justify-center gap-2 mb-4">
              <!-- 직책 태그 -->
              <v-chip color="green-lighten-3" size="default" variant="elevated">
                <v-icon start icon="mdi-account-tie" />
                {{ user.job }}
              </v-chip>

              <!-- 브랜드 태그 -->
              <v-chip
                :color="user.brand === 'Solo Roaster' ? 'orange-lighten-3' : 'blue-lighten-3'"
                size="default"
                variant="elevated"
              >
                <v-icon start :icon="user.brand === 'Solo Roaster' ? 'mdi-coffee' : 'mdi-domain'" />
                {{ user.brand }}
              </v-chip>
            </div>

            <!-- 가입일 -->
            <div class="text-body-2 text-grey-darken-2">
              <v-icon icon="mdi-calendar" size="16" class="mr-1" />
              {{
                new Date(user.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
              가입
            </div>
          </v-col>

          <!-- 오른쪽: 뱃지 컬렉션 -->
          <v-col cols="12" md="7">
            <!-- 뱃지 섹션 -->
            <v-card rounded="lg" elevation="1">
              <v-card-title class="pa-4 d-flex align-center">
                <v-icon icon="mdi-medal" class="mr-2" color="orange" />
                <span class="text-h6 font-weight-bold">보유 뱃지</span>
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-4">
                <!-- SproutCreature 메시지 -->
                <div class="d-flex align-center mb-4 pa-3 bg-grey-lighten-4 rounded">
                  <v-avatar size="32" class="mr-3">
                    <v-img :src="sproutCreature" alt="SproutCreature" />
                  </v-avatar>
                  <div class="text-body-2 text-grey-darken-2">
                    {{ user.nickname }}님이 획득한 소중한 뱃지들이에요! ✨
                  </div>
                </div>

                <!-- 뱃지 컬렉션 -->
                <BadgeCollection
                  :user-id="user.id"
                  :show-all="false"
                  :max-display="0"
                  size="default"
                />
              </v-card-text>
            </v-card>

            <!-- 추가 정보 (선택사항) -->
            <v-card rounded="lg" elevation="1" class="mt-4">
              <v-card-title class="pa-4">
                <v-icon icon="mdi-information" class="mr-2" color="blue" />
                <span class="text-h6 font-weight-bold">CaFverse 활동</span>
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-4">
                <div class="text-center text-grey-darken-1">
                  <v-icon icon="mdi-coffee" size="48" class="mb-2" />
                  <div class="text-body-2">CaFverse에서 활발하게 활동 중인 SproutFinder입니다!</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.bg-caf-navy {
  background-color: #2c3e50;
}

.min-h-screen {
  min-height: 100vh;
}
</style>
