<script setup>
import { computed, onMounted } from 'vue'
import { useLikeStore } from '@/store/likeStore.js'
import { useLoginStore } from '@/store/login.js'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true,
  },
  size: {
    type: String,
    default: 'default', // small, default, large
  },
  showCount: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'default', // default, compact, text-only
  },
})

const likeStore = useLikeStore()
const loginStore = useLoginStore()

// 좋아요 상태
const likeStatus = computed(() => likeStore.getLikeStatus(props.postId))
const isLiked = computed(() => likeStatus.value.isLiked)
const likeCount = computed(() => likeStatus.value.count)

// 버튼 크기 설정
const buttonSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'small'
    case 'large':
      return 'large'
    default:
      return 'default'
  }
})

// 아이콘 크기 설정
const iconSize = computed(() => {
  switch (props.size) {
    case 'small':
      return '16'
    case 'large':
      return '24'
    default:
      return '20'
  }
})

// 좋아요 토글
const handleLike = async () => {
  if (!loginStore.isLoggedIn) {
    // 로그인하지 않은 경우 로그인 페이지로 이동
    alert('로그인이 필요한 기능입니다.')
    return
  }

  try {
    await likeStore.toggleLike(props.postId, loginStore.token)
  } catch (error) {
    console.error(error)
    alert('좋아요 처리 중 오류가 발생했습니다.')
  }
}

// 컴포넌트 마운트 시 좋아요 정보 로드
onMounted(() => {
  likeStore.loadLikesForPost(props.postId, loginStore.token)
})
</script>

<template>
  <!-- 기본 버튼 스타일 -->
  <v-btn
    v-if="variant === 'default'"
    @click="handleLike"
    :size="buttonSize"
    variant="text"
    :color="isLiked ? 'red' : 'grey'"
    class="like-button"
  >
    <v-icon :size="iconSize" :class="{ 'like-animation': isLiked }">
      {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
    </v-icon>

    <span v-if="showCount" class="like-count ml-1">
      {{ likeCount }}
    </span>
  </v-btn>

  <!-- 컴팩트 스타일 (아이콘만) -->
  <v-btn
    v-else-if="variant === 'compact'"
    @click="handleLike"
    :size="buttonSize"
    variant="text"
    icon
    :color="isLiked ? 'red' : 'grey'"
    class="like-button-compact"
  >
    <v-icon :size="iconSize" :class="{ 'like-animation': isLiked }">
      {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
    </v-icon>
  </v-btn>

  <!-- 텍스트 스타일 -->
  <div
    v-else-if="variant === 'text-only'"
    @click="handleLike"
    class="like-text-button d-flex align-center"
    :class="{ 'cursor-pointer': loginStore.isLoggedIn }"
  >
    <v-icon
      :size="iconSize"
      :color="isLiked ? 'red' : 'grey'"
      :class="{ 'like-animation': isLiked }"
      class="mr-1"
    >
      {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
    </v-icon>

    <span
      v-if="showCount"
      class="like-count-text"
      :class="{ 'text-red': isLiked, 'text-grey': !isLiked }"
    >
      {{ likeCount }}
    </span>
  </div>
</template>

<style scoped>
.like-button {
  font-family: 'NanumBarunGothic', sans-serif;
  font-weight: 600;
  text-transform: none;
}

.like-button-compact {
  min-width: auto !important;
}

.like-count {
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'NanumBarunGothic', sans-serif;
}

.like-text-button {
  transition: all 0.2s ease;
}

.like-text-button:hover {
  opacity: 0.8;
}

.like-count-text {
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'NanumBarunGothic', sans-serif;
}

.like-animation {
  animation: likeHeart 0.3s ease;
}

@keyframes likeHeart {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 하트 색상 전환 애니메이션 */
.v-icon {
  transition: color 0.2s ease;
}
</style>
