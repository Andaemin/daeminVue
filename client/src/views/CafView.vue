<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeaderNav from '@/components/layouts/HeaderNav.vue'

// Assets - SproutCreature variants
import sproutCreature from '@/assets/sproutcreature.png'
import sproutSmile from '@/assets/sprout_smile.png'
import sproutMangchi from '@/assets/sprout_mangchi.png'
import sproutMulumm from '@/assets/sprout_mulumm.png'
import sproutSleep from '@/assets/sprout_sleep.png'

// Background assets
import gaeincaf from '@/assets/gaeincaf.png'
import cafverseLogo from '@/assets/cafverse_logo.png'
import starbuckLogo from '@/assets/starbuck_mejang.png'
import lovecaffee from '@/assets/lovecaffee.png'
import kalrum from '@/assets/kalrum.png'

// User role images
import userDefault from '@/assets/user_default.png'

// Company logos
import portMyeongji from '@/assets/portMyeongji_logo.png'

const router = useRouter()
gsap.registerPlugin(ScrollTrigger)

// 상태
const currentSection = ref(0)
const showSideNav = ref(false)

// 섹션 데이터
const sections = [
  { id: 'hero', title: '메인' },
  { id: 'universe', title: 'CaFverse Universe' },
  { id: 'sprout', title: 'SproutCreature' },
  { id: 'people', title: '세계관 구성원들' },
  { id: 'roasteries', title: 'GreatRoasteries' },
  { id: 'finale', title: '시작하기' },
]

// SproutCreature 데이터
const sproutVariants = [
  { image: sproutCreature, name: '기본 SproutCreature' },
  { image: sproutSmile, name: '기쁜 SproutCreature' },
  { image: sproutMangchi, name: '화난 SproutCreature' },
  { image: sproutMulumm, name: '궁금한 SproutCreature' },
  { image: sproutSleep, name: '졸린 SproutCreature' },
]

// 세계관 구성원 데이터
const worldPeople = [
  {
    title: 'CaFverse 공간',
    description: 'CaFverse는 우리들이 어울리는 공간을 말해요!',
    image: cafverseLogo,
    color: '#57C675',
  },
  {
    title: 'Great Roasteries',
    description:
      'Great Roasteries들은 우리 커피를 널리 알린 사람들이예요! 다들 커피 프렌차이즈라고 하더라구요! 이들을 돕는 Support Roasteries들도 있어요!',
    image: starbuckLogo,
    color: '#FF6B35',
  },
  {
    title: 'SproutFinder',
    description:
      'SproutFinder는 바로 여러분들을 말해요! 커피를 찾기위해 여기까지 찾아와준 여러분들을 높이기 위해 이렇게 부르기로 했어요!',
    image: userDefault,
    color: '#6FB8F4',
  },
  {
    title: 'Solo Roaster',
    description:
      'Solo Roaster들은 혼자서 우리 커피를 알리기 위해 힘을쓰는 사람들이예요! 자영업자..? 대부분 그거라고 하더라구요!',
    image: gaeincaf,
    color: '#9B59B6',
  },
]

// 기업 로고 데이터
const greatRoasteries = [
  { name: 'Starbucks', logo: '/src/assets/starbucks_logo.svg', url: '/CafInfo/starbucks' },
  { name: 'Tom&Toms', logo: '/src/assets/TomandToms_logo.svg', url: '/CafInfo/tomntoms' },
  { name: 'EDIYA', logo: '/src/assets/EDIYA_logo.svg', url: '/CafInfo/ediya' },
  { name: 'A Twosome Place', logo: '/src/assets/twosome_logo.svg', url: '/CafInfo/twosome' },
  { name: 'Blue Bottle', logo: '/src/assets/bluebottle_logo.svg', url: '/CafInfo/bluebottle' },
  { name: '명지대학교 블루포트', logo: portMyeongji, url: 'https://www.mjc.ac.kr', external: true },
]

// 네비게이션
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToHome = () => router.push({ name: 'home' })

const handleCompanyClick = (company) => {
  if (company.external) {
    window.open(company.url, '_blank')
  } else {
    router.push(company.url)
  }
}

