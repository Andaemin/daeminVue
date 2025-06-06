// server/src/models/like.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Like = sequelize.define(
  "Like",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "좋아요를 누른 사용자 ID",
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "좋아요가 눌린 게시글 ID",
    },
  },
  {
    tableName: "likes",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"], // 같은 사용자가 같은 게시글에 중복 좋아요 방지
      },
    ],
  }
);

export const associateLike = (models) => {
  Like.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  Like.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
};
