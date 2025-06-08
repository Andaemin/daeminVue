// server/src/models/debate.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Debate = sequelize.define(
  "Debate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "토론 제목",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "토론 설명",
    },
    optionA: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "첫 번째 선택지",
    },
    optionB: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "두 번째 선택지",
    },
    votesA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "선택지 A 투표 수",
    },
    votesB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "선택지 B 투표 수",
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "총 투표 수",
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "general",
      comment: "토론 카테고리",
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "작성자 ID (User 테이블과 연결)",
    },
    authorName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "작성자 이름 (user.name 복사)",
    },
    authorNickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "작성자 닉네임 (user.nickname 복사)",
    },
    comments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "댓글 수",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "토론 활성화 상태",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "토론 종료일 (null이면 무제한)",
    },
  },
  {
    tableName: "debates",
    freezeTableName: true,
    comment: "토론(Agora) 테이블",
    indexes: [
      {
        fields: ["authorId"],
        name: "idx_debates_author_id",
      },
      {
        fields: ["category"],
        name: "idx_debates_category",
      },
      {
        fields: ["isActive"],
        name: "idx_debates_is_active",
      },
      {
        fields: ["createdAt"],
        name: "idx_debates_created_at",
      },
    ],
  }
);

export const associateDebate = (models) => {
  Debate.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
};
