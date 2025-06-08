// server/src/routers/agora.js
import express from "express";
import {
  getAllDebates,
  getDebateById,
  createDebate,
  voteDebate,
  updateDebate,
  deleteDebate,
} from "../controllers/agora.js";

const router = express.Router();

// 토론 목록 조회
router.get("/debates", getAllDebates);

// 특정 토론 상세 조회
router.get("/debates/:id", getDebateById);

// 새 토론 생성
router.post("/debates", createDebate);

// 토론 투표
router.post("/debates/:id/vote", voteDebate);

// 토론 수정 (작성자만)
router.put("/debates/:id", updateDebate);

// 토론 삭제 (작성자만)
router.delete("/debates/:id", deleteDebate);

export default router;
