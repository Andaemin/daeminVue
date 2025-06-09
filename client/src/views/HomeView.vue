<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeaderNav from '@/components/layouts/HeaderNav.vue'

// Assets
import cafverseLogo from '@/assets/cafverse_logo.png'
import sproutCreature from '@/assets/sproutcreature.png'
import sproutSmile from '@/assets/sprout_smile.png'
import sproutMangchi from '@/assets/sprout_mangchi.png'
import sproutMulumm from '@/assets/sprout_mulumm.png'
import sproutSleep from '@/assets/sprout_sleep.png'

// Badge assets
import echomasterIcon from '@/assets/echomaster_icon.png'
import prettysproutIcon from '@/assets/prettysprout_icon.png'
import scentWaveLogo from '@/assets/scentWave_logo.png'
import adminIcon from '@/assets/admin_icon.png'
import coresproutIcon from '@/assets/coresprout_icon.png'

const router = useRouter()
gsap.registerPlugin(ScrollTrigger)

// 상태
const currentSection = ref(0)
const showSideNav = ref(false)

// 섹션 데이터
const sections = [
  { id: 'hero', title: '메인' },
  { id: 'web-intro', title: 'CaFverse 웹 소개' },
  { id: 'forum', title: 'Forum' },
  { id: 'agora', title: 'Agora' },
  { id: 'badges', title: '뱃지 시스템' },
  { id: 'worldview', title: '세계관' },
  { id: 'banner', title: '배너' },
  { id: 'footer', title: 'Footer' },
]

// SproutCreature 변형들
const sproutVariants = [sproutCreature, sproutSmile, sproutMangchi, sproutMulumm, sproutSleep]

// 뱃지 데이터
const badgeAssets = [
  { image: echomasterIcon, name: 'Echo Maker' },
  { image: prettysproutIcon, name: 'Pretty Sprout' },
  { image: scentWaveLogo, name: 'Scent Wave' },
  { image: adminIcon, name: 'Admin' },
  { image: coresproutIcon, name: 'Core Sprout' },
]

// 포럼 태그들
const forumTags = [
  '스타벅스',
  '블루보틀',
  '이디야',
  '탐앤탐스',
  '투썸플레이스',
  '바리스타',
  '원두',
  '라떼아트',
  '개인카페',
  '프렌차이즈',
  '커피머신',
  '에스프레소',
  '아메리카노',
  '카푸치노',
  '핸드드립',
  '카페창업',
  '알바',
  '매니저',
  '점주',
  '커피문화',
]

// 아고라 토론 목록
const agoraDebates = [
  {
    title: '스타벅스 vs 이디야: 가성비 논쟁',
    optionA: '스타벅스가 비싸도 품질이 좋다',
    optionB: '이디야가 가성비 최고다',
    votes: { a: 342, b: 198 },
  },
  {
    title: '개인카페 vs 프렌차이즈',
    optionA: '개인카페의 특별함',
    optionB: '프렌차이즈의 안정성',
    votes: { a: 256, b: 189 },
  },
  {
    title: '아메리카노 vs 라떼',
    optionA: '진짜 커피는 아메리카노',
    optionB: '부드러운 라떼가 최고',
    votes: { a: 418, b: 392 },
  },
]

// 네비게이션 함수들
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToForum = () => router.push({ name: 'forum' })
const goToAgora = () => router.push({ name: 'agora' })
const goToCafInfo = () => router.push({ name: 'cafInfo' })
const goToProfile = () => router.push({ name: 'profile' })

