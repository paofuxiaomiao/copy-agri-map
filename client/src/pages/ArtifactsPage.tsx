import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl, hideBrokenImage } from '@/lib/assets';

// 文物数据 - 使用用户提供的真实博物馆素材
const artifactCategories = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'specimen', label: '农作物标本', icon: '🌾' },
  { id: 'tool', label: '农耕器具', icon: '⚒️' },
  { id: 'architecture', label: '建筑遗存', icon: '🏛️' },
  { id: 'bronze', label: '青铜礼器', icon: '🏺' },
  { id: 'field', label: '田地遗迹', icon: '🌱' },
];

const artifactsData = [
  {
    id: 'a1',
    name: '西汉稻谷粟标本',
    category: 'specimen',
    period: '西汉（约公元前206年-公元8年）',
    site: '长沙马王堆汉墓一号汉墓出土',
    image: assetUrl('/manus-storage/crop-specimen-2_3ac3a75d.jpg'),
    description: '马王堆汉墓出土的稻谷与粟标本，保存完好，是研究西汉时期湖南农业种植结构的珍贵实物证据。左侧为稻谷，右侧为粟，反映了当时"稻粟兼作"的农业格局。',
    significance: '国家一级文物',
    tags: ['西汉', '稻谷', '粟', '马王堆'],
  },
  {
    id: 'a2',
    name: '普通野生稻与人工栽培稻',
    category: 'specimen',
    period: '新石器时代至今',
    site: '湖南省博物馆馆藏',
    image: assetUrl('/manus-storage/wild-rice-display_9b1d30d0.webp'),
    description: '展示了从野生稻到人工栽培稻的演化过程。前期野生稻与人工栽培稻的对比标本，直观呈现了湖湘先民驯化水稻的伟大历程，是稻作文明起源的重要物证。',
    significance: '重要展品',
    tags: ['野生稻', '栽培稻', '驯化', '稻作起源'],
  },
  {
    id: 'a3',
    name: '玉蟾岩遗址古稻壳标本',
    category: 'specimen',
    period: '距今约14000-12000年',
    site: '湖南道县玉蟾岩遗址出土',
    image: assetUrl('/manus-storage/crop-specimen-1_5f13c604.jpg'),
    description: '玉蟾岩遗址出土的古稻壳标本，是目前世界上已知最早的稻作遗存之一。这两粒微小的古稻壳，见证了人类从采集野生稻到有意识栽培水稻的关键转变。',
    significance: '世界级考古发现',
    tags: ['玉蟾岩', '古稻壳', '万年稻作', '世界之最'],
  },
  {
    id: 'a4',
    name: '东汉陶粮仓系列',
    category: 'tool',
    period: '东汉（25年-220年）',
    site: '湖南各地汉墓出土',
    image: assetUrl('/manus-storage/grain-processing_c71ef1ab.jpg'),
    description: '东汉时期的陶制粮仓模型与粮食加工器具，包括陶粮囷、陶磨、陶碓等。这些随葬明器真实再现了当时粮食储存与加工的完整流程，反映了汉代湖南农业的高度发展。',
    significance: '省级文物',
    tags: ['东汉', '陶粮囷', '粮食加工', '明器'],
  },
  {
    id: 'a5',
    name: '西汉"万石仓"陶石仓',
    category: 'architecture',
    period: '西汉（约公元前206年-公元8年）',
    site: '1954年长沙河西杜陵出土',
    image: assetUrl('/manus-storage/granary-model_21525627.jpg'),
    description: '模合模型，可以拆卸。仓顶有凸起的瓦楞；仓门可开，一侧门框上刻有"万石仓"三字。古人储谷用质日仓，横米日廪。此件为研究汉代粮仓建筑的重要实物资料。',
    significance: '国家二级文物',
    tags: ['西汉', '万石仓', '粮仓建筑', '陶模型'],
  },
  {
    id: 'a6',
    name: '古稻田灌溉沟遗存',
    category: 'field',
    period: '新石器时代（约6500年前）',
    site: '澧县城头山遗址',
    image: assetUrl('/manus-storage/irrigation-ditch_4625d299.jpg'),
    description: '城头山遗址发现的古稻田灌溉沟遗存，是中国目前发现最早的水稻田灌溉系统实物证据。清晰可见的沟渠痕迹，证明了6500年前湖湘先民已掌握了水利灌溉技术。',
    significance: '全国重点文物保护单位',
    tags: ['城头山', '灌溉系统', '水利', '稻田'],
  },
  {
    id: 'a7',
    name: '古稻田耕作层犁痕标本',
    category: 'field',
    period: '新石器时代（约6500年前）',
    site: '澧县城头山遗址',
    image: assetUrl('/manus-storage/plow-marks_83f28f57.jpg'),
    description: '城头山遗址古稻田耕作层中保存的犁痕标本。这些清晰的犁耕痕迹是中国最早的犁耕证据之一，表明新石器时代晚期湖南先民已开始使用犁具进行农田翻耕。',
    significance: '重要考古发现',
    tags: ['犁痕', '耕作层', '犁耕技术', '城头山'],
  },
  {
    id: 'a8',
    name: '商周青铜提梁卣',
    category: 'bronze',
    period: '商周时期（约公元前1600年-公元前256年）',
    site: '湖南省博物馆馆藏',
    image: assetUrl('/manus-storage/bronze-vessel_1645ed5e.jpg'),
    description: '商周时期的青铜提梁卣，器身饰有精美的饕餮纹、云雷纹等纹饰。卣为盛酒器，与农耕祭祀密切相关。青铜器的铸造需要大量粮食供养工匠，是农业发达的间接证据。',
    significance: '国家一级文物',
    tags: ['商周', '青铜卣', '饕餮纹', '祭祀'],
  },
  {
    id: 'a9',
    name: '清代木雕花鸟屏风',
    category: 'architecture',
    period: '清代（1644年-1911年）',
    site: '湖南民间收藏',
    image: assetUrl('/manus-storage/ornate-mirror_fc456ecc.jpg'),
    description: '清代湖南民间精美木雕屏风，采用透雕、浮雕等多种技法，雕刻有凤凰、花卉、瑞兽等吉祥纹样。背景展示了"江西填湖广"人口迁移示意图，反映了明清时期湖南农业开发与人口迁移的历史。',
    significance: '省级文物',
    tags: ['清代', '木雕', '江西填湖广', '民间工艺'],
  },
];

