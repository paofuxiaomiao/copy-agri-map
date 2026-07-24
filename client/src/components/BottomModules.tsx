import { ChevronRight } from 'lucide-react';
import { culturePoints, themeRoutes, timelineEvents, solarTerms, artifacts } from '@/data/points';
import { assetUrl, hideBrokenImage } from '@/lib/assets';

interface BottomModulesProps {
  onPointSelect?: (pointId: string) => void;
  onNavigate?: (nav: string) => void;
}

// AI-generated refined timeline icons
const timelineIcons: Record<string, string> = {
  't001': assetUrl('/manus-storage/timeline-icon-1-prehistoric.webp'),
  't002': assetUrl('/manus-storage/timeline-icon-2-neolithic.webp'),
  't003': assetUrl('/manus-storage/timeline-icon-3-bronze-age.webp'),
  't004': assetUrl('/manus-storage/timeline-icon-4-imperial.webp'),
  't005': assetUrl('/manus-storage/timeline-icon-5-modern.webp'),
  't006': assetUrl('/manus-storage/timeline-icon-6-hybrid-rice.webp'),
};

const solarTermIcons: Record<string, string> = {
  'st01': assetUrl('/manus-storage/solar-terms/st-lichun.webp'),
  'st02': assetUrl('/manus-storage/solar-terms/st-yushui.webp'),
  'st03': assetUrl('/manus-storage/solar-terms/st-jingzhe.webp'),
  'st04': assetUrl('/manus-storage/solar-terms/st-chunfen.webp'),
  'st05': assetUrl('/manus-storage/solar-terms/st-qingming.webp'),
  'st06': assetUrl('/manus-storage/solar-terms/st-guyu.webp'),
  'st07': assetUrl('/manus-storage/solar-terms/st-lixia.webp'),
  'st08': assetUrl('/manus-storage/solar-terms/st-xiaoman.webp'),
};

// Rice icon for headlines
const RICE_ICON = assetUrl('/manus-storage/rice-icon-headline.webp');
const BOTTOM_FIELD_DECOR = assetUrl('/manus-storage/bottom-field-decor.webp');

function swapToFallbackImage(event: { currentTarget: HTMLImageElement }, fallback: string | undefined) {
  if (!fallback) {
    hideBrokenImage(event);
    return;
  }
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallback;
}

