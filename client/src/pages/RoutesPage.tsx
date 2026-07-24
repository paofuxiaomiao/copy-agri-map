import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Route, ChevronRight } from 'lucide-react';
import { assetUrl, hideBrokenImage } from '@/lib/assets';

// 主题线路数据
const routesData = [
  {
    id: 'r1',
    name: '农耕文明探源之旅',
    theme: '考古探源',
    duration: '3天2晚',
    difficulty: '轻松',
    coverImage: assetUrl('/manus-storage/irrigation-ditch_4625d299.jpg'),
    description: '探访稻作起源圣地，追溯湖湘农耕文明的千年脉络。从玉蟾岩到城头山，见证人类最早的稻作文明。',
    highlights: ['玉蟾岩遗址', '城头山古稻田', '彭头山遗址', '高庙遗址'],
    color: '#8B6914',
    stops: [
      { name: '道县玉蟾岩遗址', desc: '世界最早稻作遗存' },
      { name: '澧县城头山遗址', desc: '中国最早的古稻田' },
      { name: '澧县彭头山遗址', desc: '长江中游新石器文化' },
      { name: '洪江高庙遗址', desc: '史前宗教艺术圣地' },
    ],
  },
  {
    id: 'r2',
    name: '数字农旅体验之旅',
    theme: '科技农旅',
    duration: '2天1晚',
    difficulty: '轻松',
    coverImage: assetUrl('/manus-storage/wild-rice-display_9b1d30d0.webp'),
    description: '科技赋能乡村，体验现代农业与乡村振兴成果。从杂交水稻基地到智慧农业示范园，感受科技改变农业的力量。',
    highlights: ['杂交水稻基地', '紫鹊界梯田', '智慧农业园', '隆平水稻博物馆'],
    color: '#4A7C59',
    stops: [
      { name: '隆平水稻博物馆', desc: '杂交水稻发展史' },
      { name: '新化紫鹊界梯田', desc: '千年梯田活化石' },
      { name: '浏阳智慧农业园', desc: '数字化精准农业' },
      { name: '洞庭湖生态农场', desc: '生态循环农业典范' },
    ],
  },
  {
    id: 'r3',
    name: '红色农事教育之旅',
    theme: '红色文化',
    duration: '2天1晚',
    difficulty: '适中',
    coverImage: assetUrl('/manus-storage/granary-model_21525627.jpg'),
    description: '走进红色旧址，传承农耕精神与革命记忆。从韶山到浏阳，追寻革命先辈的农耕足迹。',
    highlights: ['韶山毛泽东故居', '浏阳秋收起义旧址', '十八洞村', '红色粮仓'],
    color: '#C41E3A',
    stops: [
      { name: '韶山毛泽东故居', desc: '伟人的农耕记忆' },
      { name: '浏阳秋收起义旧址', desc: '农民运动的起点' },
      { name: '花垣十八洞村', desc: '精准扶贫首倡地' },
      { name: '湘潭红色粮仓', desc: '革命年代的粮食保障' },
    ],
  },
  {
    id: 'r4',
    name: '湖湘青铜文明之旅',
    theme: '青铜文化',
    duration: '3天2晚',
    difficulty: '适中',
    coverImage: assetUrl('/manus-storage/bronze-vessel_1645ed5e.jpg'),
    description: '探寻商周青铜重器背后的农耕经济基础，从宁乡炭河里到长沙博物馆，感受青铜时代湖南的农业繁荣。',
    highlights: ['炭河里遗址', '四羊方尊出土地', '省博物馆', '铜官窑'],
    color: '#5D4E37',
    stops: [
      { name: '宁乡炭河里遗址', desc: '南方青铜文明中心' },
      { name: '四羊方尊出土地', desc: '国之重器的故乡' },
      { name: '湖南省博物馆', desc: '青铜农耕文物精粹' },
      { name: '长沙铜官窑', desc: '陶瓷与农业贸易' },
    ],
  },
  {
    id: 'r5',
    name: '明清农耕民俗之旅',
    theme: '民俗文化',
    duration: '3天2晚',
    difficulty: '轻松',
    coverImage: assetUrl('/manus-storage/ornate-mirror_fc456ecc.jpg'),
    description: '体验明清时期"湖广熟天下足"的农耕盛景，探访古村落、古粮仓、传统农具作坊，感受湖湘农耕民俗的活态传承。',
    highlights: ['张谷英村', '凤凰古城', '洪江古商城', '传统农具作坊'],
    color: '#8B4513',
    stops: [
      { name: '岳阳张谷英村', desc: '天下第一村的农耕智慧' },
      { name: '凤凰古城', desc: '苗族农耕文化活化石' },
      { name: '洪江古商城', desc: '明清粮食贸易重镇' },
      { name: '永顺老司城', desc: '土司时代的农耕管理' },
    ],
  },
  {
    id: 'r6',
    name: '洞庭湖粮仓之旅',
    theme: '生态农业',
    duration: '2天1晚',
    difficulty: '轻松',
    coverImage: assetUrl('/manus-storage/crop-specimen-2_3ac3a75d.jpg'),
    description: '环洞庭湖探访"天下粮仓"的前世今生，从古代围垸到现代生态农业，见证湖区农业的千年变迁。',
    highlights: ['洞庭湖湿地', '华容稻田', '南县稻虾共作', '君山银针茶园'],
    color: '#1976D2',
    stops: [
      { name: '岳阳洞庭湖湿地', desc: '八百里洞庭的生态基底' },
      { name: '华容万亩稻田', desc: '现代粮仓的壮美' },
      { name: '南县稻虾共作基地', desc: '生态循环新模式' },
      { name: '君山银针茶园', desc: '茶稻共生的智慧' },
    ],
  },
];

