import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Post = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "자유게시판, 스타벅스, 블루보틀 등 게시판 구분",
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "익명 여부",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "작성자 ID (User 테이블과 연결)",
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "작성자 이름 (user.name 복사)",
    },
    authorJob: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "작성자 직업 (user.job 복사)",
    },
    authorBrand: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "작성자 브랜드 (user.brand 복사)",
    },
  },
  {
    tableName: "posts",
    freezeTableName: true,
  }
);

export const associatePost = (models) => {
  Post.belongsTo(models.User, { foreignKey: "userId", as: "author" });
};
