// server/src/controllers/badge.js
import { UserBadge, User } from "../models/index.js";
import { Op } from "sequelize";

// 뱃지 정의 (서버용)
const BADGE_DEFINITIONS = {
  sprout_finder: {
    name: "SproutFinder",
    description: "새싹찾는사람 기본 뱃지",
    icon: "🌱",
    color: "#8BC34A",
    rarity: "common",
  },
  whisper_keeper: {
    name: "WhiffKeeper",
    description: "커뮤니티 기여자",
    icon: "💬",
    color: "#FF9800",
    rarity: "uncommon",
  },
  scent_wave: {
    name: "ScentWave",
    description: "향추적자 인증 뱃지",
    icon: "✓",
    color: "#2196F3",
    rarity: "rare",
  },
  core_sprout: {
    name: "CoreSprout!",
    description: "이달의 게시글 TOP5",
    icon: "🌿",
    color: "#4CAF50",
    rarity: "epic",
  },
  echo_maker: {
    name: "Echo Maker!",
    description: "등록된 정식 칼럼니스트",
    icon: "🏆",
    color: "#D32F2F",
    rarity: "legendary",
  },
};

// 사용자 뱃지 조회
export const getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    const userBadges = await UserBadge.findAll({
      where: {
        userId,
        isVisible: true,
      },
      order: [["earnedAt", "DESC"]],
    });

    res.json(userBadges);
  } catch (error) {
    console.error("사용자 뱃지 조회 실패:", error);
    res.status(500).json({ message: "사용자 뱃지를 불러올 수 없습니다." });
  }
};

// 뱃지 수여
export const awardBadge = async (req, res) => {
  try {
    const { userId, badgeType, earnedReason } = req.body;

    // 뱃지 정의 확인
    const badgeDefinition = BADGE_DEFINITIONS[badgeType];
    if (!badgeDefinition) {
      return res.status(404).json({ message: "존재하지 않는 뱃지 타입입니다." });
    }

    // 사용자 존재 확인
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 이미 보유한 뱃지인지 확인
    const existingBadge = await UserBadge.findOne({
      where: { userId, badgeType },
    });

    if (existingBadge) {
      return res.status(400).json({ message: "이미 보유한 뱃지입니다." });
    }

    // 뱃지 수여
    const userBadge = await UserBadge.create({
      userId,
      badgeType,
      badgeName: badgeDefinition.name,
      badgeDescription: badgeDefinition.description,
      badgeIcon: badgeDefinition.icon,
      badgeColor: badgeDefinition.color,
      rarity: badgeDefinition.rarity,
      earnedReason: earnedReason || `${badgeDefinition.name} 뱃지 획득`,
    });

    res.status(201).json({
      message: "뱃지가 성공적으로 수여되었습니다.",
      userBadge,
    });
  } catch (error) {
    console.error("뱃지 수여 실패:", error);
    res.status(500).json({ message: "뱃지 수여 중 오류가 발생했습니다." });
  }
};

// 뱃지 숨기기/표시
export const toggleBadgeVisibility = async (req, res) => {
  try {
    const { userBadgeId } = req.params;
    const { isVisible } = req.body;

    const userBadge = await UserBadge.findByPk(userBadgeId);
    if (!userBadge) {
      return res.status(404).json({ message: "사용자 뱃지를 찾을 수 없습니다." });
    }

    await userBadge.update({ isVisible });

    res.json({
      message: "뱃지 표시 설정이 변경되었습니다.",
      userBadge,
    });
  } catch (error) {
    console.error("뱃지 표시 설정 변경 실패:", error);
    res.status(500).json({ message: "뱃지 표시 설정 변경 중 오류가 발생했습니다." });
  }
};

// 뱃지 자동 확인 및 수여 (내부 함수)
export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserBadge,
          as: "userBadges",
          attributes: ["badgeType"],
        },
      ],
    });

    if (!user) return;

    const existingBadgeTypes = user.userBadges.map((ub) => ub.badgeType);

    // 기본 뱃지 (SproutFinder) 확인
    if (!existingBadgeTypes.includes("sprout_finder")) {
      const badgeDefinition = BADGE_DEFINITIONS.sprout_finder;
      await UserBadge.create({
        userId,
        badgeType: "sprout_finder",
        badgeName: badgeDefinition.name,
        badgeDescription: badgeDefinition.description,
        badgeIcon: badgeDefinition.icon,
        badgeColor: badgeDefinition.color,
        rarity: badgeDefinition.rarity,
        earnedReason: "회원가입 완료",
      });
    }

    // TODO: 다른 뱃지 조건 확인 로직
    // - ScentWave: 좋아요, 게시글 수 확인
    // - WhiffKeeper: 연속 접속일, 활동 확인
    // - CoreSprout: 월별 인기 게시글 확인
  } catch (error) {
    console.error("뱃지 자동 확인 실패:", error);
  }
};

// 모든 뱃지 정의 조회 (클라이언트용)
export const getAllBadgeDefinitions = async (req, res) => {
  try {
    const badgeList = Object.keys(BADGE_DEFINITIONS).map((key) => ({
      badgeType: key,
      ...BADGE_DEFINITIONS[key],
    }));

    res.json(badgeList);
  } catch (error) {
    console.error("뱃지 정의 조회 실패:", error);
    res.status(500).json({ message: "뱃지 정의를 불러올 수 없습니다." });
  }
};
