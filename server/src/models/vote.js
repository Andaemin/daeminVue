// server/src/models/vote.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

export const Vote = sequelize.define(
  "Vote",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "투표한 사용자 ID",
    },
    debateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "투표한 토론 ID",
    },
    option: {
      type: DataTypes.ENUM("A", "B"),
      allowNull: false,
      comment: "투표한 선택지 (A 또는 B)",
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "투표자 IP 주소 (중복 방지용)",
    },
  },
  {
    tableName: "votes",
    freezeTableName: true,
    comment: "토론 투표 테이블",
    indexes: [
      {
        unique: true,
        fields: ["userId", "debateId"],
        name: "unique_user_debate_vote",
      },
      {
        fields: ["debateId"],
        name: "idx_votes_debate_id",
      },
      {
        fields: ["userId"],
        name: "idx_votes_user_id",
      },
    ],
  }
);

export const associateVote = (models) => {
  Vote.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  Vote.belongsTo(models.Debate, { foreignKey: "debateId", as: "debate" });
};
