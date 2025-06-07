// server/scripts/awardSingleBadge.js (새 파일 생성)
import { UserBadge, User } from "../src/models/index.js";
import { sequelize } from "../src/database/connection.js";

// 뱃지 정의
const BADGE_DEFINITIONS = {
  sprout_finder: {
    badgeName: "SproutFinder",
    badgeDescription: "새싹찾는사람 기본 뱃지",
    badgeIcon: "🌱",
    badgeColor: "#8BC34A",
    rarity: "common",
    earnedReason: "회원가입 완료",
  },
  whisper_keeper: {
    badgeName: "WhiffKeeper",
    badgeDescription: "커뮤니티 기여자",
    badgeIcon: "💬",
    badgeColor: "#FF9800",
    rarity: "uncommon",
    earnedReason: "활발한 커뮤니티 활동",
  },
  scent_wave: {
    badgeName: "ScentWave",
    badgeDescription: "향추적자 인증 뱃지",
    badgeIcon: "✓",
    badgeColor: "#2196F3",
    rarity: "rare",
    earnedReason: "뛰어난 활동량과 영향력",
  },
  core_sprout: {
    badgeName: "CoreSprout!",
    badgeDescription: "이달의 게시글 TOP5",
    badgeIcon: "🌿",
    badgeColor: "#4CAF50",
    rarity: "epic",
    earnedReason: "월간 인기 게시글 작성자",
  },
  echo_maker: {
    badgeName: "Echo Maker!",
    badgeDescription: "등록된 정식 칼럼니스트",
    badgeIcon: "🏆",
    badgeColor: "#D32F2F",
    rarity: "legendary",
    earnedReason: "CaFverse 정식 칼럼니스트",
  },
};

async function awardSingleBadge(userId, badgeType, customReason = null) {
  try {
    await sequelize.authenticate();
    console.log("데이터베이스 연결 성공");

    // 뱃지 정의 확인
    const badgeDefinition = BADGE_DEFINITIONS[badgeType];
    if (!badgeDefinition) {
      console.error(`❌ 존재하지 않는 뱃지 타입: ${badgeType}`);
      console.log("사용 가능한 뱃지:", Object.keys(BADGE_DEFINITIONS).join(", "));
      return;
    }

    // 사용자 확인
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(`❌ 사용자 ID ${userId}를 찾을 수 없습니다.`);
      return;
    }

    console.log(`👤 사용자: ${user.nickname} (ID: ${user.id})`);
    console.log(`🏅 뱃지: ${badgeDefinition.badgeName} (${badgeDefinition.rarity})`);

    // 이미 보유한 뱃지인지 확인
    const existingBadge = await UserBadge.findOne({
      where: { userId, badgeType },
    });

    if (existingBadge) {
      console.log(`⚠️  이미 보유한 뱃지입니다!`);
      return;
    }

    // 뱃지 수여
    const newBadge = await UserBadge.create({
      userId,
      badgeType,
      badgeName: badgeDefinition.badgeName,
      badgeDescription: badgeDefinition.badgeDescription,
      badgeIcon: badgeDefinition.badgeIcon,
      badgeColor: badgeDefinition.badgeColor,
      rarity: badgeDefinition.rarity,
      earnedReason: customReason || badgeDefinition.earnedReason,
    });

    console.log(`✅ 뱃지 수여 완료!`);
    console.log(`   📅 수여일: ${newBadge.earnedAt}`);
    console.log(`   💭 사유: ${newBadge.earnedReason}`);
  } catch (error) {
    console.error("뱃지 수여 실패:", error);
  } finally {
    await sequelize.close();
  }
}

// 사용법 예시들:

// 1. 기본 뱃지 수여
// awardSingleBadge(1, 'sprout_finder')

// 2. 커뮤니티 뱃지 수여
// awardSingleBadge(1, 'whisper_keeper')

// 3. 인증 뱃지 수여
// awardSingleBadge(1, 'scent_wave')

// 4. 성취 뱃지 수여
// awardSingleBadge(1, 'core_sprout')

// 5. 최고 등급 뱃지 수여 (커스텀 사유)
// awardSingleBadge(1, 'echo_maker', '특별 사용자 - 관리자 직접 수여')

// 🎯 여기서 실행할 뱃지를 선택하세요!
// 주석을 해제하고 원하는 뱃지를 수여하세요.

console.log(`
🏆 CaFverse 뱃지 수여 시스템

사용 가능한 뱃지:
1. sprout_finder  - SproutFinder (🌱, common)
2. whisper_keeper - WhiffKeeper (💬, uncommon)
3. scent_wave     - ScentWave (✓, rare)
4. core_sprout    - CoreSprout! (🌿, epic)
5. echo_maker     - Echo Maker! (🏆, legendary)

스크립트 파일을 편집해서 원하는 뱃지를 수여하세요!
`);

awardSingleBadge(2, "scent_wave");
