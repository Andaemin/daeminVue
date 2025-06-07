<!-- client/src/components/base/BadgeDialog.vue -->
<script setup>
import { computed } from 'vue'
import { RARITY_COLORS, RARITY_NAMES } from '@/data/badgeDefinitions.js'
import SproutBadge from './SproutBadge.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: Object,
    default: null,
  },
  userBadge: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

// 다이얼로그 표시 상태
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 희귀도 색상
const rarityColor = computed(() => {
  if (!props.badge) return '#8BC34A'
  return RARITY_COLORS[props.badge.rarity] || RARITY_COLORS.common
})

// 희귀도 이름
const rarityName = computed(() => {
  if (!props.badge) return '일반'
  return RARITY_NAMES[props.badge.rarity] || RARITY_NAMES.common
})

// 획득 일시 포맷
const earnedDate = computed(() => {
  if (!props.userBadge?.earnedAt) return null
  const date = new Date(props.userBadge.earnedAt)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// 다이얼로그 닫기
const closeDialog = () => {
  isVisible.value = false
  emit('close')
}
</script>

<template>
  <v-dialog v-model="isVisible" max-width="500" :persistent="false" transition="dialog-transition">
    <v-card v-if="badge" rounded="lg" elevation="8">
      <!-- 헤더 -->
      <v-card-title class="pa-6 text-center position-relative">
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          class="position-absolute"
          style="top: 16px; right: 16px"
          @click="closeDialog"
        />

        <div class="d-flex flex-column align-center">
          <!-- 뱃지 아이콘 -->
          <div class="mb-4">
            <SproutBadge :badge="badge" size="large" :show-tooltip="false" :clickable="false" />
          </div>

          <!-- 뱃지 이름 및 희귀도 -->
          <div class="text-h5 font-weight-bold mb-2">{{ badge.badgeName || badge.name }}</div>
          <v-chip
            :color="rarityColor"
            size="small"
            variant="elevated"
            class="text-white font-weight-bold"
          >
            {{ rarityName }}
          </v-chip>
        </div>
      </v-card-title>

      <!-- 구분선 -->
      <v-divider />

      <!-- 본문 -->
      <v-card-text class="pa-6">
        <!-- 뱃지 설명 -->
        <div class="mb-4">
          <div class="text-body-2 text-grey-darken-1 mb-2">설명</div>
          <div class="text-body-1">{{ badge.badgeDescription || badge.description }}</div>
        </div>

        <!-- 상세 설명 -->
        <div v-if="badge.detailDescription" class="mb-4">
          <div class="text-body-2 text-grey-darken-1 mb-2">상세 정보</div>
          <div class="text-body-2 text-grey-darken-3" style="line-height: 1.6">
            {{ badge.detailDescription }}
          </div>
        </div>

        <!-- 획득 조건 -->
        <div class="mb-4">
          <div class="text-body-2 text-grey-darken-1 mb-2">획득 조건</div>
          <div class="text-body-2 text-grey-darken-3">{{ badge.requirements }}</div>
        </div>

        <!-- 획득 정보 (보유한 경우) -->
        <div v-if="userBadge" class="mb-4">
          <div class="text-body-2 text-grey-darken-1 mb-2">획득 정보</div>
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-calendar" size="16" class="mr-2 text-grey-darken-1" />
              <span class="text-body-2">{{ earnedDate }}</span>
            </div>
            <div v-if="userBadge.earnedReason" class="d-flex align-start">
              <v-icon icon="mdi-information" size="16" class="mr-2 mt-0 text-grey-darken-1" />
              <span class="text-body-2">{{ userBadge.earnedReason }}</span>
            </div>
          </v-card>
        </div>

        <!-- 미획득 안내 -->
        <div v-else class="text-center pa-4">
          <v-icon icon="mdi-lock" size="48" class="text-grey-lighten-1 mb-2" />
          <div class="text-body-2 text-grey-darken-1">아직 획득하지 않은 뱃지입니다</div>
        </div>
      </v-card-text>

      <!-- 액션 버튼 -->
      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn color="primary" variant="elevated" @click="closeDialog" class="px-6"> 닫기 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-transition-enter-active,
.dialog-transition-leave-active {
  transition: all 0.3s ease;
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
