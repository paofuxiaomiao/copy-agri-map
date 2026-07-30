import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Route, ChevronRight } from 'lucide-react';
import { assetUrl, hideBrokenImage } from '@/lib/assets';
import { culturePoints, themeRoutes, type ThemeRoute } from '@/data/points';

const pointById = new Map(culturePoints.map(point => [point.id, point]));

const routesData = themeRoutes.map(route => ({
  ...route,
  stops: route.points.flatMap(pointId => {
    const point = pointById.get(pointId);
    return point ? [{
      pointId,
      name: point.name,
      desc: point.heritageLevel ?? `${point.city} · ${point.period}`,
    }] : [];
  }),
  highlights: route.points
    .map(pointId => pointById.get(pointId)?.name)
    .filter((name): name is string => Boolean(name)),
}));

type RouteCard = (typeof routesData)[number];

interface RoutesPageProps {
  onBack: () => void;
  onRouteSelect: (routeId: ThemeRoute['id'], pointId?: string) => void;
}

export default function RoutesPage({ onBack, onRouteSelect }: RoutesPageProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteCard | null>(null);
  const [activeTheme, setActiveTheme] = useState('all');

  const themes = [
    { id: 'all', label: '全部线路' },
    { id: '历史探源', label: '历史探源' },
    { id: '科技农旅', label: '科技农旅' },
    { id: '红色教育', label: '红色教育' },
  ];

  const filteredRoutes = activeTheme === 'all'
    ? routesData
    : routesData.filter(r => r.theme === activeTheme);

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #faf8f2 0%, #f3ede3 100%)' }}>
      {/* Ambient page decoration - fixed ink-wash backdrop */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${assetUrl('/manus-storage/routes-hero-bg.webp')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: 0.4,
        }}
      />
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
      <div className="relative py-14 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${assetUrl('/manus-storage/routes-hero-bg.webp')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 65%',
            opacity: 0.85,
            maskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
          }}
        />
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs tracking-[0.3em] text-gold-dark/70 uppercase mb-2">THEMED ROUTES</p>
          <h2 className="text-3xl font-bold font-serif mb-3" style={{ color: '#2a1f08' }}>农耕文化主题线路</h2>
          <p className="text-sm text-earth/70 max-w-xl mx-auto leading-relaxed">
            精心策划的文化探访路线，带您深入湖湘大地，感受万年农耕文明的脉动
          </p>
        </motion.div>
      </div>

      {/* Theme Filter */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              className={`silky-chip px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
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
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredRoutes.map((route, idx) => (
              <motion.button
                key={route.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group cursor-pointer text-left"
                onClick={() => setSelectedRoute(route)}
                aria-label={`查看路线：${route.name}`}
              >
                <div className="silky-card relative bg-white rounded-xl overflow-hidden border border-gold/10 hover:border-gold/25">
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
              </motion.button>
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
                  aria-label="关闭路线详情"
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
                      <button
                        key={stop.pointId}
                        type="button"
                        onClick={() => onRouteSelect(selectedRoute.id, stop.pointId)}
                        className="group/stop flex w-full items-start gap-3 rounded-lg p-1.5 -m-1.5 text-left transition-colors hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
                        aria-label={`在地图查看第${i + 1}站：${stop.name}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm transition-transform group-hover/stop:scale-110" style={{ background: selectedRoute.color }}>
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
                        <ChevronRight size={16} className="text-muted-foreground mt-1 transition-transform group-hover/stop:translate-x-0.5 group-hover/stop:text-gold-dark" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRouteSelect(selectedRoute.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  style={{ background: `linear-gradient(135deg, ${selectedRoute.color}, ${selectedRoute.color}cc)` }}
                >
                  <Route size={16} />
                  在地图查看完整路线
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
