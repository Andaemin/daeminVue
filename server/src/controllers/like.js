import { Like } from "../models/like.js";

// 좋아요 토글
export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // 클라이언트에서 userId 전달

  try {
    // 기존 좋아요 확인
    const existingLike = await Like.findOne({
      where: { userId, postId },
    });

    let isLiked;

    if (existingLike) {
      // 좋아요 취소
      await existingLike.destroy();
      isLiked = false;
    } else {
      // 좋아요 추가
      await Like.create({ userId, postId });
      isLiked = true;
    }

    // 좋아요 개수 조회
    const likeCount = await Like.count({
      where: { postId },
    });

    res.status(200).json({
      message: isLiked ? "좋아요 추가" : "좋아요 취소",
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("좋아요 토글 오류:", error);
    res.status(500).json({ message: "좋아요 처리 중 오류가 발생했습니다." });
  }
};

// 게시글 좋아요 정보 조회
export const getLikeInfo = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query; // 쿼리 파라미터로 받음

  try {
    // 좋아요 개수 조회
    const likeCount = await Like.count({
      where: { postId },
    });

    // 현재 사용자의 좋아요 여부 확인
    let isLiked = false;
    if (userId) {
      const userLike = await Like.findOne({
        where: { userId, postId },
      });
      isLiked = !!userLike;
    }

    res.status(200).json({
      likeCount,
      isLiked,
    });
  } catch (error) {
    console.error("좋아요 정보 조회 오류:", error);
    res.status(500).json({ message: "좋아요 정보 조회 중 오류가 발생했습니다." });
  }
};

// 여러 게시글 좋아요 정보 배치 조회
export const getBatchLikeInfo = async (req, res) => {
  const { postIds, userId } = req.body;

  try {
    const results = await Promise.all(
      postIds.map(async (postId) => {
        const likeCount = await Like.count({
          where: { postId },
        });

        let isLiked = false;
        if (userId) {
          const userLike = await Like.findOne({
            where: { userId, postId },
          });
          isLiked = !!userLike;
        }

        return {
          postId,
          likeCount,
          isLiked,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("배치 좋아요 정보 조회 오류:", error);
    res.status(500).json({ message: "좋아요 정보 조회 중 오류가 발생했습니다." });
  }
};
