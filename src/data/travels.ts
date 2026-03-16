// 统一的旅行数据
export interface TravelPhoto {
  url: string
  name: string
  location: string
  year: number
  colSpan?: number
  province?: string
}

// 首页展示的旅行数据
export const homeTravelData: TravelPhoto[] = [
  {
    url: 'http://localhost:5000/uploads/55b254a0-0c56-4d9a-8814-e4eac4d25756.jpg',
    name: '珠峰的日照金山',
    location: '珠穆朗玛峰',
    province: '西藏',
    year: 2026,
  },
  {
    url: 'http://localhost:5000/uploads/5a38db2b-8734-4474-89ff-3d44eb6d3491.jpg',
    name: '绝美西湖',
    location: '杭州·西湖',
    province: '浙江',
    year: 2026,
  },
  {
    url: 'http://localhost:5000/uploads/3655cb06-3aaf-43ee-9f41-4f912f483ce2.jpg',
    name: '1',
    location: '1',
    province: '云南',
    year: 2026,
  },
  {
    url: 'http://localhost:5000/uploads/96a336eb-856f-4c4b-8c09-d514a1f6d742.jpg',
    name: '南京的金秋',
    location: '南京',
    province: '江苏',
    year: 2025,
  },
  {
    url: 'http://localhost:5000/uploads/88a01d4f-dc0b-4c4e-98f9-28c9167b251c.jpg',
    name: '早晨的餐厅',
    location: '成都',
    province: '四川',
    year: 2026,
  },
]

// 详情页使用的旅行数据（可以扩展更多）
export const detailTravelData: TravelPhoto[] = [
  ...homeTravelData,
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/abc123.png',
    name: '京都古寺',
    location: '日本',
    year: 2023,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/def456.png',
    name: '纽约时代广场',
    location: '美国',
    year: 2022,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/tibet1.jpg',
    name: '布达拉宫',
    location: '中国',
    province: '西藏',
    year: 2023,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/tibet2.jpg',
    name: '纳木错',
    location: '中国',
    province: '西藏',
    year: 2023,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/zhejiang1.jpg',
    name: '西湖美景',
    location: '中国',
    province: '浙江',
    year: 2022,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/yunnan1.jpg',
    name: '大理古城',
    location: '中国',
    province: '云南',
    year: 2023,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/jiangsu1.jpg',
    name: '苏州园林',
    location: '中国',
    province: '江苏',
    year: 2022,
  },
  {
    url: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/sichuan1.jpg',
    name: '九寨沟',
    location: '中国',
    province: '四川',
    year: 2023,
  },
]

// 按省份组织的旅行数据
export const provinceTravelData: Record<string, TravelPhoto[]> = {}

// 初始化按省份组织的数据
detailTravelData.forEach((photo) => {
  if (photo.province) {
    if (!provinceTravelData[photo.province]) {
      provinceTravelData[photo.province] = []
    }
    provinceTravelData[photo.province].push(photo)
  }
})
