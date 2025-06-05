// client/src/data/chipCategories.js
export const categoryChips = [
  {
    key: 'freeboard',
    name: 'FreeBoard',
    color: '#6BB6FF',
    textColor: 'white',
    dotColor: '#E3F2FD',
  },
  {
    key: 'starbucks',
    name: 'Starbucks',
    color: '#00704A',
    textColor: 'white',
    dotColor: '#2E7D32',
  },
  {
    key: 'bluebottle',
    name: 'BlueBottle',
    color: '#6BB6FF',
    textColor: 'white',
    dotColor: '#1565C0',
  },
  {
    key: 'ediya',
    name: 'EDIYA',
    color: '#1A237E',
    textColor: 'white',
    dotColor: '#0D47A1',
  },
  {
    key: 'tomntoms',
    name: 'Tom & Toms',
    color: '#4E342E',
    textColor: 'white',
    dotColor: '#6D4C41',
  },
  {
    key: 'twosome',
    name: 'Twosome Place',
    color: '#C62828',
    textColor: 'white',
    dotColor: '#D32F2F',
  },
  {
    key: 'dunkin',
    name: "DUNKIN' DONUTS",
    color: '#FF6F00',
    textColor: 'white',
    dotColor: '#FF8F00',
  },
  {
    key: 'blueport',
    name: 'Myeongji College BluePort',
    color: '#1565C0',
    textColor: 'white',
    dotColor: '#0D47A1',
  },
]

export const getCategoryByKey = (key) => {
  return categoryChips.find((chip) => chip.key === key) || null
}

export const getCategoryColor = (key) => {
  const category = getCategoryByKey(key)
  return category ? category.color : '#CCCCCC'
}
