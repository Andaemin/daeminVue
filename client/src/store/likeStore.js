// client/src/store/LikeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useLikeStore = defineStore('like', () => {
  // 좋아요 상태 저장 (postId: { isLiked: boolean, count: number })
  const likes = ref({})

  // 특정 게시글의 좋아요 상태 가져오기
  const getLikeStatus = (postId) => {
    return likes.value[postId] || { isLiked: false, count: 0 }
  }

  // 좋아요 상태 설정
  const setLikeStatus = (postId, isLiked, count) => {
    likes.value[postId] = { isLiked, count }
  }

  // 좋아요 토글 (API 호출)
  const toggleLike = async (postId, token) => {
    try {
      const currentStatus = getLikeStatus(postId)

      // 낙관적 업데이트 (UI 먼저 변경)
      const newIsLiked = !currentStatus.isLiked
      const newCount = newIsLiked ? currentStatus.count + 1 : currentStatus.count - 1

      setLikeStatus(postId, newIsLiked, newCount)

      // API 호출
      const response = await axios.post(
        `/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // 서버 응답으로 정확한 값 업데이트
      if (response.data) {
        setLikeStatus(postId, response.data.isLiked, response.data.likeCount)
      }

      return response.data
    } catch (error) {
      // 에러 시 원래 상태로 롤백
      const currentStatus = getLikeStatus(postId)
      const rollbackIsLiked = !currentStatus.isLiked
      const rollbackCount = rollbackIsLiked ? currentStatus.count - 1 : currentStatus.count + 1

      setLikeStatus(postId, rollbackIsLiked, rollbackCount)

      console.error('좋아요 토글 실패:', error)
      throw error
    }
  }

  // 게시글 좋아요 정보 초기 로드
  const loadLikesForPost = async (postId, token) => {
    try {
      const response = await axios.get(`/api/posts/${postId}/likes`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })

      if (response.data) {
        setLikeStatus(postId, response.data.isLiked, response.data.likeCount)
      }

      return response.data
    } catch (error) {
      console.error('좋아요 정보 로드 실패:', error)
      // 에러 시 기본값 설정
      setLikeStatus(postId, false, 0)
    }
  }

  // 여러 게시글의 좋아요 정보 배치 로드
  const loadLikesForPosts = async (postIds, token) => {
    try {
      const response = await axios.post(
        '/api/posts/likes/batch',
        {
          postIds,
        },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        },
      )

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((likeData) => {
          setLikeStatus(likeData.postId, likeData.isLiked, likeData.likeCount)
        })
      }

      return response.data
    } catch (error) {
      console.error('좋아요 정보 배치 로드 실패:', error)
      // 에러 시 기본값 설정
      postIds.forEach((postId) => {
        if (!likes.value[postId]) {
          setLikeStatus(postId, false, 0)
        }
      })
    }
  }

  // 좋아요 상태 초기화 (로그아웃 시 등)
  const clearLikes = () => {
    likes.value = {}
  }

  return {
    likes,
    getLikeStatus,
    setLikeStatus,
    toggleLike,
    loadLikesForPost,
    loadLikesForPosts,
    clearLikes,
  }
})
