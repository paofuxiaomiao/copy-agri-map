import { X, ChevronLeft, ChevronRight, FileText, Route, Share2, MapPin, CalendarDays } from 'lucide-react';
import { CulturePoint } from '@/data/points';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { assetUrl } from '@/lib/assets';

interface PointDetailProps {
  point: CulturePoint | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const categoryLabels: Record<string, string> = {
  ancient: '古代农耕遗址',
  modern: '现代农耕地标',
  red: '红色农耕旧址',
};

const categoryBgColors: Record<string, string> = {
  ancient: '#8B6914',
  modern: '#4A7C59',
  red: '#C41E3A',
};

export default function PointDetail({ point, onClose, onPrev, onNext }: PointDetailProps) {
  return (
    <AnimatePresence mode="wait">
      {point && (
        <motion.div
          key={point.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-3 right-3 z-[1001] w-[min(384px,calc(100vw-1.5rem))] point-detail-panel rounded-lg overflow-hidden max-h-[calc(100%-1.5rem)] flex flex-col"
          style={{
            '--xiangxi-pattern': `url("${assetUrl('/manus-storage/xiangxi-brocade-pattern.png')}")`,
          } as React.CSSProperties}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gold/10 bg-white/95 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-gold-dark">
                <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.3"/>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <h3 className="text-[13px] font-semibold text-foreground font-serif">点位详情</h3>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={onPrev} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gold/10 transition-colors active:scale-95">
                <ChevronLeft size={15} className="text-muted-foreground" />
              </button>
              <button onClick={onNext} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gold/10 transition-colors active:scale-95">
                <ChevronRight size={15} className="text-muted-foreground" />
              </button>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red/10 transition-colors ml-1 active:scale-95">
                <X size={15} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 overflow-y-auto min-h-0">
            {/* Title and category */}
            <div>
              <h4 className="text-[15px] font-bold text-foreground font-serif leading-tight">{point.name}</h4>
              <span
                className="inline-block mt-1.5 px-2.5 py-0.5 text-[11px] rounded text-white font-medium"
                style={{ background: categoryBgColors[point.category] }}
              >
                {categoryLabels[point.category]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="point-meta-chip">
                <MapPin size={12} className="text-gold-dark" />
                <span>{point.city} · {point.district}</span>
              </div>
              <div className="point-meta-chip">
                <CalendarDays size={12} className="text-gold-dark" />
                <span>{point.period}</span>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-md overflow-hidden aspect-[16/10] bg-muted shadow-sm border border-gold/10">
              <img
                src={point.coverImage}
                alt={point.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>

            {/* Summary */}
            <p className="text-xs leading-[1.8] text-foreground/80">{point.summary}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {point.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] bg-parchment border border-gold/15 rounded text-earth hover:border-gold/30 hover:bg-gold/5 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons - circular gold icon style matching reference */}
          <div className="flex items-center justify-center gap-6 py-3.5 border-t border-gold/10 flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(255,253,248,0.88), rgba(139,105,20,0.05))' }}>
            <button
              onClick={() => toast('查看详情', { description: '功能即将上线' })}
              className="flex flex-col items-center gap-1.5 group point-action-button"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95" style={{ background: 'linear-gradient(135deg, #a8872e 0%, #8B6914 100%)', boxShadow: '0 2px 8px rgba(139,105,20,0.3)' }}>
                <FileText size={18} className="text-white" />
              </div>
              <span className="text-[11px] text-earth font-medium">查看详情</span>
            </button>
            <button
              onClick={() => toast('路线规划', { description: '功能即将上线' })}
              className="flex flex-col items-center gap-1.5 group point-action-button"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95" style={{ background: 'linear-gradient(135deg, #a8872e 0%, #8B6914 100%)', boxShadow: '0 2px 8px rgba(139,105,20,0.3)' }}>
                <Route size={18} className="text-white" />
              </div>
              <span className="text-[11px] text-earth font-medium">路线规划</span>
            </button>
            <button
              onClick={() => toast('一键分享', { description: '功能即将上线' })}
              className="flex flex-col items-center gap-1.5 group point-action-button"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95" style={{ background: 'linear-gradient(135deg, #a8872e 0%, #8B6914 100%)', boxShadow: '0 2px 8px rgba(139,105,20,0.3)' }}>
                <Share2 size={18} className="text-white" />
              </div>
              <span className="text-[11px] text-earth font-medium">一键分享</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
