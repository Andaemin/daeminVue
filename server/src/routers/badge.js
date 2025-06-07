// server/src/routers/badge.js
import express from "express";
import {
  getAllBadgeDefinitions,
  getUserBadges,
  awardBadge,
  toggleBadgeVisibility,
} from "../controllers/badge.js";

const router = express.Router();

// 모든 뱃지 정의 조회
router.get("/definitions", getAllBadgeDefinitions);

// 특정 사용자 뱃지 조회
router.get("/user/:userId", getUserBadges);

// 뱃지 수여 (관리자용)
router.post("/award", awardBadge);

// 뱃지 표시 설정 변경
router.patch("/user-badge/:userBadgeId/visibility", toggleBadgeVisibility);

export default router;
