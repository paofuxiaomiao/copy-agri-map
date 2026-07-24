import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CalendarDays, Sprout, X } from 'lucide-react';
import { assetUrl, hideBrokenImage } from '@/lib/assets';

// 二十四节气完整数据
const solarTermsData = [
  { id: 's1', name: '立春', pinyin: 'Lìchūn', season: 'spring', month: '2月3-5日', meaning: '春季开始', farming: '备耕整地，检修农具', description: '立春标志着万物复苏，湖南农民开始准备春耕。此时要翻耕冬闲田，修整水利设施，为即将到来的春播做准备。' },
  { id: 's2', name: '雨水', pinyin: 'Yǔshuǐ', season: 'spring', month: '2月18-20日', meaning: '降雨开始', farming: '育秧准备，施基肥', description: '雨水节气后，湖南气温回升，降水增多。农民开始浸种催芽，准备水稻育秧。洞庭湖区的油菜花也开始绽放。' },
  { id: 's3', name: '惊蛰', pinyin: 'Jīngzhé', season: 'spring', month: '3月5-7日', meaning: '春雷惊醒蛰虫', farming: '早稻育秧，防治病虫', description: '惊蛰时节，春雷始鸣。湖南各地开始大规模育秧，同时要注意防治早春病虫害。传统上有"惊蛰不耙地，好比蒸馍走了气"的农谚。' },
  { id: 's4', name: '春分', pinyin: 'Chūnfēn', season: 'spring', month: '3月20-22日', meaning: '昼夜等长', farming: '早稻插秧，春耕高峰', description: '春分前后是湖南早稻插秧的关键时期。"春分麦起身，一刻值千金"，农民们争分夺秒抢插早稻。' },
  { id: 's5', name: '清明', pinyin: 'Qīngmíng', season: 'spring', month: '4月4-6日', meaning: '天清地明', farming: '早稻管理，茶叶采摘', description: '清明时节雨纷纷，是湖南春茶采摘的黄金期。君山银针、古丈毛尖等名茶此时品质最佳。同时要加强早稻田间管理。' },
  { id: 's6', name: '谷雨', pinyin: 'Gǔyǔ', season: 'spring', month: '4月19-21日', meaning: '雨生百谷', farming: '中稻播种，田间除草', description: '谷雨是春季最后一个节气，降水明显增多。湖南中稻开始播种，"谷雨前后，种瓜点豆"，各类蔬菜瓜果也进入播种期。' },
  { id: 's7', name: '立夏', pinyin: 'Lìxià', season: 'summer', month: '5月5-7日', meaning: '夏季开始', farming: '早稻分蘖，中稻插秧', description: '立夏后湖南进入高温多雨季节。早稻进入分蘖盛期，中稻开始大面积插秧。洞庭湖区的小龙虾也进入丰收季。' },
  { id: 's8', name: '小满', pinyin: 'Xiǎomǎn', season: 'summer', month: '5月20-22日', meaning: '麦类渐满', farming: '水稻追肥，防涝排水', description: '小满时节，湖南进入梅雨季前期。水稻需要追施分蘖肥，同时要做好防涝排水工作。"小满不满，干断田坎"提醒农民注意水分管理。' },
  { id: 's9', name: '芒种', pinyin: 'Mángzhòng', season: 'summer', month: '6月5-7日', meaning: '有芒作物成熟', farming: '早稻抽穗，晚稻育秧', description: '芒种是湖南农事最繁忙的节气。早稻开始抽穗扬花，晚稻育秧同时进行。"芒种忙忙栽"，农民们日夜劳作。' },
  { id: 's10', name: '夏至', pinyin: 'Xiàzhì', season: 'summer', month: '6月21-22日', meaning: '白昼最长', farming: '早稻灌浆，防治稻瘟', description: '夏至日照最长，湖南高温高湿。早稻进入灌浆期，要注意防治稻瘟病和稻飞虱。紫鹊界梯田此时一片翠绿，美不胜收。' },
  { id: 's11', name: '小暑', pinyin: 'Xiǎoshǔ', season: 'summer', month: '7月6-8日', meaning: '暑气渐盛', farming: '早稻收割，双抢开始', description: '小暑后湖南进入酷暑。早稻开始收割，紧接着要抢插晚稻，这就是著名的"双抢"——抢收抢种，是湖南农民最辛苦的时节。' },
  { id: 's12', name: '大暑', pinyin: 'Dàshǔ', season: 'summer', month: '7月22-24日', meaning: '一年最热', farming: '晚稻插秧，抗旱保苗', description: '大暑是一年中最热的时期。湖南晚稻插秧基本结束，要做好抗旱保苗工作。"大暑不暑，五谷不起"，高温对水稻灌浆有利。' },
  { id: 's13', name: '立秋', pinyin: 'Lìqiū', season: 'autumn', month: '8月7-9日', meaning: '秋季开始', farming: '晚稻管理，秋粮播种', description: '立秋后暑气未消，但湖南农民已开始为秋收做准备。晚稻进入拔节孕穗期，需要加强肥水管理。' },
  { id: 's14', name: '处暑', pinyin: 'Chǔshǔ', season: 'autumn', month: '8月22-24日', meaning: '暑气结束', farming: '晚稻抽穗，防治病虫', description: '处暑后湖南气温逐渐下降。晚稻进入抽穗扬花期，是产量形成的关键时期，要重点防治稻飞虱和纹枯病。' },
  { id: 's15', name: '白露', pinyin: 'Báilù', season: 'autumn', month: '9月7-9日', meaning: '露水凝白', farming: '晚稻灌浆，秋收准备', description: '白露时节，湖南早晚温差加大。晚稻进入灌浆期，"白露白迷迷，秋分稻秀齐"，预示着丰收在望。' },
  { id: 's16', name: '秋分', pinyin: 'Qiūfēn', season: 'autumn', month: '9月22-24日', meaning: '昼夜等长', farming: '晚稻成熟，开始秋收', description: '秋分是中国农民丰收节。湖南晚稻陆续成熟收割，金黄的稻浪铺满三湘大地。紫鹊界梯田此时层层金黄，蔚为壮观。' },
  { id: 's17', name: '寒露', pinyin: 'Hánlù', season: 'autumn', month: '10月8-9日', meaning: '露水寒冷', farming: '秋收扫尾，冬种准备', description: '寒露后湖南秋收基本结束。农民开始翻耕稻田，准备种植油菜和冬季蔬菜。"寒露种菜，霜降种麦"是湖南的传统农时。' },
  { id: 's18', name: '霜降', pinyin: 'Shuāngjiàng', season: 'autumn', month: '10月23-24日', meaning: '初霜出现', farming: '冬种油菜，晒谷入仓', description: '霜降是秋季最后一个节气。湖南各地抓紧种植油菜，同时将收获的稻谷晾晒入仓。"霜降见霜，米谷满仓"寄托着丰收的喜悦。' },
  { id: 's19', name: '立冬', pinyin: 'Lìdōng', season: 'winter', month: '11月7-8日', meaning: '冬季开始', farming: '冬闲整地，兴修水利', description: '立冬后湖南进入农闲季节。农民利用冬闲时间整修田埂、疏浚沟渠、兴修水利，为来年春耕打好基础。' },
  { id: 's20', name: '小雪', pinyin: 'Xiǎoxuě', season: 'winter', month: '11月22-23日', meaning: '开始降雪', farming: '冬季管理，腌制腊味', description: '小雪时节，湖南开始制作腊肉、腊鱼等传统腌制品。这是湖湘饮食文化中重要的农事活动，也是稻作文明衍生的食物保存智慧。' },
  { id: 's21', name: '大雪', pinyin: 'Dàxuě', season: 'winter', month: '12月6-8日', meaning: '降雪增多', farming: '积肥备料，修缮农具', description: '大雪时节湖南山区可能出现降雪。农民利用冬闲积肥备料，修缮农具。"瑞雪兆丰年"，适量降雪有利于杀灭越冬害虫。' },
  { id: 's22', name: '冬至', pinyin: 'Dōngzhì', season: 'winter', month: '12月21-23日', meaning: '白昼最短', farming: '冬季深翻，蓄水保墒', description: '冬至是一年中白天最短的一天。湖南农民进行冬季深翻，利用冻融交替改良土壤结构。同时要做好冬季蓄水保墒工作。' },
  { id: 's23', name: '小寒', pinyin: 'Xiǎohán', season: 'winter', month: '1月5-7日', meaning: '寒气渐重', farming: '温室育苗，计划来年', description: '小寒是一年中最冷的时期之一。现代湖南农民利用温室大棚进行蔬菜育苗，同时制定来年的种植计划。' },
  { id: 's24', name: '大寒', pinyin: 'Dàhán', season: 'winter', month: '1月20-21日', meaning: '一年最冷', farming: '备种选种，迎接新春', description: '大寒是冬季最后一个节气。农民开始选购优良稻种，为新一年的春耕做最后准备。"大寒不寒，春分不暖"，农谚中蕴含着千年的气象智慧。' },
];

