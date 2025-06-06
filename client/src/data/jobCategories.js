// client/src/data/jobCategories.js
import crownIcon from '@/components/icons/crown.png'

export const jobCategories = [
  {
    key: 'owner',
    name: '점주',
    displayName: '건물주',
    color: '#D32F2F',
    textColor: 'white',
    dotColor: '#FFCDD2',
    icon: crownIcon,
    hasSpecialIcon: true,
    description: '건물 소유자 및 점포 운영자',
  },
  {
    key: 'manager',
    name: '점장',
    displayName: '점장',
    color: '#FF6F00',
    textColor: 'white',
    dotColor: '#FFE0B2',
    icon: '☕',
    hasSpecialIcon: false,
    description: '매장 관리 책임자',
  },
  {
    key: 'barista',
    name: '바리스타',
    displayName: '바리스타',
    color: '#388E3C',
    textColor: 'white',
    dotColor: '#C8E6C9',
    icon: '☕',
    hasSpecialIcon: false,
    description: '커피 제조 전문가',
  },
  {
    key: 'staff',
    name: '직원',
    displayName: '직원',
    color: '#1976D2',
    textColor: 'white',
    dotColor: '#BBDEFB',
    icon: '☕',
    hasSpecialIcon: false,
    description: '일반 직원',
  },
  {
    key: 'parttime',
    name: '아르바이트생',
    displayName: '아르바이트생',
    color: '#7B1FA2',
    textColor: 'white',
    dotColor: '#E1BEE7',
    icon: '☕',
    hasSpecialIcon: false,
    description: '파트타임 근무자',
  },
]

// 브랜드 옵션과 chipCategories 매핑
export const brandMapping = {
  'Solo Roaster': 'freeboard', // FreeBoard로 매핑
  스타벅스: 'starbucks',
  블루보틀: 'bluebottle',
  투썸플레이스: 'twosome',
  이디야커피: 'ediya',
  할리스커피: 'freeboard', // chipCategories에 없으므로 FreeBoard로
  탐앤탐스: 'tomntoms',
  던킨도너츠: 'dunkin',
  '블루포트 (명지 본관 1층)': 'blueport',
}

// 역매핑 (chipCategories key -> 브랜드명)
export const reverseBrandMapping = {
  freeboard: 'Solo Roaster',
  starbucks: '스타벅스',
  bluebottle: '블루보틀',
  twosome: '투썸플레이스',
  ediya: '이디야커피',
  tomntoms: '탐앤탐스',
  dunkin: '던킨도너츠',
  blueport: '블루포트 (명지 본관 1층)',
}

// 직책 관련 헬퍼 함수들
export const getJobByKey = (key) => {
  return jobCategories.find((job) => job.key === key) || null
}

export const getJobByName = (name) => {
  return jobCategories.find((job) => job.name === name) || null
}

export const getJobColor = (name) => {
  const job = getJobByName(name)
  return job ? job.color : '#CCCCCC'
}

export const getJobIcon = (name) => {
  const job = getJobByName(name)
  return job ? job.icon : '👤'
}

export const hasSpecialIcon = (name) => {
  const job = getJobByName(name)
  return job ? job.hasSpecialIcon : false
}

// 브랜드 매핑 헬퍼 함수들
export const getBrandKey = (brandName) => {
  return brandMapping[brandName] || 'freeboard'
}

export const getBrandName = (brandKey) => {
  return reverseBrandMapping[brandKey] || 'Solo Roaster'
}