export default function BottomModules({ onNavigate, onPointSelect }: BottomModulesProps) {
  return (
    <div
      className="w-full flex-shrink-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #faf8f2 0%, #f0e8d4 100%)' }}
    >
      <div className="gold-thread" />

      <div className="absolute inset-0 pointer-events-none">
        <img
          src={BOTTOM_FIELD_DECOR}
          alt=""
          className="absolute bottom-0 left-0 w-full h-[130%] object-cover opacity-[0.32]"
          style={{ mixBlendMode: 'multiply', objectPosition: 'center 70%' }}
        />
      </div>

      <div className="grid grid-cols-12 gap-0 relative z-10" style={{ height: '175px' }}>
        
        {/* Theme Routes - 3 cols */}
        <div className="col-span-3 px-3 py-2.5 border-r border-gold/15 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-bold font-serif flex items-center gap-1" style={{ color: '#3d2e0a' }}>
              <img src={RICE_ICON} alt="" className="w-4 h-4 object-contain opacity-80" onError={hideBrokenImage} />
              主题线路
            </h3>
            <button onClick={() => onNavigate?.('routes')} className="text-[11px] text-[#8a7a5a] hover:text-gold-dark flex items-center gap-0.5 transition-colors">
              更多线路 <ChevronRight size={11} />
            </button>
          </div>
          <div className="flex gap-2">
            {themeRoutes.slice(0, 3).map((route) => (
              <button key={route.id} type="button" className="flex-1 bottom-module-card group text-left active:scale-[0.97]" onClick={() => onPointSelect?.(route.points[0])}>
                <div className="bottom-module-thumb aspect-[16/10] rounded-md overflow-hidden bg-muted mb-1 shadow-sm border border-gold/10 group-hover:shadow-lg group-hover:border-gold/30 transition-all duration-300 relative">
                  <img
                    src={route.coverImage}
                    alt={route.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(event) => swapToFallbackImage(event, culturePoints.find((point) => point.id === route.points[0])?.coverImage)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h4 className="text-[11px] font-bold text-foreground truncate group-hover:text-gold-dark transition-colors leading-tight">{route.name}</h4>
                <p className="text-[9px] text-muted-foreground line-clamp-2 leading-snug mt-0.5">{route.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline - 3 cols: AI-generated refined icons */}
        <div className="col-span-3 px-3 py-2.5 border-r border-gold/15 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-bold font-serif flex items-center gap-1" style={{ color: '#3d2e0a' }}>
              <img src={RICE_ICON} alt="" className="w-4 h-4 object-contain opacity-80" onError={hideBrokenImage} />
              湖湘农耕文化发展脉络
            </h3>
            <button onClick={() => onNavigate?.('timeline')} className="text-[11px] text-[#8a7a5a] hover:text-gold-dark flex items-center gap-0.5 transition-colors">
              查看完整脉络 <ChevronRight size={11} />
            </button>
          </div>
          {/* AI-generated refined icons */}
          <div className="flex items-start justify-between gap-0.5">
            {timelineEvents.map((event) => (
              <button key={event.id} type="button" className="flex flex-col items-center text-center group bottom-timeline-item flex-1">
                <div className="w-11 h-11 rounded-full overflow-hidden mb-1 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md border border-gold/15 relative bottom-icon-frame">
                  <span className="bottom-icon-fallback">{event.icon}</span>
                  <img 
                    src={timelineIcons[event.id] || ''} 
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={hideBrokenImage}
                  />
                </div>
                <span className="text-[9px] font-semibold text-foreground leading-tight block">{event.title}</span>
                <span className="text-[8px] text-muted-foreground leading-tight mt-0.5">{event.period}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Solar Terms - 2 cols: AI-generated refined icons */}
        <div className="col-span-2 px-2.5 py-2.5 border-r border-gold/15 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-bold font-serif flex items-center gap-1" style={{ color: '#3d2e0a' }}>
              <img src={RICE_ICON} alt="" className="w-4 h-4 object-contain opacity-80" onError={hideBrokenImage} />
              二十四节气
            </h3>
            <button onClick={() => onNavigate?.('solar')} className="text-[11px] text-[#8a7a5a] hover:text-gold-dark flex items-center gap-0.5 transition-colors">
              查看全部 <ChevronRight size={11} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-x-2 gap-y-2">
            {solarTerms.slice(0, 8).map((term) => (
              <button key={term.id} type="button" className="flex flex-col items-center gap-0.5 group bottom-solar-item">
                <div className="w-9 h-9 rounded-full overflow-hidden group-hover:shadow-md transition-all duration-200 border border-gold/12 relative bottom-icon-frame">
                  <span className="bottom-icon-fallback text-[12px]">{term.name.slice(0, 1)}</span>
                  <img 
                    src={solarTermIcons[term.id] || ''} 
                    alt={term.name}
                    className="absolute inset-0 h-full w-full object-contain p-1"
                    onError={hideBrokenImage}
                  />
                </div>
                <span className="text-[9px] text-foreground/75 group-hover:text-gold-dark transition-colors">{term.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Artifacts - 4 cols: single row of larger images */}
        <div className="col-span-4 px-3 py-2.5 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-bold font-serif flex items-center gap-1" style={{ color: '#3d2e0a' }}>
              <img src={RICE_ICON} alt="" className="w-4 h-4 object-contain opacity-80" onError={hideBrokenImage} />
              重要文物
            </h3>
            <button onClick={() => onNavigate?.('artifacts')} className="text-[11px] text-[#8a7a5a] hover:text-gold-dark flex items-center gap-0.5 transition-colors">
              查看更多 <ChevronRight size={11} />
            </button>
          </div>
          {/* Single row of 5 larger artifact images */}
          <div className="grid grid-cols-5 gap-2">
            {artifacts.slice(0, 5).map((artifact) => (
              <button key={artifact.id} type="button" className="group bottom-module-card active:scale-[0.97]" onClick={() => {
                // Match artifact's unearthedSite to a culturePoint name
                const siteToPointMap: Record<string, string> = {
                  '道县玉蟾岩遗址': 'p002',
                  '澧县彭头山遗址': 'p006',
                  '澧县龟市遗址': 'p001',
                  '龙山县里耶古城': 'p008',
                  '澧县城头山遗址': 'p001',
                  '洪江高庙遗址': 'p007',
                };
                const pointId = siteToPointMap[artifact.unearthedSite];
                if (pointId) onPointSelect?.(pointId);
              }}>
                <div className="bottom-module-thumb aspect-[3/4] rounded-md overflow-hidden bg-muted border border-gold/10 group-hover:border-gold/30 group-hover:shadow-lg transition-all duration-300 relative">
                  <img src={artifact.image} alt={artifact.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onError={hideBrokenImage} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-[8px] text-foreground/65 mt-0.5 truncate text-center group-hover:text-gold-dark transition-colors">{artifact.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
