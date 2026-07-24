import { assetUrl } from '@/lib/assets';

export interface CulturePoint {
  id: string;
  name: string;
  category: 'ancient' | 'modern' | 'red';
  period: string;
  city: string;
  district: string;
  longitude: number;
  latitude: number;
  coverImage: string;
  summary: string;
  tags: string[];
  heritageLevel?: string;
}

export interface ThemeRoute {
  id: string;
  name: string;
  coverImage: string;
  summary: string;
  theme: string;
  points: string[];
  duration: string;
}

export interface Artifact {
  id: string;
  name: string;
  image: string;
  description: string;
  period: string;
  unearthedSite: string;
}

export interface SolarTerm {
  id: string;
  name: string;
  dateRange: string;
  farmingActivity: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface TimelineEvent {
  id: string;
  title: string;
  period: string;
  description: string;
  icon: string;
}

// 湖南省文化点位数据
export const culturePoints: CulturePoint[] = [
  {
    id: 'p001',
    name: '澧县城头山遗址',
    category: 'ancient',
    period: '新石器时代',
    city: '常德市',
    district: '澧县',
    longitude: 111.64,
    latitude: 29.79,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '城头山遗址距今约6500-5800年，是长江中游地区新石器时代重要的稻作农业遗址之一，出土了大量稻谷、陶器与石器，见证了湖湘先民的稻作文明起源。',
    tags: ['新石器时代', '稻作农业', '环壕聚落', '国家重点文物保护单位'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p002',
    name: '道县玉蟾岩遗址',
    category: 'ancient',
    period: '旧石器时代晚期',
    city: '永州市',
    district: '道县',
    longitude: 111.58,
    latitude: 25.53,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    summary: '玉蟾岩遗址距今约14000-12000年，出土了世界上最早的人工栽培稻标本，是探索稻作农业起源的关键遗址。',
    tags: ['旧石器时代', '稻作起源', '世界最早栽培稻', '国家重点文物保护单位'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p003',
    name: '新化紫鹊界梯田',
    category: 'ancient',
    period: '秦汉时期',
    city: '娄底市',
    district: '新化县',
    longitude: 111.08,
    latitude: 27.88,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '紫鹊界梯田始于秦汉，盛于宋明，至今已有两千余年历史，是南方稻作文化与苗瑶山地文明的完美结合。',
    tags: ['梯田文化', '苗瑶文明', '世界灌溉工程遗产', '全球重要农业文化遗产'],
    heritageLevel: '全球重要农业文化遗产'
  },
  {
    id: 'p004',
    name: '洪江市杂交水稻基地',
    category: 'modern',
    period: '现代',
    city: '怀化市',
    district: '洪江市',
    longitude: 109.83,
    latitude: 27.21,
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    summary: '安江农校杂交水稻纪念园，袁隆平院士在此研究杂交水稻30余年，是杂交水稻的发源地。',
    tags: ['杂交水稻', '袁隆平', '现代农业', '科技创新'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p005',
    name: '十八洞村',
    category: 'red',
    period: '当代',
    city: '湘西州',
    district: '花垣县',
    longitude: 109.68,
    latitude: 28.21,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '十八洞村是"精准扶贫"首倡地，通过发展特色农业产业实现脱贫致富，成为乡村振兴的典范。',
    tags: ['精准扶贫', '乡村振兴', '特色农业', '红色教育基地'],
    heritageLevel: '全国爱国主义教育示范基地'
  },
  {
    id: 'p006',
    name: '彭头山遗址',
    category: 'ancient',
    period: '新石器时代早期',
    city: '常德市',
    district: '澧县',
    longitude: 111.70,
    latitude: 29.85,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    summary: '彭头山遗址距今约9000年，是长江中游地区已知最早的新石器时代遗址之一，出土了早期稻作遗存。',
    tags: ['新石器时代', '早期稻作', '石器工具'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p007',
    name: '高庙遗址',
    category: 'ancient',
    period: '新石器时代',
    city: '怀化市',
    district: '洪江市',
    longitude: 109.95,
    latitude: 27.18,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '高庙遗址距今约7800-6300年，出土了精美的白陶和独特的祭祀遗存，展现了沅水流域早期文明。',
    tags: ['新石器时代', '白陶文化', '祭祀遗存'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p008',
    name: '里耶古城遗址',
    category: 'ancient',
    period: '战国秦汉',
    city: '湘西州',
    district: '龙山县',
    longitude: 109.18,
    latitude: 29.05,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    summary: '里耶古城出土了大量秦简，记录了秦代农业管理制度，是研究秦代农耕文明的重要实物资料。',
    tags: ['秦代', '里耶秦简', '农业管理', '全国重点文物保护单位'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p009',
    name: '隆平水稻博物馆',
    category: 'modern',
    period: '现代',
    city: '长沙市',
    district: '芙蓉区',
    longitude: 113.03,
    latitude: 28.22,
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    summary: '隆平水稻博物馆是世界首个大型水稻博物馆，全面展示了水稻的历史、文化与科技发展。',
    tags: ['水稻博物馆', '科普教育', '现代农业'],
  },
  {
    id: 'p010',
    name: '韶山毛泽东故居',
    category: 'red',
    period: '近现代',
    city: '湘潭市',
    district: '韶山市',
    longitude: 112.49,
    latitude: 27.91,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '毛泽东同志的故居，见证了中国农民运动的起源，是了解中国农村革命历史的重要场所。',
    tags: ['红色文化', '农民运动', '革命历史'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p011',
    name: '浏阳秋收起义旧址',
    category: 'red',
    period: '近现代',
    city: '长沙市',
    district: '浏阳市',
    longitude: 113.64,
    latitude: 28.16,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
    summary: '秋收起义文家市会师旧址，见证了中国革命从城市转向农村的重大战略转折。',
    tags: ['秋收起义', '红色革命', '农村包围城市'],
    heritageLevel: '全国重点文物保护单位'
  },
  {
    id: 'p012',
    name: '岳阳楼农耕文化园',
    category: 'modern',
    period: '现代',
    city: '岳阳市',
    district: '岳阳楼区',
    longitude: 113.13,
    latitude: 29.37,
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    summary: '集农耕文化展示、农事体验、生态观光于一体的现代农业文化园区。',
    tags: ['农耕体验', '生态观光', '文化展示'],
  },
  {
    id: 'p013',
    name: '湘西土家族苗族农耕文化区',
    category: 'ancient',
    period: '历代',
    city: '湘西州',
    district: '凤凰县',
    longitude: 109.60,
    latitude: 27.95,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '湘西地区保存了丰富的土家族、苗族传统农耕文化，包括梯田耕作、稻鱼共生等独特农业模式。',
    tags: ['民族农耕', '梯田文化', '稻鱼共生', '非物质文化遗产'],
  },
  {
    id: 'p014',
    name: '衡阳市农业科技示范园',
    category: 'modern',
    period: '现代',
    city: '衡阳市',
    district: '衡阳县',
    longitude: 112.57,
    latitude: 26.89,
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    summary: '集现代农业科技研发、示范推广、科普教育于一体的综合性农业园区。',
    tags: ['现代农业', '科技示范', '智慧农业'],
  },
  {
    id: 'p015',
    name: '通道侗族农耕文化村',
    category: 'ancient',
    period: '明清',
    city: '怀化市',
    district: '通道县',
    longitude: 109.78,
    latitude: 26.17,
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
    summary: '保存完好的侗族传统农耕村落，展现了侗族稻作文化与鼓楼风雨桥建筑的完美融合。',
    tags: ['侗族文化', '传统村落', '稻作文化'],
  },
];

// 主题线路数据
export const themeRoutes: ThemeRoute[] = [
  {
    id: 'r001',
    name: '农耕文明探源',
    coverImage: assetUrl('/manus-storage/hero-route-1.webp'),
    summary: '探访稻作起源，追溯湖湘农耕文明的千年脉络',
    theme: '历史探源',
    points: ['p002', 'p006', 'p001', 'p003'],
    duration: '3-5天'
  },
  {
    id: 'r002',
    name: '数字农旅体验',
    coverImage: assetUrl('/manus-storage/hero-route-2.webp'),
    summary: '科技赋能乡村，体验现代农业与乡村振兴成果',
    theme: '科技农旅',
    points: ['p004', 'p009', 'p014', 'p012'],
    duration: '2-3天'
  },
  {
    id: 'r003',
    name: '红色农事教育',
    coverImage: assetUrl('/manus-storage/hero-route-3.webp'),
    summary: '走进红色旧址，传承农耕精神与革命记忆',
    theme: '红色教育',
    points: ['p010', 'p011', 'p005'],
    duration: '2-3天'
  }
];

// 发展脉络时间轴数据
export const timelineEvents: TimelineEvent[] = [
  {
    id: 't001',
    title: '史前稻作起源',
    period: '距今约9000年起',
    description: '湖南是世界稻作文明的重要发源地',
    icon: '🌾'
  },
  {
    id: 't002',
    title: '新石器时代',
    period: '约7000-5000年',
    description: '城头山等遗址见证稻作农业成熟',
    icon: '🏺'
  },
  {
    id: 't003',
    title: '商周至秦汉',
    period: '约前1600-公元220年',
    description: '农耕技术体系化，梯田开始出现',
    icon: '⚒️'
  },
  {
    id: 't004',
    title: '隋唐宋元明清',
    period: '581-1911年',
    description: '湖广熟天下足，农业全面繁荣',
    icon: '📜'
  },
  {
    id: 't005',
    title: '现代农业发展',
    period: '20世纪以来',
    description: '农业现代化与科技革命',
    icon: '🚜'
  },
  {
    id: 't006',
    title: '杂交水稻与粮食保护',
    period: '1970s至今',
    description: '袁隆平杂交水稻改变世界粮食格局',
    icon: '🧬'
  }
];

// 二十四节气数据
export const solarTerms: SolarTerm[] = [
  { id: 'st01', name: '立春', dateRange: '2月3-5日', farmingActivity: '备耕整地', season: 'spring' },
  { id: 'st02', name: '雨水', dateRange: '2月18-20日', farmingActivity: '育秧准备', season: 'spring' },
  { id: 'st03', name: '惊蛰', dateRange: '3月5-7日', farmingActivity: '春耕开始', season: 'spring' },
  { id: 'st04', name: '春分', dateRange: '3月20-22日', farmingActivity: '播种育苗', season: 'spring' },
  { id: 'st05', name: '清明', dateRange: '4月4-6日', farmingActivity: '插秧时节', season: 'spring' },
  { id: 'st06', name: '谷雨', dateRange: '4月19-21日', farmingActivity: '秧苗管理', season: 'spring' },
  { id: 'st07', name: '立夏', dateRange: '5月5-7日', farmingActivity: '田间管理', season: 'summer' },
  { id: 'st08', name: '小满', dateRange: '5月20-22日', farmingActivity: '灌溉施肥', season: 'summer' },
  { id: 'st09', name: '芒种', dateRange: '6月5-7日', farmingActivity: '收麦种稻', season: 'summer' },
  { id: 'st10', name: '夏至', dateRange: '6月21-22日', farmingActivity: '中耕除草', season: 'summer' },
  { id: 'st11', name: '小暑', dateRange: '7月6-8日', farmingActivity: '防涝抗旱', season: 'summer' },
  { id: 'st12', name: '大暑', dateRange: '7月22-24日', farmingActivity: '晒谷储粮', season: 'summer' },
  { id: 'st13', name: '立秋', dateRange: '8月7-9日', farmingActivity: '早稻收割', season: 'autumn' },
  { id: 'st14', name: '处暑', dateRange: '8月22-24日', farmingActivity: '晚稻管理', season: 'autumn' },
  { id: 'st15', name: '白露', dateRange: '9月7-9日', farmingActivity: '秋收准备', season: 'autumn' },
  { id: 'st16', name: '秋分', dateRange: '9月22-24日', farmingActivity: '丰收时节', season: 'autumn' },
  { id: 'st17', name: '寒露', dateRange: '10月8-9日', farmingActivity: '晚稻收割', season: 'autumn' },
  { id: 'st18', name: '霜降', dateRange: '10月23-24日', farmingActivity: '秋收冬储', season: 'autumn' },
  { id: 'st19', name: '立冬', dateRange: '11月7-8日', farmingActivity: '冬耕翻地', season: 'winter' },
  { id: 'st20', name: '小雪', dateRange: '11月22-23日', farmingActivity: '冬季养护', season: 'winter' },
  { id: 'st21', name: '大雪', dateRange: '12月6-8日', farmingActivity: '积肥备耕', season: 'winter' },
  { id: 'st22', name: '冬至', dateRange: '12月21-23日', farmingActivity: '休养生息', season: 'winter' },
  { id: 'st23', name: '小寒', dateRange: '1月5-7日', farmingActivity: '修缮农具', season: 'winter' },
  { id: 'st24', name: '大寒', dateRange: '1月20-21日', farmingActivity: '筹备春耕', season: 'winter' },
];

// 重要文物数据
export const artifacts: Artifact[] = [
  {
    id: 'a001',
    name: '玉蟾岩遗址出土陶器',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    description: '出土陶器',
    period: '旧石器时代晚期',
    unearthedSite: '道县玉蟾岩遗址'
  },
  {
    id: 'a002',
    name: '彭头山遗址出土石斧',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=300&h=300&fit=crop',
    description: '石斧',
    period: '新石器时代早期',
    unearthedSite: '澧县彭头山遗址'
  },
  {
    id: 'a003',
    name: '龟市遗址出土稻谷',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=300&fit=crop',
    description: '出土稻谷',
    period: '新石器时代',
    unearthedSite: '澧县龟市遗址'
  },
  {
    id: 'a004',
    name: '里耶秦简记载农政',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=300&h=300&fit=crop',
    description: '记载农政',
    period: '秦代',
    unearthedSite: '龙山县里耶古城'
  },
  {
    id: 'a005',
    name: '城头山遗址稻田遗迹',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
    description: '世界最早水稻田遗迹',
    period: '新石器时代',
    unearthedSite: '澧县城头山遗址'
  },
  {
    id: 'a006',
    name: '高庙遗址白陶',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    description: '精美白陶祭器',
    period: '新石器时代',
    unearthedSite: '洪江高庙遗址'
  }
];
