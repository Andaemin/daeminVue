// client/src/data/badgeDefinitions.js
export const BADGE_TYPES = {
  SPROUT_FINDER: 'sprout_finder',
  ECHO_MAKER: 'echo_maker',
  SCENT_WAVE: 'scent_wave',
  CORE_SPROUT: 'core_sprout',
  WHISPER_KEEPER: 'whisper_keeper',
}

export const BADGE_DEFINITIONS = {
  [BADGE_TYPES.SPROUT_FINDER]: {
    name: 'SproutFinder',
    description: '새싹찾는사람 기본 뱃지',
    detailDescription: `CaFverse에 가입한 모든 사용자가 받는 기본 뱃지입니다.
커피라는 창조물의 세계에서 새로운 발견과 경험을 찾아가는
모든 여정의 시작을 의미합니다.`,
    icon: '🌱',
    color: '#8BC34A',
    rarity: 'common',
    requirements: '회원가입 시 자동 획득',
    category: 'basic',
  },

  [BADGE_TYPES.WHISPER_KEEPER]: {
    name: 'WhiffKeeper',
    description: '커뮤니티 기여자',
    detailDescription: `CaFverse 커뮤니티에 꾸준히 기여하고 있는 성실한 SproutFinder입니다.
정기적인 게시글 작성과 댓글 활동을 통해 커뮤니티의
활성화에 기여하고 있습니다.`,
    icon: '💬',
    color: '#FF9800',
    rarity: 'uncommon',
    requirements: '30일 연속 접속 + 주간 게시글/댓글 활동',
    category: 'community',
  },

  [BADGE_TYPES.SCENT_WAVE]: {
    name: 'ScentWave',
    description: '향추적자 인증 뱃지',
    detailDescription: `좋아요, 팔로워, 게시글 수가 일정량을 초과한 활성 사용자입니다.
CaFverse 커뮤니티에서 활발한 활동을 통해 많은 SproutFinder들에게
영향력을 발휘하고 있는 인증된 사용자입니다.`,
    icon: '✓',
    color: '#2196F3',
    rarity: 'rare',
    requirements: '좋아요 100개 + 게시글 20개 이상',
    category: 'influence',
  },

  [BADGE_TYPES.CORE_SPROUT]: {
    name: 'CoreSprout!',
    description: '이달의 게시글 TOP5',
    detailDescription: `해당 월에 가장 많은 좋아요를 받은 게시글 TOP5에 선정된 작성자입니다.
CaFverse 커뮤니티에서 높은 품질의 콘텐츠를 제공하여
많은 SproutFinder들의 공감과 사랑을 받았습니다.`,
    icon: '🌿',
    color: '#4CAF50',
    rarity: 'epic',
    requirements: '월별 인기 게시글 TOP5 선정 시 획득',
    category: 'achievement',
  },

  [BADGE_TYPES.ECHO_MAKER]: {
    name: 'Echo Maker!',
    description: '등록된 정식 칼럼니스트',
    detailDescription: `CaFverse의 정식 칼럼니스트로 인정받은 SproutFinder입니다.
Echo Whisper 매거진에 정기적으로 칼럼을 기고하며,
커피 문화와 CaFverse 세계관에 깊이 있는 통찰을 제공합니다.`,
    icon: '🏆',
    color: '#D32F2F',
    rarity: 'legendary',
    requirements: '매거진 칼럼니스트 등록 시 자동 획득',
    category: 'creator',
  },
}

export const RARITY_COLORS = {
  common: '#8BC34A',
  uncommon: '#FF9800',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#D32F2F',
}

export const RARITY_NAMES = {
  common: '일반',
  uncommon: '희귀',
  rare: '레어',
  epic: '에픽',
  legendary: '전설',
}

// 뱃지 정보 가져오기
export const getBadgeDefinition = (badgeType) => {
  return BADGE_DEFINITIONS[badgeType] || null
}
