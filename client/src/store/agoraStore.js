// client/src/store/agoraStore.js (API 연동 버전)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAgoraStore = defineStore(
  'agora',
  () => {
    // 상태
    const debates = ref([])
    const currentDebate = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    })

    // 토론 목록 로드
    const loadDebates = async (params = {}) => {
      try {
        loading.value = true
        error.value = null

        const queryParams = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || 'latest',
          active: params.active || 'true',
          ...(params.category && { category: params.category }),
        })

        const response = await axios.get(`/api/agora/debates?${queryParams}`)

        debates.value = response.data.debates
        pagination.value = response.data.pagination
      } catch (err) {
        console.error('토론 목록 로드 실패:', err)
        error.value = err.response?.data?.message || '토론 목록을 불러오는데 실패했습니다.'
        debates.value = []
      } finally {
        loading.value = false
      }
    }

    // 특정 토론 상세 로드
    const loadDebateDetail = async (debateId, token = null) => {
      try {
        loading.value = true
        error.value = null

        const headers = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await axios.get(`/api/agora/debates/${debateId}`, { headers })
        currentDebate.value = response.data
      } catch (err) {
        console.error('토론 상세 로드 실패:', err)
        error.value = err.response?.data?.message || '토론을 불러오는데 실패했습니다.'
        currentDebate.value = null
      } finally {
        loading.value = false
      }
    }

    // 새 토론 생성
    const createDebate = async (debateData, token) => {
      try {
        loading.value = true
        error.value = null

        const response = await axios.post('/api/agora/debates', debateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        // 새로운 토론을 목록 맨 앞에 추가
        if (debates.value.length > 0) {
          debates.value.unshift(response.data.debate)
        }

        return response.data.debate
      } catch (err) {
        console.error('토론 생성 실패:', err)
        error.value = err.response?.data?.message || '토론 생성에 실패했습니다.'
        throw err
      } finally {
        loading.value = false
      }
    }

    // 투표하기
    const vote = async (debateId, option, token) => {
      try {
        error.value = null

        const response = await axios.post(
          `/api/agora/debates/${debateId}/vote`,
          {
            option,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        // 로컬 상태 업데이트
        const debateIndex = debates.value.findIndex((d) => d.id === debateId)
        if (debateIndex !== -1) {
          debates.value[debateIndex].votesA = response.data.debate.votesA
          debates.value[debateIndex].votesB = response.data.debate.votesB
          debates.value[debateIndex].totalVotes = response.data.debate.totalVotes
        }

        // 현재 토론도 업데이트
        if (currentDebate.value && currentDebate.value.id === debateId) {
          currentDebate.value.votesA = response.data.debate.votesA
          currentDebate.value.votesB = response.data.debate.votesB
          currentDebate.value.totalVotes = response.data.debate.totalVotes
          currentDebate.value.userVote = response.data.userVote
          currentDebate.value.hasVoted = true
        }

        return response.data
      } catch (err) {
        console.error('투표 실패:', err)
        error.value = err.response?.data?.message || '투표에 실패했습니다.'
        throw err
      }
    }

    // 토론 수정
    const updateDebate = async (debateId, updateData, token) => {
      try {
        loading.value = true
        error.value = null

        const response = await axios.put(`/api/agora/debates/${debateId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        // 로컬 상태 업데이트
        const debateIndex = debates.value.findIndex((d) => d.id === debateId)
        if (debateIndex !== -1) {
          debates.value[debateIndex] = { ...debates.value[debateIndex], ...response.data.debate }
        }

        // 현재 토론도 업데이트
        if (currentDebate.value && currentDebate.value.id === debateId) {
          currentDebate.value = { ...currentDebate.value, ...response.data.debate }
        }

        return response.data.debate
      } catch (err) {
        console.error('토론 수정 실패:', err)
        error.value = err.response?.data?.message || '토론 수정에 실패했습니다.'
        throw err
      } finally {
        loading.value = false
      }
    }

    // 토론 삭제
    const deleteDebate = async (debateId, token) => {
      try {
        loading.value = true
        error.value = null

        await axios.delete(`/api/agora/debates/${debateId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // 로컬 상태에서 제거
        debates.value = debates.value.filter((d) => d.id !== debateId)

        // 현재 토론이 삭제된 토론이면 초기화
        if (currentDebate.value && currentDebate.value.id === debateId) {
          currentDebate.value = null
        }

        return true
      } catch (err) {
        console.error('토론 삭제 실패:', err)
        error.value = err.response?.data?.message || '토론 삭제에 실패했습니다.'
        throw err
      } finally {
        loading.value = false
      }
    }

    // 카테고리별 토론 로드
    const loadDebatesByCategory = async (category, params = {}) => {
      return await loadDebates({ ...params, category })
    }

    // 인기 토론 로드
    const loadPopularDebates = async (params = {}) => {
      return await loadDebates({ ...params, sort: 'popular' })
    }

    // 토론 상태 초기화
    const clearCurrentDebate = () => {
      currentDebate.value = null
    }

    // 에러 상태 초기화
    const clearError = () => {
      error.value = null
    }

    // 전체 상태 초기화
    const clearAll = () => {
      debates.value = []
      currentDebate.value = null
      error.value = null
      pagination.value = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
      }
    }

    return {
      // 상태
      debates,
      currentDebate,
      loading,
      error,
      pagination,

      // 액션
      loadDebates,
      loadDebateDetail,
      createDebate,
      vote,
      updateDebate,
      deleteDebate,
      loadDebatesByCategory,
      loadPopularDebates,
      clearCurrentDebate,
      clearError,
      clearAll,
    }
  },
  {
    persist: false, // 토론 데이터는 항상 최신 상태로 로드
  },
)
