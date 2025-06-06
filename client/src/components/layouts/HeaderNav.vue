<script setup>
import { useLoginStore } from '@/store/login'
import cafverseLogo from '@/assets/cafverse_logo_white.png'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import userDefault from '../../assets/user_default.png'

const loginStore = useLoginStore()
const router = useRouter()

const menu = ref(false)

// 네비게이션 메뉴 항목들
const navItems = [
  {
    title: 'Forum',
    icon: 'mdi-forum',
    route: { name: 'forum' },
  },
  {
    title: 'Agora',
    icon: 'mdi-account-group',
    route: { name: 'agora' },
  },
  {
    title: 'Info',
    icon: 'mdi-pencil',
    route: { name: 'cafInfo' },
  },
]

const goToLogin = () => {
  router.push({ name: 'login' })
}

const goToProfile = () => {
  router.push({ name: 'profile' })
}

const goToAdminSetting = () => {
  router.push('/adminsetting')
}

const handleLogout = () => {
  loginStore.logout()
  router.push({ name: 'login' })
}

// 네비게이션 클릭 핸들러
const handleNavigation = (route) => {
  // 로그인이 필요한 페이지들 체크
  if (route.name === 'writepost' && !loginStore.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  router.push(route)
}
</script>

<template>
  <v-app-bar color="transparent" class="header-nav" flat>
    <!-- 왼쪽 로고 -->
    <v-toolbar-title class="d-flex">
      <v-btn
        to="/home"
        variant="plain"
        class="d-flex align-center logo-btn"
        style="text-transform: none; background-color: transparent; box-shadow: none"
      >
        <v-img :src="cafverseLogo" width="36" height="36" class="mr-2" />
        <span class="text-h6 font-weight-bold">
          <span class="green">CaF</span><span class="blue">Verse</span>
        </span>
      </v-btn>
    </v-toolbar-title>

    <!-- 중앙 네비게이션 메뉴 -->
    <div class="nav-center d-none d-md-flex">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        @click="handleNavigation(item.route)"
        variant="text"
        class="nav-item"
        :prepend-icon="item.icon"
      >
        {{ item.title }}
      </v-btn>
    </div>

    <v-spacer />

    <!-- 오른쪽: 로그인 상태에 따라 다르게 표시 -->
    <v-toolbar-items class="pa-8" v-if="loginStore.isLoggedIn">
      <v-menu v-model="menu" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon class="profile-menu-btn">
            <v-avatar size="32">
              <v-img :src="loginStore.user?.profileImage || userDefault" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="profile-dropdown">
          <!-- 사용자 정보 표시 -->
          <v-list-item class="user-info-item">
            <template v-slot:prepend>
              <v-avatar size="40">
                <v-img :src="loginStore.user?.profileImage || userDefault" />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ loginStore.user?.nickname }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ loginStore.user?.job || '직원' }} • {{ loginStore.user?.brand || 'Solo Roaster' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <!-- 일반 메뉴들 -->
          <v-list-item @click="goToProfile" prepend-icon="mdi-account-circle">
            <v-list-item-title>프로필 설정</v-list-item-title>
          </v-list-item>

          <!-- nayeoni 전용 어드민 메뉴 -->
          <v-list-item
            v-if="loginStore.user?.nickname === 'nayeoni'"
            @click="goToAdminSetting"
            prepend-icon="mdi-shield-crown"
            class="admin-menu-item"
          >
            <v-list-item-title class="admin-text">어드민용</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item @click="handleLogout" prepend-icon="mdi-logout" class="logout-item">
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 사용자 인사말 (데스크톱에서만) -->
      <div class="user-greeting d-none d-lg-flex align-center ml-2">
        <span v-if="loginStore.user.nickname === 'nayeoni'" class="font-weight-bold white">
          <span class="blue font-weight-bold">나연</span> 님! 너무나 환영해요.
        </span>
        <span v-else class="font-weight-bold white">
          {{ loginStore.user?.nickname }}
        </span>
      </div>
    </v-toolbar-items>

    <!-- 로그인하지 않은 상태 -->
    <v-toolbar-items class="pa-8" v-else>
      <v-btn text @click="goToLogin" class="tx-caf-blue">
        <span class="blue">로그인</span>
      </v-btn>
      <span class="white d-none d-md-inline" style="font-size: 14px"> 로그인도 안했어? </span>
    </v-toolbar-items>

    <!-- 모바일 네비게이션 (햄버거 메뉴) -->
    <template v-slot:extension v-if="$vuetify.display.smAndDown">
      <v-tabs class="mobile-nav" color="white" slider-color="green">
        <v-tab
          v-for="item in navItems"
          :key="item.title"
          @click="handleNavigation(item.route)"
          class="mobile-nav-item"
        >
          <v-icon class="mr-1" size="small">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<style scoped>
.header-nav {
  backdrop-filter: blur(10px);
}

.logo-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* 중앙 네비게이션 스타일 */
.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  gap: 8px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.6) !important;
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 1) !important;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-item .v-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.nav-item:hover .v-icon {
  opacity: 1;
}

/* 프로필 메뉴 */
.profile-menu-btn {
  transition: all 0.3s ease;
}

.profile-menu-btn:hover {
  transform: scale(1.05);
}

.profile-dropdown {
  min-width: 280px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.user-info-item {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  margin: 0;
  padding: 16px !important;
}

.admin-menu-item {
  background: linear-gradient(135deg, #fef5e7 0%, #f6e05e 20%);
}

.admin-text {
  color: #d69e2e !important;
  font-weight: 700 !important;
  font-family: 'NanumBarunGothic', sans-serif;
}

.admin-menu-item:hover {
  background: linear-gradient(135deg, #fed7aa 0%, #f6ad55 20%);
}

.logout-item {
  color: #e53e3e;
}

.logout-item:hover {
  background-color: rgba(229, 62, 62, 0.1);
}

/* 사용자 인사말 */
.user-greeting {
  font-family: 'NanumBarunGothic', sans-serif;
}

/* 모바일 네비게이션 */
.mobile-nav {
  background: rgba(44, 62, 80, 0.95);
}

.mobile-nav-item {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.875rem;
  min-width: auto;
  font-family: 'NanumBarunGothic', sans-serif;
}

.mobile-nav-item:hover {
  color: rgba(255, 255, 255, 1) !important;
}

/* 반응형 처리 */
@media (max-width: 960px) {
  .nav-center {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .user-greeting {
    display: none !important;
  }

  .profile-dropdown {
    min-width: 250px;
  }
}

/* 브랜드 색상 유지 */
.green {
  color: #57c675;
}

.blue {
  color: #6fb8f4;
}

.white {
  color: #e0e0e0;
}

.tx-caf-blue {
  color: #6fb8f4;
}
</style>
