import express from "express";
import { toggleLike, getLikeInfo, getBatchLikeInfo } from "../controllers/like.js";

const router = express.Router();

// 좋아요 토글
router.post("/posts/:postId/like", toggleLike);

// 게시글 좋아요 정보 조회
router.get("/posts/:postId/likes", getLikeInfo);

// 여러 게시글 좋아요 정보 배치 조회
router.post("/posts/likes/batch", getBatchLikeInfo);

export default router;