const termImageNames = [
  'lichun', 'yushui', 'jingzhe', 'chunfen', 'qingming', 'guyu',
  'lixia', 'xiaoman', 'mangzhong', 'xiazhi', 'xiaoshu', 'dashu',
  'liqiu', 'chushu', 'bailu', 'qiufen', 'hanlu', 'shuangjiang',
  'lidong', 'xiaoxue', 'daxue', 'dongzhi', 'xiaohan', 'dahan',
];

const solarTerms = solarTermsData.map((term, index) => ({
  ...term,
  image: assetUrl(`/manus-storage/solar-terms/st-${termImageNames[index]}.webp`),
  order: index + 1,
}));

const seasonMeta: Record<string, { label: string; color: string; wash: string; line: string }> = {
  spring: { label: '春生', color: '#4f7558', wash: '#e9f0e7', line: '#b9cbb7' },
  summer: { label: '夏长', color: '#a56e16', wash: '#f7edcf', line: '#dfca8e' },
  autumn: { label: '秋收', color: '#b7652e', wash: '#f5e5d6', line: '#dfb08e' },
  winter: { label: '冬藏', color: '#607384', wash: '#e5ebee', line: '#b4c0c8' },
};

interface SolarTermsPageProps {
  onBack: () => void;
}

export default function SolarTermsPage({ onBack }: SolarTermsPageProps) {
  const [activeSeason, setActiveSeason] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<typeof solarTerms[0] | null>(null);

  const seasons = [
    { id: 'all', label: '全部节气', color: '#8B6914' },
    { id: 'spring', label: '春', color: '#4A7C59' },
    { id: 'summer', label: '夏', color: '#B8860B' },
    { id: 'autumn', label: '秋', color: '#C67D2A' },
    { id: 'winter', label: '冬', color: '#6B7B8D' },
  ];

  const filteredTerms = activeSeason === 'all'
    ? solarTerms
    : solarTerms.filter(t => t.season === activeSeason);

  return (
    <div className="min-h-screen text-[#3d3324]" style={{ background: 'linear-gradient(180deg, #fbf9f3 0%, #f1eadc 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gold/15" style={{ background: 'rgba(250,248,242,0.92)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-earth hover:text-gold-dark transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回地图</span>
          </button>
          <h1 className="text-lg font-bold font-serif tracking-wider" style={{ color: '#3d2e0a' }}>
            节气日历
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-10 pt-12 text-center">
        <img src={assetUrl('/manus-storage/solar-terms/rice-branch-decor.webp')} alt="" className="pointer-events-none absolute -left-16 -top-20 w-72 -rotate-12 opacity-[0.14] mix-blend-multiply" />
        <img src={assetUrl('/manus-storage/solar-terms/tea-leaf-decor.webp')} alt="" className="pointer-events-none absolute -right-16 -top-24 w-72 rotate-12 opacity-[0.12] mix-blend-multiply" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-[11px] tracking-[0.36em] text-[#96752d]">SOLAR TERMS · HUNAN</p>
          <h2 className="mb-3 font-serif text-4xl font-bold tracking-[0.12em] text-[#2d260f]">二十四节气与农事</h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#71644e]">循四时物候，见三湘耕作。以植物标本串联湖南一年中的播种、生长、收获与冬藏。</p>
          <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-[#b99a50]/25 bg-white/55 px-4 py-2 text-[11px] text-[#77674a] shadow-sm backdrop-blur">
            <CalendarDays size={14} className="text-[#9c7624]" />
            <span>24 节气</span><span className="h-3 w-px bg-[#c9b993]" /><span>4 个农时阶段</span>
          </div>
        </motion.div>
      </section>

      {/* Season Filter */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {seasons.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-200 ${
                activeSeason === s.id
                  ? 'text-white shadow-md'
                  : 'bg-white/60 text-earth/70 hover:bg-white border border-gold/10'
              }`}
              style={activeSeason === s.id ? { background: s.color } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solar Terms Grid */}
      <main className="mx-auto max-w-[1400px] px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filteredTerms.map((term, idx) => (
              <motion.button
                type="button"
                key={term.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="group text-left"
                onClick={() => setSelectedTerm(term)}
                aria-label={`查看${term.name}节气详情`}
              >
                <div
                  className="relative h-full overflow-hidden rounded-[18px] border bg-white/70 shadow-[0_5px_18px_rgba(79,60,28,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_34px_rgba(79,60,28,0.14)]"
                  style={{ borderColor: seasonMeta[term.season].line }}
                >
                  <div className="relative h-44 overflow-hidden" style={{ background: `radial-gradient(circle at 50% 45%, #fff 0%, ${seasonMeta[term.season].wash} 78%)` }}>
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/75 px-2 py-1 text-[9px] font-semibold tracking-widest backdrop-blur" style={{ color: seasonMeta[term.season].color }}>{seasonMeta[term.season].label}</span>
                    <span className="absolute right-3 top-3 z-10 font-serif text-[10px] text-[#8d8069]">{String(term.order).padStart(2, '0')}</span>
                    <img src={term.image} alt={`${term.name}物候植物插画`} loading="lazy" className="h-full w-full scale-[1.08] object-contain px-3 pt-3 transition-transform duration-700 group-hover:scale-[1.15]" onError={hideBrokenImage} />
                  </div>
                  <div className="border-t border-[#d9ccb0]/55 px-4 py-3.5">
                    <div className="flex items-end justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold tracking-[0.12em]" style={{ color: seasonMeta[term.season].color }}>{term.name}</h3>
                      <span className="pb-0.5 text-[10px] text-[#80745f]">{term.month}</span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 truncate text-[10px] text-[#756850]"><Sprout size={11} style={{ color: seasonMeta[term.season].color }} />{term.farming}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedTerm(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative grid max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-[#fbf8f0] shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative min-h-[300px] overflow-hidden md:min-h-[560px]" style={{ background: `radial-gradient(circle at 50% 45%, #fff 0%, ${seasonMeta[selectedTerm.season].wash} 80%)` }}>
                <span className="absolute left-5 top-5 z-10 rounded-full bg-white/75 px-3 py-1 text-[10px] font-semibold tracking-widest" style={{ color: seasonMeta[selectedTerm.season].color }}>{seasonMeta[selectedTerm.season].label} · 第 {selectedTerm.order} 节气</span>
                <img src={selectedTerm.image} alt={`${selectedTerm.name}物候植物插画`} className="absolute inset-0 h-full w-full object-contain p-7 pt-14" onError={hideBrokenImage} />
              </div>

              <div className="relative p-7 md:p-9">
                {/* Close */}
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#cbbd9e]/50 bg-white/70 text-[#6f634e] transition-colors hover:bg-white"
                  aria-label="关闭节气详情"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="mb-7 pr-10">
                  <p className="mb-2 text-[10px] tracking-[0.22em] text-[#9a8762]">{selectedTerm.pinyin.toUpperCase()}</p>
                  <h3 className="font-serif text-4xl font-bold tracking-[0.16em]" style={{ color: seasonMeta[selectedTerm.season].color }}>{selectedTerm.name}</h3>
                  <p className="mt-3 text-sm text-[#71644d]">{selectedTerm.month} · {selectedTerm.meaning}</p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-xs font-bold tracking-[0.18em] text-[#4d422f]">节气释义</h4>
                    <p className="text-sm leading-[1.9] text-[#655945]">{selectedTerm.description}</p>
                  </div>

                  <div className="rounded-xl border p-4" style={{ background: seasonMeta[selectedTerm.season].wash, borderColor: seasonMeta[selectedTerm.season].line }}>
                    <h4 className="mb-1.5 flex items-center gap-2 text-xs font-bold" style={{ color: seasonMeta[selectedTerm.season].color }}><Sprout size={14} />湖南农事</h4>
                    <p className="text-sm text-[#615743]">{selectedTerm.farming}</p>
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
