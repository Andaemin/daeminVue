import express from "express";
import * as postController from "../controllers/post.js";

const router = express.Router();

router.get("/", postController.getAllPosts); // 전체 게시글 조회
router.get("/:id", postController.getPostById); // 게시글 상세 조회
router.post("/", postController.createPost); // 게시글 작성
router.put("/:id", postController.updatePost); // 게시글 수정
router.delete("/:id", postController.deletePost); // 게시글 삭제

export default router;