interface RoutesPageProps {
  onBack: () => void;
}

export default function RoutesPage({ onBack }: RoutesPageProps) {
  const [selectedRoute, setSelectedRoute] = useState<typeof routesData[0] | null>(null);
  const [activeTheme, setActiveTheme] = useState('all');

  const themes = [
    { id: 'all', label: '全部线路' },
    { id: '考古探源', label: '考古探源' },
    { id: '科技农旅', label: '科技农旅' },
    { id: '红色文化', label: '红色文化' },
    { id: '青铜文化', label: '青铜文化' },
    { id: '民俗文化', label: '民俗文化' },
    { id: '生态农业', label: '生态农业' },
  ];

  const filteredRoutes = activeTheme === 'all'
    ? routesData
    : routesData.filter(r => r.theme === activeTheme);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf8f2 0%, #f3ede3 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gold/15" style={{ background: 'rgba(250,248,242,0.92)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-earth hover:text-gold-dark transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回地图</span>
          </button>
          <h1 className="text-lg font-bold font-serif tracking-wider" style={{ color: '#3d2e0a' }}>
            主题线路
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero */}
      <div className="py-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.3em] text-gold-dark/70 uppercase mb-2">THEMED ROUTES</p>
          <h2 className="text-3xl font-bold font-serif mb-3" style={{ color: '#2a1f08' }}>农耕文化主题线路</h2>
          <p className="text-sm text-earth/70 max-w-xl mx-auto leading-relaxed">
            精心策划的文化探访路线，带您深入湖湘大地，感受万年农耕文明的脉动
          </p>
        </motion.div>
      </div>

      {/* Theme Filter */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeTheme === t.id
                  ? 'bg-gradient-to-r from-gold-dark to-gold text-white shadow-md'
                  : 'bg-white/60 text-earth/70 hover:bg-white hover:text-earth border border-gold/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Grid - Equal-distance cards */}
      <div className="max-w-[1400px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredRoutes.map((route, idx) => (
              <motion.div
                key={route.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group cursor-pointer"
                onClick={() => setSelectedRoute(route)}
              >
                <div className="relative bg-white rounded-xl overflow-hidden border border-gold/10 hover:border-gold/25 hover:shadow-xl transition-all duration-500">
                  {/* Cover image with Ken Burns */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={route.coverImage}
                      alt={route.name}
                      className="w-full h-full object-cover transition-transform duration-[6000ms] ease-linear group-hover:scale-110"
                      onError={hideBrokenImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* Theme badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full text-white backdrop-blur-sm" style={{ background: `${route.color}cc` }}>
                        {route.theme}
                      </span>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                      <Clock size={10} className="text-earth" />
                      <span className="text-[10px] font-medium text-earth">{route.duration}</span>
                    </div>
                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base font-bold text-white font-serif">{route.name}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[11px] text-earth/70 leading-relaxed line-clamp-2 mb-3">
                      {route.description}
                    </p>

                    {/* Route stops preview */}
                    <div className="flex items-center gap-1 mb-3">
                      {route.stops.slice(0, 4).map((stop, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-2 h-2 rounded-full" style={{ background: route.color }} />
                          {i < 3 && <div className="w-4 h-px" style={{ background: `${route.color}40` }} />}
                        </div>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">{route.stops.length}站</span>
                    </div>

                    {/* Highlights tags */}
                    <div className="flex flex-wrap gap-1">
                      {route.highlights.slice(0, 3).map(h => (
                        <span key={h} className="px-1.5 py-0.5 text-[10px] bg-parchment border border-gold/10 rounded text-earth/60">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Route Detail Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedRoute(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Cover */}
              <div className="relative h-48 overflow-hidden">
                <img src={selectedRoute.coverImage} alt={selectedRoute.name} className="w-full h-full object-cover" onError={hideBrokenImage} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full text-white mb-2 inline-block" style={{ background: `${selectedRoute.color}cc` }}>
                    {selectedRoute.theme}
                  </span>
                  <h2 className="text-xl font-bold text-white font-serif">{selectedRoute.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all"
                >
                  <span className="text-earth text-sm">✕</span>
                </button>
              </div>

              {/* Detail content */}
              <div className="p-5 space-y-5" style={{ background: 'linear-gradient(180deg, #faf8f2 0%, white 100%)' }}>
                {/* Meta */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-earth/70">
                    <Clock size={13} />
                    <span>{selectedRoute.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-earth/70">
                    <Route size={13} />
                    <span>{selectedRoute.stops.length}个站点</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-earth/70">
                    <MapPin size={13} />
                    <span>难度: {selectedRoute.difficulty}</span>
                  </div>
                </div>

                <p className="text-sm text-earth/80 leading-[1.8]">{selectedRoute.description}</p>

                {/* Route stops */}
                <div>
                  <h4 className="text-xs font-bold text-earth mb-3 tracking-wider">行程站点</h4>
                  <div className="space-y-3">
                    {selectedRoute.stops.map((stop, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: selectedRoute.color }}>
                            {i + 1}
                          </div>
                          {i < selectedRoute.stops.length - 1 && (
                            <div className="w-px h-6 mt-1" style={{ background: `${selectedRoute.color}30` }} />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <h5 className="text-sm font-medium text-foreground">{stop.name}</h5>
                          <p className="text-[11px] text-muted-foreground">{stop.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
