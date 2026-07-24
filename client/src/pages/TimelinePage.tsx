import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl, hideBrokenImage } from '@/lib/assets';

// 发展脉络数据 - 横向时间轴
const timelineData = [
  {
    id: 't1',
    era: '史前稻作起源',
    period: '距今约14000-9000年',
    yearRange: '14000 BP',
    color: '#6B4E2A',
    bgGradient: 'from-amber-900/10 to-amber-800/5',
    image: assetUrl('/manus-storage/crop-specimen-1_5f13c604.jpg'),
    title: '万年稻作的曙光',
    description: '湖南道县玉蟾岩遗址发现了距今约14000年的古栽培稻遗存，是世界上已知最早的稻作证据之一。这一发现将人类栽培水稻的历史大幅前推，确立了湖南在世界稻作文明起源中的核心地位。',
    keyEvents: ['玉蟾岩遗址发现古稻壳', '野生稻向栽培稻过渡', '人类最早的农业尝试'],
    artifacts: ['古稻壳标本', '石器工具'],
  },
  {
    id: 't2',
    era: '新石器时代',
    period: '约7000-5000年前',
    yearRange: '7000 BP',
    color: '#8B6914',
    bgGradient: 'from-yellow-800/10 to-yellow-700/5',
    image: assetUrl('/manus-storage/irrigation-ditch_4625d299.jpg'),
    title: '稻田文明的确立',
    description: '澧县城头山遗址发现了距今约6500年的古稻田遗迹，包括完整的灌溉系统、犁耕痕迹和水稻田埂。这是中国乃至世界上已知最早的水稻田实物遗存，标志着湖湘先民已从原始农业进入系统化的稻作农业阶段。',
    keyEvents: ['城头山古稻田发现', '灌溉系统建立', '犁耕技术出现', '环壕聚落形成'],
    artifacts: ['灌溉沟遗存', '犁痕标本', '碳化稻谷'],
  },
  {
    id: 't3',
    era: '商周至秦汉',
    period: '约前1600-公元220年',
    yearRange: '1600 BC',
    color: '#4A7C59',
    bgGradient: 'from-green-800/10 to-green-700/5',
    image: assetUrl('/manus-storage/bronze-vessel_1645ed5e.jpg'),
    title: '青铜时代的农耕繁荣',
    description: '商周时期，湖南青铜文明达到鼎盛，大量青铜礼器的铸造需要强大的农业经济支撑。秦汉时期，"楚地饶谷"的记载表明湖南已成为重要的粮食产区。马王堆汉墓出土的稻谷粟标本，直接证明了汉代湖南"稻粟兼作"的农业格局。',
    keyEvents: ['青铜礼器大量铸造', '"楚地饶谷"载入史册', '铁制农具推广', '马王堆汉墓随葬谷物'],
    artifacts: ['青铜提梁卣', '西汉稻谷粟', '陶粮仓模型'],
  },
  {
    id: 't4',
    era: '隋唐宋元明清',
    period: '581-1911年',
    yearRange: '581 AD',
    color: '#C41E3A',
    bgGradient: 'from-red-800/10 to-red-700/5',
    image: assetUrl('/manus-storage/ornate-mirror_fc456ecc.jpg'),
    title: '湖广熟天下足',
    description: '"江西填湖广"的大规模移民运动带来了先进的农耕技术和大量劳动力，推动了湖南农业的跨越式发展。明清时期"湖广熟，天下足"的谚语，标志着湖南已成为全国最重要的粮食产区之一。',
    keyEvents: ['"江西填湖广"人口迁移', '双季稻推广', '梯田大规模开发', '"湖广熟天下足"'],
    artifacts: ['木雕屏风', '农具实物', '地契文书'],
  },
  {
    id: 't5',
    era: '现代农业发展',
    period: '20世纪以来',
    yearRange: '1900s',
    color: '#2E7D32',
    bgGradient: 'from-emerald-800/10 to-emerald-700/5',
    image: assetUrl('/manus-storage/wild-rice-display_9b1d30d0.webp'),
    title: '杂交水稻的故乡',
    description: '1973年，袁隆平在湖南成功培育出世界首个杂交水稻品种，开创了水稻育种的新纪元。从野生稻到杂交稻，湖南始终站在世界稻作文明的最前沿，为全球粮食安全作出了不可磨灭的贡献。',
    keyEvents: ['袁隆平杂交水稻成功', '超级稻亩产突破', '现代农业科技园建设', '稻作文化遗产保护'],
    artifacts: ['杂交水稻标本', '野生稻保护区'],
  },
  {
    id: 't6',
    era: '杂交水稻与粮食保护',
    period: '1970s至今',
    yearRange: '1970s',
    color: '#1565C0',
    bgGradient: 'from-blue-800/10 to-blue-700/5',
    image: assetUrl('/manus-storage/grain-processing_c71ef1ab.jpg'),
    title: '从传统到现代的传承',
    description: '现代湖南在保护传统农耕文化遗产的同时，积极推进农业现代化。从古代陶粮仓到现代粮食储备体系，从手工碾米到机械化加工，湖湘农耕文明在传承中不断创新发展。',
    keyEvents: ['传统农具保护收藏', '农耕文化博物馆建设', '非遗技艺传承', '数字化保护工程'],
    artifacts: ['东汉陶粮囷', '传统农具', '非遗档案'],
  },
];

