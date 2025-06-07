<script setup>
import { computed } from 'vue'
import { RARITY_COLORS } from '@/data/badgeDefinitions.js'
import { useBadgeStore } from '@/store/badgeStore'

const props = defineProps({
  badge: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'default', // small, default, large
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const badgeStore = useBadgeStore()

// 크기별 스타일
const sizeStyles = computed(() => {
  const sizes = {
    small: {
      width: '24px',
      height: '24px',
      fontSize: '12px',
    },
    default: {
      width: '32px',
      height: '32px',
      fontSize: '16px',
    },
    large: {
      width: '48px',
      height: '48px',
      fontSize: '24px',
    },
  }
  return sizes[props.size]
})

// 희귀도별 테두리 스타일
const borderStyle = computed(() => {
  const color = RARITY_COLORS[props.badge.rarity] || RARITY_COLORS.common
  return {
    border: `2px solid ${color}`,
    boxShadow: `0 0 8px ${color}40`,
  }
})

// 뱃지 클릭 핸들러
const handleClick = () => {
  if (props.clickable) {
    emit('click', props.badge)
  }
}
</script>

<template>
  <v-tooltip
    v-if="showTooltip"
    :text="`${badge.badgeName || badge.name} - ${badge.badgeDescription || badge.description}`"
    location="top"
  >
    <template v-slot:activator="{ props: tooltipProps }">
      <div
        v-bind="tooltipProps"
        class="sprout-badge"
        :class="{ clickable: clickable }"
        :style="{
          ...sizeStyles,
          ...borderStyle,
          backgroundColor: props.badge.badgeColor
            ? props.badge.badgeColor + '20'
            : props.badge.color + '20',
        }"
        @click="handleClick"
      >
        <span class="badge-icon" :style="{ fontSize: sizeStyles.fontSize }">
          {{ badge.badgeIcon || badge.icon }}
        </span>
      </div>
    </template>
  </v-tooltip>

  <div
    v-else
    class="sprout-badge"
    :class="{ clickable: clickable }"
    :style="{
      ...sizeStyles,
      ...borderStyle,
      backgroundColor: props.badge.badgeColor
        ? props.badge.badgeColor + '20'
        : props.badge.color + '20',
    }"
    @click="handleClick"
  >
    <span class="badge-icon" :style="{ fontSize: sizeStyles.fontSize }">
      {{ badge.badgeIcon || badge.icon }}
    </span>
  </div>
</template>

<style scoped>
.sprout-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sprout-badge.clickable {
  cursor: pointer;
}

.sprout-badge.clickable:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.badge-icon {
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 희귀도별 애니메이션 효과 */
.sprout-badge[data-rarity='legendary'] {
  animation: legendary-glow 2s ease-in-out infinite;
}

.sprout-badge[data-rarity='epic'] {
  animation: epic-pulse 3s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%,
  100% {
    box-shadow: 0 0 8px var(--badge-color, #d32f2f) 40;
  }
  50% {
    box-shadow: 0 0 16px var(--badge-color, #d32f2f) 80;
  }
}

@keyframes epic-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
