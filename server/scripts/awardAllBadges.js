// server/scripts/awardAllBadges.js (새 파일 생성)
import { UserBadge, User } from "../src/models/index.js";
import { sequelize } from "../src/database/connection.js";
import { Op } from "sequelize"; // Op import 추가

// 모든 뱃지 정의
const ALL_BADGES = [
  {
    badgeType: "sprout_finder",
    badgeName: "SproutFinder",
    badgeDescription: "새싹찾는사람 기본 뱃지",
    badgeIcon: "🌱",
    badgeColor: "#8BC34A",
    rarity: "common",
    earnedReason: "회원가입 완료",
  },
  {
    badgeType: "whisper_keeper",
    badgeName: "WhiffKeeper",
    badgeDescription: "커뮤니티 기여자",
    badgeIcon: "💬",
    badgeColor: "#FF9800",
    rarity: "uncommon",
    earnedReason: "활발한 커뮤니티 활동",
  },
  {
    badgeType: "scent_wave",
    badgeName: "ScentWave",
    badgeDescription: "향추적자 인증 뱃지",
    badgeIcon: "✓",
    badgeColor: "#2196F3",
    rarity: "rare",
    earnedReason: "뛰어난 활동량과 영향력",
  },
  {
    badgeType: "core_sprout",
    badgeName: "CoreSprout!",
    badgeDescription: "이달의 게시글 TOP5",
    badgeIcon: "🌿",
    badgeColor: "#4CAF50",
    rarity: "epic",
    earnedReason: "월간 인기 게시글 작성자",
  },
  {
    badgeType: "echo_maker",
    badgeName: "Echo Maker!",
    badgeDescription: "등록된 정식 칼럼니스트",
    badgeIcon: "🏆",
    badgeColor: "#D32F2F",
    rarity: "legendary",
    earnedReason: "CaFverse 정식 칼럼니스트",
  },
];

async function awardAllBadgesToUser(userIdentifier) {
  try {
    await sequelize.authenticate();
    console.log("데이터베이스 연결 성공");

    // 사용자 찾기 (ID, userId, nickname으로 검색 가능)
    let user;
    if (typeof userIdentifier === "number") {
      user = await User.findByPk(userIdentifier);
    } else {
      user = await User.findOne({
        where: {
          [Op.or]: [{ userId: userIdentifier }, { nickname: userIdentifier }],
        },
      });
    }

    if (!user) {
      console.error(`사용자를 찾을 수 없습니다: ${userIdentifier}`);
      return;
    }

    console.log(`사용자 발견: ${user.nickname} (ID: ${user.id})`);

    // 기존 뱃지 확인
    const existingBadges = await UserBadge.findAll({
      where: { userId: user.id },
      attributes: ["badgeType"],
    });
    const existingBadgeTypes = existingBadges.map((b) => b.badgeType);

    console.log(`기존 보유 뱃지: ${existingBadgeTypes.join(", ") || "없음"}`);

    // 모든 뱃지 수여
    for (const badge of ALL_BADGES) {
      if (existingBadgeTypes.includes(badge.badgeType)) {
        console.log(`⚠️  이미 보유: ${badge.badgeName}`);
        continue;
      }

      await UserBadge.create({
        userId: user.id,
        badgeType: badge.badgeType,
        badgeName: badge.badgeName,
        badgeDescription: badge.badgeDescription,
        badgeIcon: badge.badgeIcon,
        badgeColor: badge.badgeColor,
        rarity: badge.rarity,
        earnedReason: badge.earnedReason,
      });

      console.log(`✅ 수여 완료: ${badge.badgeName} (${badge.rarity})`);
    }

    console.log(`\n🎉 ${user.nickname}님에게 모든 뱃지 수여가 완료되었습니다!`);
  } catch (error) {
    console.error("뱃지 수여 실패:", error);
  } finally {
    await sequelize.close();
  }
}

// 실행 방법들
// 1. ID로 찾기
// awardAllBadgesToUser(1)

// 2. userId로 찾기
// awardAllBadgesToUser('nayeoni')

// 3. nickname으로 찾기
awardAllBadgesToUser("nayeoni"); // 또는 임나연님의 실제 닉네임

// 스크립트 실행
// node server/scripts/awardAllBadges.js
