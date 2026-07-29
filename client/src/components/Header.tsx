import { CalendarDays, History, Landmark, MapPinned, Route, Search, Share2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/lib/assets';

interface HeaderProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onSearch: (query: string) => void;
}

const navItems = [
  { id: 'map', label: '地图', desktopLabel: '地图浏览', icon: MapPinned },
  { id: 'routes', label: '线路', desktopLabel: '主题线路', icon: Route },
  { id: 'timeline', label: '脉络', desktopLabel: '发展脉络', icon: History },
  { id: 'artifacts', label: '文物', desktopLabel: '重要文物', icon: Landmark },
  { id: 'solar', label: '节气', desktopLabel: '节气日历', icon: CalendarDays },
];

export default function Header({ activeNav, onNavChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top navigation - museum atlas header */}
      <div className="border-b border-gold/15" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f6f1e8 100%)' }}>
        <div className="mobile-safe-top flex min-w-0 items-center justify-between gap-2 px-3 sm:px-5 h-[54px] lg:h-[56px]">
          {/* Brand area - seal + literary title */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 relative logo-stamp-shell">
              {logoFailed ? (
                <span className="logo-stamp-fallback">农<br />耕</span>
              ) : (
                <img
                  src={assetUrl('/manus-storage/logo-stamp.webp')}
                  alt="农耕文明"
                  className="w-full h-full object-contain drop-shadow-sm"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </div>
            <div className="min-w-0 border-l border-gold/20 pl-2.5 sm:pl-3.5">
              <h1 className="truncate whitespace-nowrap text-[14px] sm:text-[17px] font-bold font-serif tracking-[0.06em] sm:tracking-[0.15em] leading-tight" style={{ color: '#3d2e0a' }}>
                湖南省农耕文化地图
              </h1>
              <p className="hidden sm:block truncate whitespace-nowrap text-[11px] tracking-[0.08em] mt-0.5" style={{ color: '#8a7a5a' }}>
                小小一幅地图，展开湖湘万年农耕文明
              </p>
            </div>
          </div>

          {/* Navigation - refined literary tabs */}
          <nav className="hidden lg:flex items-center gap-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={`px-5 py-2 text-[13px] font-medium font-serif tracking-wide transition-all duration-250 relative ${
                  activeNav === item.id
                    ? 'text-[#3d2e0a]'
                    : 'text-[#8a7a5a] hover:text-[#5c4a1e]'
                }`}
              >
                {item.desktopLabel}
                {activeNav === item.id && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full" style={{ background: '#8B6914' }} />
                )}
              </button>
            ))}
          </nav>

          {/* Search and share - archival controls */}
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索点位、遗址、主题..."
                  className="w-48 h-8 pl-3 pr-8 text-xs bg-white/60 border border-gold/15 rounded focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 placeholder:text-[#b0a080] font-serif"
                  style={{ borderRadius: '3px' }}
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b0a080] hover:text-gold-dark transition-colors">
                  <Search size={14} />
                </button>
              </div>
            </form>
            <button
              aria-label="分享"
              className="flex w-10 h-10 lg:w-auto lg:h-auto items-center justify-center gap-1.5 px-2.5 sm:px-3.5 lg:py-1.5 text-xs font-medium font-serif border rounded hover:shadow-sm transition-all duration-200 active:scale-97"
              style={{ color: '#5c4a1e', borderColor: 'rgba(139,105,20,0.25)', borderRadius: '3px' }}
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">分享</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact navigation - large touch targets, always available below desktop */}
      <nav
        className="lg:hidden grid grid-cols-5 h-[44px] border-b border-gold/10 px-1"
        style={{ background: 'rgba(255,253,248,0.94)', backdropFilter: 'blur(12px)' }}
        aria-label="移动端主导航"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-md font-serif transition-colors ${
                isActive ? 'text-[#5c4310]' : 'text-[#8a7a5a]'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.6} />
              <span className="text-[10px] leading-none">{item.label}</span>
              {isActive && <span className="absolute bottom-0.5 h-0.5 w-5 rounded-full bg-[#8B6914]" />}
            </button>
          );
        })}
      </nav>

      {/* Stats bar - catalogue index feel */}
      <div className="hidden lg:block border-b border-gold/10" style={{ background: 'rgba(255,253,248,0.88)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-6 lg:gap-10 px-3 sm:px-6 h-[34px]">
          <StatItem icon={<PinIcon />} label="文化点位" value={128} unit="处" />
          <StatItem icon={<RouteIcon />} label="主题线路" value={3} unit="条" />
          <StatItem icon={<ArtifactIcon />} label="重要文物" value={24} unit="件" />
          <StatItem icon={<LeafIcon />} label="二十四节气" value={24} unit="个" />
        </div>
      </div>
    </header>
  );
}

function StatItem({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: number; unit: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1 sm:gap-1.5 text-xs" aria-label={`${label} ${value}${unit}`}>
      <span className="opacity-80">{icon}</span>
      <span className="hidden sm:inline text-[#8a7a5a] font-serif">{label}</span>
      <span className="font-bold tabular-nums text-[13px]" style={{ color: '#5c4a1e' }}>{value}</span>
      <span className="hidden sm:inline text-[#8a7a5a]">{unit}</span>
    </div>
  );
}

// Custom SVG icons - cultural motif style
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5.5" r="3" stroke="#C41E3A" strokeWidth="1.3" fill="#C41E3A" fillOpacity="0.15"/>
      <path d="M7 8.5v3" stroke="#C41E3A" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 11c2-3 6-5 8-8" stroke="#4A7C59" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="3" cy="11" r="1.5" fill="#4A7C59" fillOpacity="0.3" stroke="#4A7C59" strokeWidth="0.8"/>
      <circle cx="11" cy="3" r="1.5" fill="#4A7C59" fillOpacity="0.3" stroke="#4A7C59" strokeWidth="0.8"/>
    </svg>
  );
}

function ArtifactIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 12h6M5 12V8c0-1 .5-2 2-2s2 1 2 2v4M4 4c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5c0 1-1 1.5-3 1.5S4 5 4 4z" stroke="#8B6914" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 12V6M4 8c0-3 1.5-5 3-6 1.5 1 3 3 3 6-1.5 1-4.5 1-6 0z" stroke="#4A7C59" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="#4A7C59" fillOpacity="0.1"/>
    </svg>
  );
}
