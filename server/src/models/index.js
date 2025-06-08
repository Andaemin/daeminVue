// server/src/models/index.js (기존 구조 + Agora 모델 추가)
import { sequelize } from "../database/connection.js";
import { User } from "./users.js";
import { Post } from "./post.js";
import { Like } from "./like.js";
import { UserBadge } from "./badge.js";
import { Debate } from "./debate.js"; // 새로 추가
import { Vote } from "./vote.js"; // 새로 추가

// 기존 모델 관계 설정
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

User.hasMany(Like, { foreignKey: "userId", as: "likes" });
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(User, { foreignKey: "userId", as: "user" });
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });

// 뱃지 관계 설정
User.hasMany(UserBadge, { foreignKey: "userId", as: "userBadges" });
UserBadge.belongsTo(User, { foreignKey: "userId", as: "user" });

// Agora 관계 설정 (새로 추가)
User.hasMany(Debate, { foreignKey: "authorId", as: "debates" });
Debate.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(Vote, { foreignKey: "userId", as: "votes" });
Debate.hasMany(Vote, { foreignKey: "debateId", as: "votes" });
Vote.belongsTo(User, { foreignKey: "userId", as: "user" });
Vote.belongsTo(Debate, { foreignKey: "debateId", as: "debate" });

// 개별 export (named exports)
export { User, Post, Like, UserBadge, Debate, Vote };

// 통합 객체 export
const models = {
  User,
  Post,
  Like,
  UserBadge,
  Debate,
  Vote,
  sequelize,
};

export default models;
