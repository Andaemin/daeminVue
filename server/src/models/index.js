// import { User, associateUser } from "./users.js";
// import { Post, associatePost } from "./post.js";
// import { Like, associateLike } from "./like.js"; // 추가

// const models = { User, Post, Like }; // Like 추가

// associateUser(models);
// associatePost(models);
// associateLike(models); // 추가

// export default models;

// server/src/models/index.js (기존 파일에 추가)
// server/src/models/index.js (수정된 버전)
import { sequelize } from "../database/connection.js";
import { User } from "./users.js";
import { Post } from "./post.js";
import { Like } from "./like.js";
import { UserBadge } from "./badge.js";

// 모델 관계 설정
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

User.hasMany(Like, { foreignKey: "userId", as: "likes" });
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(User, { foreignKey: "userId", as: "user" });
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });

// 뱃지 관계 설정
User.hasMany(UserBadge, { foreignKey: "userId", as: "userBadges" });
UserBadge.belongsTo(User, { foreignKey: "userId", as: "user" });

// 개별 export (named exports)
export { User, Post, Like, UserBadge };

// 통합 객체 export
const models = {
  User,
  Post,
  Like,
  UserBadge,
  sequelize,
};

export default models;