onMounted(async () => {
  // 페이지 로드 시 맨 위로 스크롤
  await nextTick()
  window.scrollTo(0, 0)

  // 부드러운 스크롤 동작 설정
  document.documentElement.style.scrollBehavior = 'smooth'

  // 사이드 네비게이션 표시 제어
  ScrollTrigger.create({
    trigger: '#web-intro',
    start: 'top center',
    end: 'bottom bottom',
    onUpdate: (self) => {
      showSideNav.value = self.progress > 0
    },
  })

  // 섹션별 스크롤 트리거 (더 부드러운 전환)
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        currentSection.value = index
      },
      onEnterBack: () => {
        currentSection.value = index
      },
    })
  })

  // Hero 섹션 텍스트 애니메이션 (중앙 집중형으로 수정)
  const heroTl = gsap.timeline()
  heroTl
    .from('.hero-content', {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
    })
    .from(
      '.hero-title',
      {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      },
      '-=0.8',
    )
    .from(
      '.hero-subtitle',
      {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.6',
    )
    .from(
      '.hero-logo',
      {
        scale: 0,
        rotation: 360,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      },
      '-=0.8',
    )

  // 떠다니는 SproutCreature 애니메이션
  gsap.utils.toArray('.floating-sprout').forEach((sprout, i) => {
    gsap.to(sprout, {
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      rotation: 360,
      duration: 8 + Math.random() * 4,
      repeat: -1,
      ease: 'none',
      delay: Math.random() * 3,
    })
  })

  // 컨텐츠 올라오는 애니메이션 (스크롤 기반) - 더 부드럽게
  gsap.utils.toArray('.section-animate').forEach((section) => {
    gsap.fromTo(
      section,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })

  // 포럼 태그 애니메이션
  gsap.utils.toArray('.forum-tag').forEach((tag, i) => {
    gsap.from(tag, {
      scale: 0,
      opacity: 0,
      rotation: Math.random() * 360,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#forum',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // 뱃지 부유 애니메이션
  gsap.utils.toArray('.floating-badge').forEach((badge, i) => {
    gsap.to(badge, {
      y: Math.sin(i * 2) * 30,
      x: Math.cos(i * 1.5) * 20,
      duration: 3 + i * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  // 스크롤 동작 초기화
  document.documentElement.style.scrollBehavior = 'auto'
})
</script>

<template>
  <div class="home-container">
    <HeaderNav />

    <!-- 사이드 네비게이션 -->
    <nav v-show="showSideNav" class="side-nav">
      <div class="nav-dots">
        <button
          v-for="(section, index) in sections.slice(1)"
          :key="section.id"
          @click="scrollToSection(section.id)"
          :class="['nav-dot', { active: currentSection === index + 1 }]"
          :title="section.title"
        >
          <span class="dot"></span>
          <span class="label">{{ section.title }}</span>
        </button>
      </div>
    </nav>

    <!-- Hero Section - 중앙 집중형으로 수정 -->
    <section id="hero" class="hero-section">
      <!-- 떠다니는 SproutCreatures -->
      <div class="floating-creatures">
        <img
          v-for="(sprout, index) in sproutVariants"
          :key="index"
          :src="sprout"
          class="floating-sprout"
          :style="{
            left: Math.random() * 80 + 10 + '%',
            top: Math.random() * 80 + 10 + '%',
            width: '60px',
            opacity: 0.1,
            filter: 'blur(1px)',
          }"
        />
      </div>

      <div class="hero-content">
        <h2 class="hero-subtitle font-weight-bold hero-subtitle-top">커피의 향을 넘어</h2>
        <h1 class="hero-title">CaFverse</h1>
        <img :src="cafverseLogo" alt="CaFverse Logo" class="hero-logo" />
        <h2 class="hero-subtitle hero-subtitle-bottom font-weight-bold">커피를 쫓기까지</h2>
      </div>
    </section>

    <!-- CaFverse 웹 소개 -->
    <section id="web-intro" class="web-intro-section section-animate">
      <div class="container">
        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="section-title">
              What's <span class="green-nanum">CaF</span><span class="blue-nanum">Verse</span> ??
            </h2>
            <p class="section-description">
              <span class="green">CaF</span><span class="blue">Verse</span>는 커피를 사랑하는 모든
              사람들을 위한 특별한 공간입니다.<br />
              바리스타, 카페 사장님, 커피 애호가, 업계 종사자들이 모여<br />
              자신만의 이야기를 나누고 소통할 수 있는 커뮤니티입니다.
            </p>
            <p class="world-description">
              커피라는 창조물에서 파생된 모든 존재들이 공존하는 세계,<br />
              그곳에서 여러분은 단순한 사용자가 아닌 <span class="blue-2">'SproutFinder'</span>가
              됩니다.
            </p>
            <v-btn @click="goToCafInfo" size="large" color="#57C675" class="cta-btn">
              세계관 자세히 보기
            </v-btn>
          </div>
          <div class="visual-content">
            <img :src="sproutSmile" alt="Happy SproutCreature" class="feature-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- Forum 소개 -->
    <section id="forum" class="forum-section section-animate">
      <div class="container">
        <div class="forum-content">
          <div class="forum-text">
            <h2 class="section-title">Forum에서 이야기해요</h2>
            <p class="section-description">
              <span class="blue">SproutFinder</span>들은 찾는것만을 만족하지 않고, 다같이 이야기
              하기를 좋아하나봐요<br />
              여러분도 이야기를 나누어 보는건 어떨까요?
            </p>
            <v-btn @click="goToForum" size="large" color="#6FB8F4" class="cta-btn">
              Forum 둘러보기
            </v-btn>
          </div>

          <!-- 랜덤 포럼 태그들 -->
          <div class="forum-tags">
            <v-chip
              v-for="(tag, index) in forumTags.slice(0, 15)"
              :key="tag"
              class="forum-tag ma-2"
              :style="{
                position: 'absolute',
                left: Math.random() * 70 + '%',
                top: Math.random() * 80 + '%',
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }"
              :color="['#57C675', '#6FB8F4', '#FF6B35', '#9B59B6', '#FF914D'][index % 5]"
              variant="elevated"
            >
              {{ tag }}
            </v-chip>
          </div>
        </div>
      </div>
    </section>

    <!-- Agora 소개 -->
    <section id="agora" class="agora-section section-animate">
      <div class="container">
        <div class="agora-grid">
          <!-- 좌측 텍스트 -->
          <div class="agora-text">
            <h2 class="section-title">열띤 토론이 한창인걸요?</h2>
            <p class="section-description">
              당신도 한번 Agora에서 이야기 해보는거 어때요?<br />
              다양한 의견들이 Echo Whispers로 울려퍼지는 곳,<br />
              SproutFinder들의 생각을 들어보세요.
            </p>
            <v-btn @click="goToAgora" size="large" color="#9B59B6" class="cta-btn">
              Agora 참여하기
            </v-btn>
          </div>

          <!-- 우측 토론 목록 -->
          <div class="debate-cards">
            <div v-for="(debate, index) in agoraDebates" :key="index" class="debate-card">
              <h4 class="debate-title">{{ debate.title }}</h4>
              <div class="debate-options">
                <div class="option">
                  <span class="option-text">{{ debate.optionA }}</span>
                  <div class="vote-bar">
                    <div
                      class="vote-fill vote-a"
                      :style="{
                        width: (debate.votes.a / (debate.votes.a + debate.votes.b)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <span class="vote-count">{{ debate.votes.a }}표</span>
                </div>
                <div class="option">
                  <span class="option-text">{{ debate.optionB }}</span>
                  <div class="vote-bar">
                    <div
                      class="vote-fill vote-b"
                      :style="{
                        width: (debate.votes.b / (debate.votes.a + debate.votes.b)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <span class="vote-count">{{ debate.votes.b }}표</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 뱃지 소개 -->
    <section id="badges" class="badges-section section-animate">
      <div class="container">
        <div class="badges-content">
          <!-- 가운데 텍스트 -->
          <div class="badges-text">
            <h2 class="section-title">뱃지로 자신을 표현해보세요</h2>
            <p class="section-description">
              다들 뽐내거나 인정받기를 좋아하나봐요~<br />
              그런 당신을 위해서 준비했어요
            </p>
            <v-btn @click="goToProfile" size="large" color="#FF6B35" class="cta-btn">
              내 뱃지 확인하기
            </v-btn>
          </div>

          <!-- 떠다니는 뱃지들 -->
          <div class="floating-badges">
            <div
              v-for="(badge, index) in badgeAssets"
              :key="badge.name"
              class="floating-badge"
              :style="{
                position: 'absolute',
                left: Math.random() * 80 + 10 + '%',
                top: Math.random() * 80 + 10 + '%',
              }"
            >
              <img :src="badge.image" :alt="badge.name" class="badge-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 세계관 소개 -->
    <section id="worldview" class="worldview-section section-animate">
      <div class="container">
        <div class="worldview-content">
          <div class="worldview-visual">
            <img :src="sproutCreature" alt="SproutCreature" class="worldview-mascot" />
          </div>
          <div class="worldview-text">
            <h2 class="section-title">CaFverse의 깊은 이야기</h2>
            <p class="section-description">
              커피라는 창조물에서 태어난 SproutCreature와 함께<br />
              더 깊은 CaFverse의 세계관을 탐험해보세요.<br />
              당신이 알지 못했던 커피 우주의 비밀이 기다리고 있어요.
            </p>
            <v-btn @click="goToCafInfo" size="large" color="#4CAF50" class="cta-btn">
              세계관 탐험하기
            </v-btn>
          </div>
        </div>
      </div>
    </section>

    <!-- 개선된 배너 섹션 -->
    <section id="banner" class="banner-section section-animate">
      <div class="banner-container">
        <div class="banner-background">
          <div class="coffee-beans">
            <div class="bean bean-1"></div>
            <div class="bean bean-2"></div>
            <div class="bean bean-3"></div>
            <div class="bean bean-4"></div>
            <div class="bean bean-5"></div>
          </div>
        </div>

        <div class="banner-content">
          <div class="banner-text">
            <h2 class="banner-title">Always Following Coffee</h2>
            <p class="banner-subtitle">언제 어디서나 커피와 함께하는 CaFverse</p>
            <p class="banner-description">
              커피라는 창조물이 만들어낸 무한한 세계에서<br />
              당신만의 이야기를 시작해보세요
            </p>
          </div>

          <div class="banner-visual">
            <div class="coffee-cup">
              <div class="cup-body"></div>
              <div class="cup-handle"></div>
              <div class="coffee-steam">
                <div class="steam steam-1"></div>
                <div class="steam steam-2"></div>
                <div class="steam steam-3"></div>
              </div>
            </div>
            <img :src="sproutSmile" alt="SproutCreature" class="banner-mascot" />
          </div>
        </div>
      </div>
    </section>

    <!-- 개선된 Footer -->
    <footer id="footer" class="footer-section">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3 class="footer-title">CaFverse</h3>
            <p class="footer-tagline">커피를 쫓는 모든 이들의 공간</p>
          </div>

          <div class="footer-info">
            <div class="footer-column">
              <h4>개발 정보</h4>
              <p>명지전문대학 정보통신공학과</p>
              <p>제작자: 안대민 (2025702042)</p>
            </div>

            <div class="footer-column">
              <h4>연락처</h4>
              <a href="https://instagram.com/nayeonyny" target="_blank" class="instagram-link">
                @nayeony
              </a>
            </div>
          </div>

          <div class="footer-mascot">
            <img :src="sproutCreature" alt="SproutCreature" class="footer-sprout" />
          </div>
        </div>

        <div class="footer-bottom">
          <p>
            &copy; 2025 CaFverse. All rights reserved. Made with ❤️ Daemin. 06.09 - 최종 완료 후
            자러감 ㅃ
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 전체 컨테이너 */
.home-container {
  width: 100vw;
  min-height: 100vh;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
  overflow-x: hidden;
  /* 연속된 자연스러운 그라디언트 */
  background: linear-gradient(
    180deg,
    #1a1a1a 0%,
    /* 맨 위 어두운 배경 */ #2c3e50 20%,
    /* 미드나잇 네이비 */ #34495e 40%,
    /* 조금 더 밝은 네이비 */ #2c3e50 60%,
    /* 다시 미드나잇 네이비 */ #4a6741 80%,
    /* 배너 부분 그린 톤 */ #2c3e50 95%,
    /* footer 쪽 다시 네이비 */ #1a1a1a 100% /* 맨 아래 어두운 배경 */
  );
  /* 부드러운 스크롤을 위한 추가 CSS */
  scroll-behavior: smooth;
}

/* 사이드 네비게이션 */
.side-nav {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  padding: 20px 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.nav-dots {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-dot {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: rgba(255, 255, 255, 0.5);
}

.nav-dot:hover {
  color: rgba(255, 255, 255, 0.8);
  transform: translateX(-5px);
}

.nav-dot.active {
  color: rgba(255, 255, 255, 1);
  background: rgba(87, 198, 117, 0.2);
  transform: translateX(-8px);
}

.nav-dot.active .dot {
  background: #57c675;
  box-shadow: 0 0 10px rgba(87, 198, 117, 0.5);
  transform: scale(1.2);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.label {
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-dot:hover .label,
.nav-dot.active .label {
  opacity: 1;
  transform: translateX(0);
}

/* 공통 스타일 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  position: relative;
  /* 부드러운 섹션 전환을 위한 추가 */
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.section-title {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 30px;
  font-family: 'NanumBarunGothic', sans-serif;
  /* 텍스트 애니메이션 개선 */
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.section-description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  /* 텍스트 애니메이션 개선 */
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.cta-btn {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 700;
  text-transform: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

/* Hero Section - 투명 배경으로 변경 */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent; /* 투명하게 변경 */
}

.hero-section::after {
  display: none; /* 그라디언트 오버레이 제거 */
}

.floating-creatures {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-sprout {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 6rem;
  font-weight: 900;
  color: white;
  margin: 30px 0;
  background: linear-gradient(45deg, #57c675, #6fb8f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'NanumBarunGothic', sans-serif;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'NanumBarunGothic', sans-serif;
  margin: 20px 0;
}

.hero-subtitle-top {
  margin-bottom: 20px;
}

.hero-subtitle-bottom {
  margin-top: 30px;
}

.hero-logo {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  margin: 20px 0;
}

/* Web Intro Section */
.web-intro-section {
  background: transparent; /* 투명하게 변경 */
  position: relative;
  overflow: hidden;
}

.web-intro-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 50%, rgba(87, 198, 117, 0.1) 0%, transparent 50%);
  z-index: 1;
}

.web-intro-section .container {
  position: relative;
  z-index: 2;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.text-content {
  padding-right: 40px;
}

.world-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
  font-style: italic;
}

.visual-content {
  text-align: center;
}

.feature-image {
  width: 200px;
  height: 200px;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  animation: bounce 3s ease-in-out infinite;
}

/* Forum Section */
.forum-section {
  position: relative;
  background: transparent; /* 투명하게 변경 */
  overflow: hidden;
}

.forum-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 80% 30%, rgba(111, 184, 244, 0.08) 0%, transparent 60%);
  z-index: 1;
}

.forum-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40%;
  height: 60%;
  background: radial-gradient(ellipse at center, rgba(87, 198, 117, 0.05) 0%, transparent 70%);
  z-index: 1;
}

.forum-content {
  position: relative;
  width: 100%;
  z-index: 2;
}

.forum-text {
  max-width: 600px;
  z-index: 2;
  position: relative;
}

.forum-tags {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 1;
}

.forum-tag {
  font-weight: 600 !important;
  font-size: 0.9rem !important;
}

/* Agora Section */
.agora-section {
  background: transparent; /* 투명하게 변경 */
  position: relative;
  overflow: hidden;
}

.agora-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 70%, rgba(155, 89, 182, 0.1) 0%, transparent 60%);
  z-index: 1;
}

.agora-section::after {
  content: '';
  position: absolute;
  top: 20%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(111, 184, 244, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  z-index: 1;
}

.agora-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.agora-text {
  padding-right: 40px;
}

.debate-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.debate-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.debate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.debate-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 15px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.debate-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.option-text {
  color: rgba(255, 255, 255, 0.8);
  min-width: 150px;
  font-size: 0.85rem;
}

.vote-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.vote-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.vote-a {
  background: linear-gradient(90deg, #57c675, #68d391);
}

.vote-b {
  background: linear-gradient(90deg, #6fb8f4, #90cdf4);
}

.vote-count {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  min-width: 50px;
  text-align: right;
}

/* Badges Section */
.badges-section {
  position: relative;
  overflow: hidden;
  background: transparent; /* 투명하게 변경 */
}

.badges-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 70% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 60%);
  z-index: 1;
}

.badges-section::after {
  content: '';
  position: absolute;
  bottom: 10%;
  left: 20%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(87, 198, 117, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
  z-index: 1;
}

.badges-content {
  position: relative;
  text-align: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.badges-text {
  z-index: 2;
  position: relative;
}

.floating-badges {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-badge {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.floating-badge:hover {
  transform: scale(1.1);
}

.badge-image {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Worldview Section */
.worldview-section {
  background: transparent; /* 투명하게 변경 */
  position: relative;
  overflow: hidden;
}

.worldview-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 60%);
  z-index: 1;
}

.worldview-section::after {
  content: '';
  position: absolute;
  top: 30%;
  right: 20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(87, 198, 117, 0.05) 0%,
    rgba(111, 184, 244, 0.05) 50%,
    transparent 70%
  );
  border-radius: 50%;
  animation: float 10s ease-in-out infinite;
  z-index: 1;
}

.worldview-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.worldview-visual {
  text-align: center;
}

.worldview-mascot {
  width: 250px;
  height: 250px;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  animation: float 4s ease-in-out infinite;
}

.worldview-text {
  padding-left: 40px;
}

/* 개선된 배너 섹션 - 투명하게 변경 */
.banner-section {
  background: transparent; /* 투명하게 변경 */
  min-height: 80vh;
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}

.banner-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.coffee-beans {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bean {
  position: absolute;
  width: 60px;
  height: 80px;
  background: #4b2e2b;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0.1;
  animation: floatBean 8s ease-in-out infinite;
}

.bean::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40%;
  background: rgba(139, 69, 19, 0.5);
  border-radius: 2px;
}

.bean-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.bean-2 {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}
.bean-3 {
  top: 30%;
  left: 85%;
  animation-delay: 4s;
}
.bean-4 {
  top: 80%;
  left: 15%;
  animation-delay: 6s;
}
.bean-5 {
  top: 50%;
  left: 60%;
  animation-delay: 8s;
}

.banner-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  height: 60vh;
  position: relative;
  z-index: 2;
}

.banner-text {
  color: white;
}

.banner-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  font-family: 'NanumBarunGothic', sans-serif;
  background: linear-gradient(45deg, #57c675, #6fb8f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-subtitle {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.banner-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.banner-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.coffee-cup {
  position: relative;
  margin-right: 40px;
}

.cup-body {
  width: 120px;
  height: 150px;
  background: linear-gradient(145deg, #8b4513, #a0522d);
  border-radius: 0 0 60px 60px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cup-body::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 100px;
  background: linear-gradient(135deg, #4b2e2b, #654321);
  border-radius: 0 0 50px 50px;
}

.cup-handle {
  position: absolute;
  right: -25px;
  top: 30px;
  width: 40px;
  height: 60px;
  border: 8px solid #8b4513;
  border-left: none;
  border-radius: 0 40px 40px 0;
}

.coffee-steam {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.steam {
  position: absolute;
  width: 4px;
  height: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  animation: steam 2s ease-in-out infinite;
}

.steam-1 {
  left: -8px;
  animation-delay: 0s;
}
.steam-2 {
  left: 0;
  animation-delay: 0.5s;
}
.steam-3 {
  left: 8px;
  animation-delay: 1s;
}

.banner-mascot {
  width: 150px;
  height: 150px;
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3));
  animation: bounce 3s ease-in-out infinite;
}

/* 개선된 Footer */
.footer-section {
  background: rgba(0, 0, 0, 0.4);
  padding: 40px 0 20px;
  min-height: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 30px;
}

.footer-brand {
  text-align: left;
}

.footer-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #57c675;
  margin-bottom: 10px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-style: italic;
}

.footer-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.footer-column h4 {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.footer-column p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.instagram-link {
  color: #e91e63;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.instagram-link:hover {
  color: #ad1457;
  transform: translateX(3px);
}

.footer-mascot {
  text-align: center;
}

.footer-sprout {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

/* 애니메이션 - 더 부드럽게 개선 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes floatBean {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

@keyframes steam {
  0% {
    opacity: 0.6;
    transform: translateY(0px);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .container {
    padding: 0 30px;
  }
  .hero-title {
    font-size: 4.5rem;
  }
  .section-title {
    font-size: 2.5rem;
  }
  .banner-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .side-nav {
    right: 15px;
    padding: 15px 8px;
  }
  .label {
    display: none;
  }

  .hero-content {
    padding: 0 20px;
  }
  .hero-title {
    font-size: 3rem;
  }
  .hero-subtitle {
    font-size: 1.5rem;
  }

  .content-wrapper,
  .agora-grid,
  .worldview-content,
  .banner-content,
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .text-content,
  .agora-text,
  .worldview-text {
    padding: 0;
  }

  .forum-tags {
    position: static;
    width: 100%;
    height: auto;
    margin-top: 40px;
  }

  .floating-badges {
    display: none;
  }

  .footer-info {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .banner-visual {
    flex-direction: column;
    gap: 20px;
  }

  .coffee-cup {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .banner-title {
    font-size: 2rem;
  }

  .debate-card {
    padding: 15px;
  }
  .option-text {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .banner-content {
    height: auto;
    padding: 40px 0;
  }
  .cup-body {
    width: 80px;
    height: 100px;
  }
  .banner-mascot {
    width: 100px;
    height: 100px;
  }
}

/* 추가적인 부드러운 전환 효과 */
* {
  scroll-behavior: smooth;
}

/* 스크롤바 스타일링 (웹킷 기반 브라우저) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(44, 62, 80, 0.3);
}

::-webkit-scrollbar-thumb {
  background: rgba(87, 198, 117, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(87, 198, 117, 0.8);
}

/* 스크롤 스냅 효과 (선택적) */
.home-container {
  scroll-snap-type: y proximity;
}

section {
  scroll-snap-align: start;
}

/* 추가적인 글로벌 전환 효과 */
.section-animate {
  will-change: transform, opacity;
}

/* 성능 최적화를 위한 레이어 분리 */
.floating-sprout,
.floating-badge,
.debate-card,
.nav-dot {
  will-change: transform;
}

/* 부드러운 페이드 인 효과 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 미디어 쿼리 내 부드러운 전환 유지 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 추가 최적화 */
.hero-section,
.web-intro-section,
.forum-section,
.agora-section,
.badges-section,
.worldview-section,
.banner-section,
.footer-section {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
