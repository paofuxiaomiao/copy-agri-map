import { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import HunanMap from '@/components/HunanMap';
import LayerPanel from '@/components/LayerPanel';
import PointDetail from '@/components/PointDetail';
import BottomModules from '@/components/BottomModules';
import Footer from '@/components/Footer';
import { culturePoints, CulturePoint } from '@/data/points';
import { toast } from 'sonner';
import ArtifactsPage from './ArtifactsPage';
import TimelinePage from './TimelinePage';
import RoutesPage from './RoutesPage';
import SolarTermsPage from './SolarTermsPage';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [activeNav, setActiveNav] = useState('map');
  const [selectedPoint, setSelectedPoint] = useState<CulturePoint | null>(culturePoints[0]);
  const [focusRequest, setFocusRequest] = useState<{ pointId: string; nonce: number } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    ancient: true,
    modern: true,
    red: true,
  });

  const filteredPoints = useMemo(() => {
    return culturePoints.filter(p => visibleLayers[p.category]);
  }, [visibleLayers]);

  const handleLayerToggle = useCallback((layer: 'ancient' | 'modern' | 'red') => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const focusPoint = useCallback((point: CulturePoint) => {
    setSelectedPoint(point);
    setFocusRequest(prev => ({ pointId: point.id, nonce: (prev?.nonce ?? 0) + 1 }));
  }, []);

  const handlePointSelect = useCallback((point: CulturePoint) => {
    focusPoint(point);
  }, [focusPoint]);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    const found = culturePoints.find(p =>
      p.name.includes(query) || p.tags.some(t => t.includes(query))
    );
    if (found) {
      setVisibleLayers(prev => ({ ...prev, [found.category]: true }));
      setActiveNav('map');
      focusPoint(found);
    } else {
      toast('未找到匹配的点位', { description: '请尝试其他关键词' });
    }
  }, [focusPoint]);

  const handleClear = useCallback(() => {
    setVisibleLayers({ ancient: true, modern: true, red: true });
    setSelectedPoint(null);
  }, []);

  const handlePrevPoint = useCallback(() => {
    if (!selectedPoint) return;
    const currentIndex = filteredPoints.findIndex(p => p.id === selectedPoint.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPoints.length - 1;
    focusPoint(filteredPoints[prevIndex]);
  }, [selectedPoint, filteredPoints, focusPoint]);

  const handleNextPoint = useCallback(() => {
    if (!selectedPoint) return;
    const currentIndex = filteredPoints.findIndex(p => p.id === selectedPoint.id);
    const nextIndex = currentIndex < filteredPoints.length - 1 ? currentIndex + 1 : 0;
    focusPoint(filteredPoints[nextIndex]);
  }, [selectedPoint, filteredPoints, focusPoint]);

  const handleNavChange = useCallback((nav: string) => {
    setActiveNav(nav);
  }, []);

  const handleBackToMap = useCallback(() => {
    setActiveNav('map');
  }, []);

  const handleBottomPointSelect = useCallback((pointId: string) => {
    const point = culturePoints.find(p => p.id === pointId);
    if (point) {
      setVisibleLayers(prev => ({ ...prev, [point.category]: true }));
      setActiveNav('map');
      focusPoint(point);
    }
  }, [focusPoint]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onSearch={handleSearch}
      />

      <AnimatePresence mode="wait">
        {activeNav === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {/* Main map area */}
            <main className="relative flex-1 min-h-0 overflow-hidden">
              <HunanMap
                points={filteredPoints}
                selectedPoint={selectedPoint}
                focusRequest={focusRequest}
                onPointSelect={handlePointSelect}
                visibleLayers={visibleLayers}
              />

              <LayerPanel
                visibleLayers={visibleLayers}
                onLayerToggle={handleLayerToggle}
                onSearch={handleSearch}
                onClear={handleClear}
              />

              <PointDetail
                point={selectedPoint}
                onClose={() => setSelectedPoint(null)}
                onPrev={handlePrevPoint}
                onNext={handleNextPoint}
              />
            </main>

            {/* Bottom content modules */}
            <BottomModules onNavigate={handleNavChange} onPointSelect={handleBottomPointSelect} />

            {/* Footer */}
            <Footer />
          </motion.div>
        )}

        {activeNav === 'artifacts' && (
          <motion.div
            key="artifacts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <ArtifactsPage onBack={handleBackToMap} />
          </motion.div>
        )}

        {activeNav === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <TimelinePage onBack={handleBackToMap} />
          </motion.div>
        )}

        {activeNav === 'routes' && (
          <motion.div
            key="routes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <RoutesPage onBack={handleBackToMap} />
          </motion.div>
        )}

        {activeNav === 'solar' && (
          <motion.div
            key="solar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-y-auto"
          >
            <SolarTermsPage onBack={handleBackToMap} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
