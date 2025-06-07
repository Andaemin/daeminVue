<!-- client/src/components/base/BadgeCollection.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBadgeStore } from '@/store/badgeStore'
import { useLoginStore } from '@/store/login'
import SproutBadge from './SproutBadge.vue'
import BadgeDialog from './BadgeDialog.vue'

const props = defineProps({
  userId: {
    type: [String, Number],
    default: null,
  },
  showAll: {
    type: Boolean,
    default: false, // true면 모든 뱃지, false면 보유한 뱃지만
  },
  maxDisplay: {
    type: Number,
    default: 0, // 0이면 제한 없음
  },
  size: {
    type: String,
    default: 'default',
  },
})

const badgeStore = useBadgeStore()
const loginStore = useLoginStore()

// 상태
const loading = ref(false)
const selectedBadge = ref(null)
const selectedUserBadge = ref(null)
const showDialog = ref(false)

// 표시할 뱃지 목록
const displayBadges = computed(() => {
  let badges = []

  if (props.showAll) {
    // 모든 뱃지 표시 (보유/미보유 구분)
    badges = badgeStore.getAllBadgesWithStatus()
  } else {
    // 보유한 뱃지만 표시
    badges = badgeStore.getVisibleUserBadges().map((userBadge) => ({
      ...userBadge, // userBadge 데이터를 직접 사용 (badgeType, badgeName 등 포함)
      userBadge,
      owned: true,
    }))
  }

  // 최대 표시 개수 제한
  if (props.maxDisplay > 0) {
    badges = badges.slice(0, props.maxDisplay)
  }

  return badges
})

// 더 보기 버튼 표시 여부
const showMoreButton = computed(() => {
  if (props.showAll) return false
  if (props.maxDisplay === 0) return false
  return badgeStore.getVisibleUserBadges().length > props.maxDisplay
})

// 뱃지 클릭 핸들러
const handleBadgeClick = (badgeItem) => {
  selectedBadge.value = badgeItem.owned ? badgeItem : badgeItem // 뱃지 정보는 badgeItem에 직접 포함
  selectedUserBadge.value = badgeItem.userBadge
  showDialog.value = true
}

// 데이터 로드
const loadData = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // 사용자 뱃지 로드
    const targetUserId = props.userId || loginStore.user?.id
    if (targetUserId) {
      await badgeStore.loadUserBadges(targetUserId, loginStore.token)
    }
  } catch (error) {
    console.error('뱃지 데이터 로드 실패:', error)
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="badge-collection">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary" size="32" />
      <div class="text-body-2 text-grey-darken-1 mt-2">뱃지 로딩 중...</div>
    </div>

    <!-- 뱃지 목록 -->
    <div v-else-if="displayBadges.length > 0" class="badge-grid">
      <div
        v-for="(badgeItem, index) in displayBadges"
        :key="badgeItem.badgeType || badgeItem.id"
        class="badge-item"
        :class="{ 'not-owned': !badgeItem.owned }"
      >
        <SproutBadge :badge="badgeItem" :size="size" @click="handleBadgeClick(badgeItem)" />
      </div>

      <!-- 더 보기 버튼 -->
      <div v-if="showMoreButton" class="badge-item more-button">
        <v-btn
          icon
          :size="size === 'small' ? 'small' : 'default'"
          variant="outlined"
          color="grey"
          @click="$emit('showMore')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- 뱃지 없음 -->
    <div v-else class="text-center pa-6">
      <v-icon icon="mdi-medal" size="48" class="text-grey-lighten-2 mb-2" />
      <div class="text-body-2 text-grey-darken-1">
        {{ showAll ? '등록된 뱃지가 없습니다' : '보유한 뱃지가 없습니다' }}
      </div>
    </div>

    <!-- 뱃지 상세 다이얼로그 -->
    <BadgeDialog
      v-model="showDialog"
      :badge="selectedBadge"
      :user-badge="selectedUserBadge"
      @close="showDialog = false"
    />
  </div>
</template>

<style scoped>
.badge-collection {
  width: 100%;
}

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.badge-item {
  transition: all 0.2s ease;
}

.badge-item.not-owned {
  opacity: 0.3;
  filter: grayscale(100%);
}

.badge-item.not-owned:hover {
  opacity: 0.5;
  filter: grayscale(50%);
}

.more-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 반응형 그리드 */
@media (max-width: 600px) {
  .badge-grid {
    gap: 8px;
  }
}
</style>
