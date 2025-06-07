// server/src/models/badge.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database/connection.js";

// 사용자 뱃지 테이블 (단순화된 구조)
export const UserBadge = sequelize.define(
  "UserBadge",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "사용자 ID",
    },
    badgeType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "뱃지 타입 (sprout_finder, echo_maker, scent_wave, core_sprout, whisper_keeper)",
    },
    badgeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "뱃지 이름",
    },
    badgeDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "뱃지 설명",
    },
    badgeIcon: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "🌱",
      comment: "뱃지 아이콘 (이모지)",
    },
    badgeColor: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "#8BC34A",
      comment: "뱃지 색상",
    },
    rarity: {
      type: DataTypes.ENUM("common", "uncommon", "rare", "epic", "legendary"),
      allowNull: false,
      defaultValue: "common",
      comment: "뱃지 희귀도",
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "뱃지 획득 일시",
    },
    earnedReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "뱃지 획득 사유",
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "뱃지 표시 여부",
    },
  },
  {
    tableName: "user_badges",
    timestamps: true,
    comment: "사용자 뱃지 테이블",
    indexes: [
      {
        unique: true,
        fields: ["userId", "badgeType"],
        name: "unique_user_badge_type",
      },
    ],
  }
);