onMounted(() => {
  // 스크롤 위치에 따른 사이드 네비게이션 표시
  ScrollTrigger.create({
    trigger: '#universe',
    start: 'top center',
    end: 'bottom bottom',
    onUpdate: (self) => {
      showSideNav.value = self.progress > 0
    },
  })

  // 섹션별 스크롤 트리거 (현재 섹션 감지)
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        currentSection.value = index
      },
      onEnterBack: () => {
        currentSection.value = index
      },
    })
  })

  // Hero 섹션 애니메이션
  const heroTl = gsap.timeline()
  heroTl
    .from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
    })
    .from(
      '.hero-subtitle',
      {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=1',
    )
    .from(
      '.hero-mascot',
      {
        scale: 0,
        rotation: 360,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      },
      '-=0.5',
    )

  // Universe 섹션 배경 애니메이션
  gsap.utils.toArray('.floating-bg').forEach((element, i) => {
    gsap.to(element, {
      y: -100,
      x: Math.random() * 200 - 100,
      rotation: 360,
      duration: 10 + Math.random() * 10,
      repeat: -1,
      ease: 'none',
      delay: Math.random() * 5,
    })
  })

  // SproutCreature 카드 애니메이션
  gsap.utils.toArray('.sprout-card').forEach((card, i) => {
    gsap.from(card, {
      y: 100,
      opacity: 0,
      rotation: Math.random() * 20 - 10,
      duration: 1,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // People 카드 애니메이션
  gsap.utils.toArray('.people-card').forEach((card, i) => {
    gsap.from(card, {
      x: i % 2 === 0 ? -100 : 100,
      opacity: 0,
      duration: 1,
      delay: i * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // 기업 로고 슬라이더 애니메이션
  const logoContainer = document.querySelector('.logo-slider')
  if (logoContainer) {
    gsap.to('.logo-slider', {
      x: -100 * greatRoasteries.length + '%',
      duration: 15,
      repeat: -1,
      ease: 'none',
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div class="caf-view-container">
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

    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="brand-caf">CaF</span><span class="brand-verse">Verse</span>
        </h1>
        <p class="hero-subtitle">커피라는 창조물에서 피어나는 무한한 세계</p>
        <div class="hero-mascot">
          <img :src="sproutCreature" alt="SproutCreature" class="mascot-main" />
        </div>
      </div>

      <!-- 스크롤 인디케이터 -->
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- CaFverse Universe Section -->
    <section id="universe" class="universe-section">
      <!-- 떠다니는 배경 요소들 -->
      <div class="floating-backgrounds">
        <img :src="gaeincaf" class="floating-bg floating-bg-1" alt="개인카페" />
        <img :src="cafverseLogo" class="floating-bg floating-bg-2" alt="CaFverse Logo" />
        <img :src="sproutCreature" class="floating-bg floating-bg-3" alt="SproutCreature" />
        <img :src="starbuckLogo" class="floating-bg floating-bg-4" alt="Starbucks" />
        <img :src="lovecaffee" class="floating-bg floating-bg-5" alt="Love Coffee" />
        <img :src="kalrum" class="floating-bg floating-bg-6" alt="Kalrum" />
      </div>

      <div class="section-content">
        <h2 class="section-title">
          <span class="green">CaF</span><span class="blue">verse</span> Universe
        </h2>
        <p class="section-description">
          커피라는 창조물에서 생긴 또 다른 피조물과 창조물들의 세계!<br />
          커피, 바리스타 등등 모든 존재들이 창조물이자, 피조물로서 공존해요!
        </p>
      </div>
    </section>

    <!-- SproutCreature Section -->
    <section id="sprout" class="sprout-section">
      <div class="section-content">
        <h2 class="section-title">
          Hi! <span class="green font-weight-black">Sprout</span
          ><span class="blue"> Creature!</span>
        </h2>
        <p class="section-description">
          여러분들이 커피를 너무나 사랑해주셔서 탄생한 피조물이예요!<br />
          이 아이의 창조주는 <span class="red">당신</span>이겠죠?
        </p>

        <div class="sprout-gallery">
          <div v-for="sprout in sproutVariants" :key="sprout.name" class="sprout-card">
            <div class="sprout-image">
              <img :src="sprout.image" :alt="sprout.name" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 세계관 구성원들 Section -->
    <section id="people" class="people-section">
      <div class="section-content">
        <h2 class="section-title">
          <span class="green">CaF</span><span class="blue">verse</span> 를 이루고 있는 사람들
        </h2>

        <div class="people-grid">
          <div v-for="(person, index) in worldPeople" :key="person.title" class="people-card">
            <div class="card-image">
              <img :src="person.image" :alt="person.title" />
            </div>
            <div class="card-content">
              <h3 class="people-title" :style="{ color: person.color }">
                {{ person.title }}
              </h3>
              <p class="people-description">
                {{ person.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GreatRoasteries Section -->
    <section id="roasteries" class="roasteries-section">
      <div class="section-content">
        <h2 class="section-title">GreatRoasteries</h2>
        <p class="section-description">
          우리 커피를 널리 알린 사람들이예요! 아마 SproutFinder들이 이 분들 영향을 많이
          받았겠죠??<br />
          이들의 이야기 궁금하지 않아요?
        </p>

        <div class="logo-container">
          <div class="logo-slider">
            <div
              v-for="company in [...greatRoasteries, ...greatRoasteries]"
              :key="`${company.name}-${Math.random()}`"
              class="company-logo"
              @click="handleCompanyClick(company)"
            >
              <img :src="company.logo" :alt="company.name" />
              <span class="company-name">{{ company.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Finale Section -->
    <section id="finale" class="finale-section">
      <div class="section-content">
        <img :src="sproutSmile" alt="Happy SproutCreature" class="finale-mascot" />
        <h2 class="section-title">CaFverse에서 만나요!</h2>
        <p class="section-description">
          당신도 SproutFinder가 되어 CaFverse를 밝혀주길 간절히 바래요!
        </p>

        <v-btn @click="goToHome" size="x-large" color="#57C675" class="journey-btn">
          <v-icon class="mr-2">mdi-rocket-launch</v-icon>
          여정 시작하기
        </v-btn>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 전체 컨테이너 - 우주 느낌으로 수정 */
.caf-view-container {
  width: 100vw;
  min-height: 100vh;
  font-family: 'NanumBarunGothic', 'NanumSquareRound', sans-serif;
  overflow-x: hidden;
  background: linear-gradient(
    180deg,
    #0a0a0a 0%,
    #1a1a2e 25%,
    #16213e 50%,
    #2c3e50 75%,
    #34495e 100%
  );
}

/* 사이드 네비게이션 - 깔끔하게 수정 */
.side-nav {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  padding: 20px 10px;
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
  transition: all 0.3s ease;
  color: rgba(120, 120, 120, 0.8);
}

.nav-dot:hover {
  color: rgba(180, 180, 180, 1);
}

.nav-dot.active {
  color: rgba(255, 255, 255, 1);
}

.nav-dot.active .dot {
  background: #57c675;
  box-shadow: 0 0 10px rgba(87, 198, 117, 0.5);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  transition: all 0.3s ease;
}

.label {
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-dot:hover .label,
.nav-dot.active .label {
  opacity: 1;
  transform: translateX(0);
}

/* 공통 섹션 스타일 */
section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  position: relative;
}

.section-content {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 2;
  position: relative;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 30px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'NanumBarunGothic', sans-serif;
}

.section-description {
  font-size: 1.5rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 50px;
  font-weight: 500;
}

/* Hero Section */
.hero-section {
  background: radial-gradient(
    ellipse at center,
    rgba(87, 198, 117, 0.1) 0%,
    rgba(111, 184, 244, 0.1) 50%,
    transparent 70%
  );
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 6rem;
  font-weight: 900;
  margin-bottom: 30px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.brand-caf {
  color: #57c675;
  text-shadow: 3px 3px 6px rgba(87, 198, 117, 0.3);
}

.brand-verse {
  color: #6fb8f4;
  text-shadow: 3px 3px 6px rgba(111, 184, 244, 0.3);
}

.hero-subtitle {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 50px;
  font-weight: 300;
}

.hero-mascot {
  margin: 50px 0;
}

.mascot-main {
  width: 200px;
  height: 200px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-arrow {
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, transparent, #57c675, transparent);
  position: relative;
  animation: scrollDown 2s ease-in-out infinite;
}

.scroll-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -3px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #57c675;
}

/* Universe Section */
.universe-section {
  position: relative;
}

.floating-backgrounds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.floating-bg {
  position: absolute;
  opacity: 0.2;
  filter: blur(1px);
}

.floating-bg-1 {
  width: 80px;
  top: 20%;
  left: 10%;
}
.floating-bg-2 {
  width: 60px;
  top: 60%;
  right: 15%;
}
.floating-bg-3 {
  width: 100px;
  top: 40%;
  left: 80%;
}
.floating-bg-4 {
  width: 70px;
  top: 80%;
  left: 20%;
}
.floating-bg-5 {
  width: 90px;
  top: 30%;
  right: 25%;
}
.floating-bg-6 {
  width: 75px;
  top: 70%;
  left: 60%;
}

/* SproutCreature Section */
.sprout-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.sprout-card {
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sprout-card:hover {
  transform: translateY(-10px) scale(1.1);
}

.sprout-image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

/* People Section - 완전히 새로운 디자인 */
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.people-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.people-card:hover {
  transform: translateY(-10px);
}

.card-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.people-card:hover .card-image {
  border-color: rgba(87, 198, 117, 0.5);
  box-shadow: 0 0 20px rgba(87, 198, 117, 0.3);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  text-align: center;
}

.people-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  font-family: 'NanumBarunGothic', sans-serif;
}

.people-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 0.95rem;
}

/* GreatRoasteries Section */
.logo-container {
  margin-top: 60px;
  overflow: hidden;
  width: 100%;
  height: 150px;
  mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.logo-slider {
  display: flex;
  gap: 60px;
  animation: slideLogos 15s linear infinite;
}

.company-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.company-logo:hover {
  transform: scale(1.1);
}

.company-logo img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

.company-name {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

/* Finale Section */
.finale-mascot {
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
  animation: bounce 2s ease-in-out infinite;
}

.journey-btn {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 700;
  text-transform: none;
  padding: 20px 40px;
  font-size: 1.25rem;
  box-shadow: 0 8px 25px rgba(87, 198, 117, 0.4);
  transition: all 0.3s ease;
}

.journey-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(87, 198, 117, 0.6);
}

/* 애니메이션 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes scrollDown {
  0% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(10px);
  }
  100% {
    opacity: 0.3;
    transform: translateY(0);
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

@keyframes slideLogos {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes floatAndRotate {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.floating-bg {
  animation: floatAndRotate 20s linear infinite;
}

.floating-bg-1 {
  animation-delay: 0s;
}
.floating-bg-2 {
  animation-delay: 3s;
}
.floating-bg-3 {
  animation-delay: 6s;
}
.floating-bg-4 {
  animation-delay: 9s;
}
.floating-bg-5 {
  animation-delay: 12s;
}
.floating-bg-6 {
  animation-delay: 15s;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .side-nav {
    right: 10px;
    padding: 15px 8px;
  }

  .nav-dot {
    padding: 6px;
  }

  .label {
    display: none;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .section-description {
    font-size: 1.2rem;
  }

  .sprout-gallery {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
  }

  .people-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .mascot-main {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
  }

  section {
    padding: 80px 15px;
  }

  .sprout-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .sprout-card .sprout-image img {
    width: 80px;
    height: 80px;
  }

  .card-image {
    width: 100px;
    height: 100px;
  }

  .people-title {
    font-size: 1.2rem;
  }

  .people-description {
    font-size: 0.85rem;
  }

  .finale-mascot {
    width: 100px;
    height: 100px;
  }

  .journey-btn {
    font-size: 1rem;
    padding: 15px 30px;
  }
}

/* 추가 스타일링 */
.hero-section {
  background: radial-gradient(
    ellipse at center,
    rgba(87, 198, 117, 0.05) 0%,
    rgba(111, 184, 244, 0.05) 50%,
    transparent 70%
  );
}

/* 스크롤 스냅 효과 */
.caf-view-container {
  scroll-snap-type: y mandatory;
}

section {
  scroll-snap-align: start;
}

/* 향상된 호버 효과 */
.company-logo {
  position: relative;
}

.company-logo::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #57c675, #6fb8f4);
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.company-logo:hover::before {
  opacity: 0.1;
}
</style>
