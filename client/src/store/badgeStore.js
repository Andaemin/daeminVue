// client/src/store/badgeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { BADGE_DEFINITIONS, getBadgeDefinition } from '@/data/badgeDefinitions.js'

export const useBadgeStore = defineStore(
  'badge',
  () => {
    // 상태
    const userBadges = ref([]) // 사용자 보유 뱃지
    const loading = ref(false)

    // 사용자 뱃지 로드
    const loadUserBadges = async (userId, token) => {
      try {
        loading.value = true
        const response = await axios.get(`/api/badges/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        userBadges.value = response.data
        return response.data
      } catch (error) {
        console.error('사용자 뱃지 로드 실패:', error)
        userBadges.value = []
        throw error
      } finally {
        loading.value = false
      }
    }

    // 뱃지 표시/숨김 토글
    const toggleBadgeVisibility = async (userBadgeId, isVisible, token) => {
      try {
        const response = await axios.patch(
          `/api/badges/user-badge/${userBadgeId}/visibility`,
          { isVisible },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        // 로컬 상태 업데이트
        const badgeIndex = userBadges.value.findIndex((ub) => ub.id === userBadgeId)
        if (badgeIndex !== -1) {
          userBadges.value[badgeIndex].isVisible = isVisible
        }

        return response.data
      } catch (error) {
        console.error('뱃지 표시 설정 변경 실패:', error)
        throw error
      }
    }

    // 모든 뱃지 정의 가져오기 (클라이언트 데이터 사용)
    const getAllBadgeDefinitions = () => {
      return Object.keys(BADGE_DEFINITIONS).map((key) => ({
        badgeType: key,
        ...BADGE_DEFINITIONS[key],
      }))
    }

    // 특정 뱃지 정보 가져오기
    const getBadgeInfo = (badgeType) => {
      return getBadgeDefinition(badgeType)
    }

    // 사용자가 특정 뱃지를 보유하고 있는지 확인
    const hasBadge = (badgeType) => {
      return userBadges.value.some((userBadge) => userBadge.badgeType === badgeType)
    }

    // 표시 가능한 뱃지만 필터링
    const getVisibleUserBadges = () => {
      return userBadges.value.filter((userBadge) => userBadge.isVisible)
    }

    // 보유/미보유 뱃지 조합 데이터
    const getAllBadgesWithStatus = () => {
      const allDefinitions = getAllBadgeDefinitions()

      return allDefinitions.map((definition) => {
        const userBadge = userBadges.value.find((ub) => ub.badgeType === definition.badgeType)
        return {
          ...definition,
          userBadge,
          owned: !!userBadge,
        }
      })
    }

    // 뱃지 상태 초기화
    const clearBadges = () => {
      userBadges.value = []
    }

    return {
      // 상태
      userBadges,
      loading,

      // 액션
      loadUserBadges,
      toggleBadgeVisibility,

      // 게터
      getAllBadgeDefinitions,
      getBadgeInfo,
      hasBadge,
      getVisibleUserBadges,
      getAllBadgesWithStatus,

      // 유틸리티
      clearBadges,
    }
  },
  {
    persist: false, // 뱃지 정보는 매번 서버에서 로드
  },
)