interface ArtifactsPageProps {
  onBack: () => void;
}

export default function ArtifactsPage({ onBack }: ArtifactsPageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArtifact, setSelectedArtifact] = useState<typeof artifactsData[0] | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredArtifacts = activeCategory === 'all'
    ? artifactsData
    : artifactsData.filter(a => a.category === activeCategory);

  // Reveal animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const items = containerRef.current?.querySelectorAll('.reveal-item');
    items?.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [filteredArtifacts]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf8f2 0%, #f3ede3 50%, #ebe5d8 100%)' }}>
      {/* Header Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gold/15" style={{ background: 'rgba(250,248,242,0.92)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-earth hover:text-gold-dark transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回地图</span>
          </button>
          <h1 className="text-lg font-bold font-serif tracking-wider" style={{ color: '#3d2e0a' }}>
            重要文物
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 px-6">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5L35 15L45 15L37 22L40 32L30 26L20 32L23 22L15 15L25 15Z\' fill=\'%238B6914\' fill-opacity=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
        <div className="max-w-[1400px] mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-xs tracking-[0.3em] text-gold-dark/70 uppercase mb-2 font-medium">IMPORTANT ARTIFACTS</p>
            <h2 className="text-3xl font-bold font-serif mb-3" style={{ color: '#2a1f08' }}>湖湘农耕文物精粹</h2>
            <p className="text-sm text-earth/70 max-w-xl mx-auto leading-relaxed">
              从万年前的古稻壳到汉代的青铜礼器，每一件文物都是湖湘农耕文明的无声见证。
              这里汇集了湖南省内最具代表性的农耕文化遗存，以博物馆级的标准呈现。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[53px] z-40 backdrop-blur-lg border-b border-gold/10" style={{ background: 'rgba(246,241,232,0.9)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {artifactCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-gold-dark to-gold text-white shadow-md'
                    : 'bg-white/60 text-earth/70 hover:bg-white hover:text-earth border border-gold/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
            <div className="ml-auto text-xs text-muted-foreground font-medium">
              共 <span className="text-gold-dark font-bold">{filteredArtifacts.length}</span> 件
            </div>
          </div>
        </div>
      </div>

      {/* Artifacts Grid - Museum-style Evidence Display */}
      <div ref={containerRef} className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredArtifacts.map((artifact, index) => (
              <motion.div
                key={artifact.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
                className="reveal-item group"
              >
                <div
                  className="relative bg-white rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-xl transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedArtifact(artifact)}
                >
                  {/* Image with Ken Burns effect */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={artifact.image}
                      alt={artifact.name}
                      className="w-full h-full object-cover transition-transform duration-[8000ms] ease-linear group-hover:scale-110"
                      onError={hideBrokenImage}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Zoom icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      <ZoomIn size={14} className="text-earth" />
                    </div>
                    {/* Significance badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-[10px] font-bold rounded bg-gold-dark/90 text-white backdrop-blur-sm shadow-sm">
                        {artifact.significance}
                      </span>
                    </div>
                    {/* Period badge at bottom */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[11px] text-white/90 font-medium">{artifact.period}</span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold font-serif text-foreground mb-1.5 group-hover:text-gold-dark transition-colors">
                      {artifact.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {artifact.description}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {artifact.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-parchment border border-gold/10 rounded text-earth/70">
                          {tag}
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

      {/* Detail Modal / Lightbox */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedArtifact(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedArtifact(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-lg transition-all active:scale-95"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Image side */}
                <div className="md:w-1/2 relative bg-black/5">
                  <img
                    src={selectedArtifact.image}
                    alt={selectedArtifact.name}
                    className="w-full h-64 md:h-full object-cover"
                    onError={hideBrokenImage}
                  />
                </div>

                {/* Info side */}
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #faf8f2 0%, #f6f1e8 100%)' }}>
                  <div className="space-y-4">
                    {/* Badge */}
                    <span className="inline-block px-3 py-1 text-[11px] font-bold rounded-full bg-gold-dark text-white">
                      {selectedArtifact.significance}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold font-serif" style={{ color: '#2a1f08' }}>
                      {selectedArtifact.name}
                    </h2>

                    {/* Meta info */}
                    <div className="space-y-2 py-3 border-y border-gold/10">
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] text-muted-foreground w-16 flex-shrink-0">年代</span>
                        <span className="text-xs text-foreground font-medium">{selectedArtifact.period}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[11px] text-muted-foreground w-16 flex-shrink-0">出土地</span>
                        <span className="text-xs text-foreground font-medium">{selectedArtifact.site}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-earth/80 leading-[1.9]">
                      {selectedArtifact.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedArtifact.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-[11px] bg-parchment border border-gold/15 rounded-full text-earth font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <button
                        onClick={() => {
                          const idx = artifactsData.findIndex(a => a.id === selectedArtifact.id);
                          const prev = artifactsData[(idx - 1 + artifactsData.length) % artifactsData.length];
                          setSelectedArtifact(prev);
                        }}
                        className="flex items-center gap-1 text-xs text-earth/60 hover:text-gold-dark transition-colors"
                      >
                        <ChevronLeft size={14} /> 上一件
                      </button>
                      <button
                        onClick={() => {
                          const idx = artifactsData.findIndex(a => a.id === selectedArtifact.id);
                          const next = artifactsData[(idx + 1) % artifactsData.length];
                          setSelectedArtifact(next);
                        }}
                        className="flex items-center gap-1 text-xs text-earth/60 hover:text-gold-dark transition-colors"
                      >
                        下一件 <ChevronRight size={14} />
                      </button>
                    </div>
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
