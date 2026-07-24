import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface LayerPanelProps {
  visibleLayers: { ancient: boolean; modern: boolean; red: boolean };
  onLayerToggle: (layer: 'ancient' | 'modern' | 'red') => void;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function LayerPanel({ visibleLayers, onLayerToggle, onSearch, onClear }: LayerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-4 left-14 z-[1001] w-9 h-9 flex items-center justify-center glass-panel rounded hover:bg-gold/10 transition-colors"
      >
        <ChevronRight size={16} className="text-gold-dark" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-14 z-[1001] max-h-[calc(100%-2rem)] w-[258px] glass-panel rounded-lg overflow-x-hidden overflow-y-auto animate-in slide-in-from-left-4 duration-300">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gold/10">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-gold-dark">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <h3 className="text-[13px] font-semibold font-serif tracking-wide" style={{ color: '#3d2e0a' }}>图层筛选</h3>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gold/10 transition-colors active:scale-95"
        >
          <ChevronLeft size={14} className="text-[#8a7a5a]" />
        </button>
      </div>

      {/* Layer controls */}
      <div className="px-4 py-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground mb-2">图层控制</p>
        <LayerToggle
          color="#8B6914"
          label="古代农耕遗址"
          checked={visibleLayers.ancient}
          onChange={() => onLayerToggle('ancient')}
        />
        <LayerToggle
          color="#4A7C59"
          label="现代农耕地标"
          checked={visibleLayers.modern}
          onChange={() => onLayerToggle('modern')}
        />
        <LayerToggle
          color="#C41E3A"
          label="红色农耕旧址"
          checked={visibleLayers.red}
          onChange={() => onLayerToggle('red')}
        />
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-t border-gold/10">
        <p className="text-xs font-medium text-muted-foreground mb-2">点位搜索</p>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索点位名称..."
            className="w-full h-8 pl-3 pr-8 text-xs bg-white/60 border border-gold/15 rounded-md focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/15 placeholder:text-muted-foreground/50"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Search size={13} className="text-muted-foreground" />
          </button>
        </form>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gold/10">
        <p className="text-xs font-medium text-muted-foreground mb-2">图例说明</p>
        <div className="space-y-1.5">
          <LegendItem color="#8B6914" label="古代农耕遗址" period="远古—清代" />
          <LegendItem color="#4A7C59" label="现代农耕地标" period="近现代—至今" />
          <LegendItem color="#C41E3A" label="红色农耕旧址" period="革命时期" />
        </div>
      </div>

      {/* Clear button */}
      <div className="px-4 py-3 border-t border-gold/10">
        <button
          onClick={() => { onClear(); setSearchQuery(''); }}
          className="w-full flex items-center justify-center gap-1.5 h-8 text-xs text-muted-foreground border border-gold/15 rounded-md hover:bg-gold/5 hover:text-gold-dark transition-colors"
        >
          <Trash2 size={12} />
          清空筛选
        </button>
      </div>
    </div>
  );
}

function LayerToggle({ color, label, checked, onChange }: { color: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ background: color }} />
        <span className="text-xs text-foreground">{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="scale-75" />
    </div>
  );
}

function LegendItem({ color, label, period }: { color: string; label: string; period: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-foreground/80">{label}</span>
      <span className="text-xs text-muted-foreground">（{period}）</span>
    </div>
  );
}