interface TimelinePageProps {
  onBack: () => void;
}

export default function TimelinePage({ onBack }: TimelinePageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.timeline-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setScrollProgress(scrollLeft / (scrollWidth - clientWidth));
      // Determine active card
      const cards = container.querySelectorAll('.timeline-card');
      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.left >= containerRect.left && rect.left < containerRect.left + containerRect.width / 2) {
          setActiveIndex(idx);
        }
      });
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

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
            发展脉络
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
          <p className="text-xs tracking-[0.3em] text-gold-dark/70 uppercase mb-2">DEVELOPMENT TIMELINE</p>
          <h2 className="text-3xl font-bold font-serif mb-3" style={{ color: '#2a1f08' }}>湖湘农耕文化发展脉络</h2>
          <p className="text-sm text-earth/70 max-w-xl mx-auto leading-relaxed">
            从万年前的稻作起源到现代杂交水稻，一条贯穿时空的文明之线
          </p>
        </motion.div>
      </div>

      {/* Timeline Navigation Dots */}
      <div className="max-w-[1400px] mx-auto px-6 mb-4">
        <div className="relative flex items-center justify-between">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gold/20 -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-gold-dark to-gold -translate-y-1/2 transition-all duration-300"
            style={{ width: `${(activeIndex / (timelineData.length - 1)) * 100}%` }}
          />
          {timelineData.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollToIndex(idx)}
              className="relative z-10 flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  idx <= activeIndex
                    ? 'border-gold-dark bg-gold-dark scale-110'
                    : 'border-gold/30 bg-white hover:border-gold/60'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors whitespace-nowrap ${
                idx === activeIndex ? 'text-gold-dark' : 'text-muted-foreground'
              }`}>
                {item.yearRange}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Timeline Cards */}
      <div className="relative">
        {/* Scroll arrows */}
        <button
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
        >
          <ChevronLeft size={18} className="text-earth" />
        </button>
        <button
          onClick={() => scrollToIndex(Math.min(timelineData.length - 1, activeIndex + 1))}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
        >
          <ChevronRight size={18} className="text-earth" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-12 py-6 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {timelineData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="timeline-card snap-center flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[700px]"
            >
              <div className={`relative bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-lg hover:shadow-xl transition-shadow duration-500`}>
                {/* Top color bar */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />

                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 md:h-full object-cover"
                      onError={hideBrokenImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-gradient-to-l" />
                    {/* Era badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 rounded-lg backdrop-blur-md text-white text-xs font-bold" style={{ background: `${item.color}dd` }}>
                        {item.era}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-muted-foreground">{item.period}</span>
                    </div>
                    <h3 className="text-lg font-bold font-serif mb-2" style={{ color: item.color }}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-earth/70 leading-[1.8] mb-4">
                      {item.description}
                    </p>

                    {/* Key Events */}
                    <div className="space-y-1.5 mb-4">
                      <h4 className="text-[11px] font-bold text-earth/50 uppercase tracking-wider">关键事件</h4>
                      {item.keyEvents.map((event, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                          <span className="text-[11px] text-earth/70">{event}</span>
                        </div>
                      ))}
                    </div>

                    {/* Related Artifacts */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.artifacts.map(art => (
                        <span key={art} className="px-2 py-0.5 text-[10px] border rounded-full font-medium" style={{ borderColor: `${item.color}30`, color: item.color, background: `${item.color}08` }}>
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Stats */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '时间跨度', value: '14000年', sub: '从史前到现代' },
            { label: '重要遗址', value: '128处', sub: '遍布三湘四水' },
            { label: '文物藏品', value: '24件', sub: '国家级珍品' },
            { label: '文化脉络', value: '6个阶段', sub: '完整发展链条' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center p-4 rounded-xl bg-white/60 border border-gold/10"
            >
              <div className="text-2xl font-bold font-serif text-gold-dark">{stat.value}</div>
              <div className="text-xs font-medium text-foreground mt-1">{stat.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
