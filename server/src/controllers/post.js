import { Post } from "../models/post.js";
import { User } from "../models/users.js";

export const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({ include: [{ model: User, as: "author" }] });
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id, { include: ["author"] });
  if (!post) return res.status(404).json({ message: "게시글 없음" });
  res.json(post);
};

export const createPost = async (req, res) => {
  const { title, content, userId, category, isAnonymous } = req.body;
  console.log("[요청 데이터]", { title, content, userId, category, isAnonymous });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "작성자 없음" });

    const newPost = await Post.create({
      title,
      content,
      category,
      isAnonymous: !!isAnonymous, // 불리언 처리
      userId,
      authorName: user.name,
      authorJob: user.job || null,
      authorBrand: user.brand || "Solo Roaster",
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("게시글 생성 실패:", err);
    res.status(500).json({ message: "게시글 생성 중 에러" });
  }
};

export const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: "게시글 없음" });

  post.title = title;
  post.content = content;
  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ message: "게시글 없음" });
  await post.destroy();
  res.status(204).end();
};
