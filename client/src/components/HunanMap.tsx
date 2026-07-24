import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CulturePoint } from '@/data/points';
import { hunanBoundary } from '@/data/hunan-boundary';
import { Plus, Minus, Locate, Layers } from 'lucide-react';

interface HunanMapProps {
  points: CulturePoint[];
  selectedPoint: CulturePoint | null;
  focusRequest: { pointId: string; nonce: number } | null;
  onPointSelect: (point: CulturePoint) => void;
  visibleLayers: { ancient: boolean; modern: boolean; red: boolean };
}

const HUNAN_CENTER: [number, number] = [27.4, 111.7];
const HUNAN_ZOOM = 7.4;

// Restrict panning to roughly Hunan + small buffer
const HUNAN_BOUNDS: [[number, number], [number, number]] = [
  [24.5, 108.5], // SW corner
  [30.5, 114.5], // NE corner
];

const categoryColors: Record<string, string> = {
  ancient: '#8B6914',
  modern: '#4A7C59',
  red: '#C41E3A',
};

export default function HunanMap({ points, selectedPoint, focusRequest, onPointSelect, visibleLayers }: HunanMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Stable callback ref
  const onPointSelectRef = useRef(onPointSelect);
  onPointSelectRef.current = onPointSelect;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: HUNAN_CENTER,
      zoom: HUNAN_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 7,
      maxZoom: 14,
      maxBounds: L.latLngBounds(HUNAN_BOUNDS),
      maxBoundsViscosity: 0.8,
    });

    // Use Amap (高德地图) vector tiles for cleaner Chinese map
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      maxZoom: 19,
    }).addTo(map);

    // Apply warm sepia filter to tiles
    const tilePane = map.getPane('tilePane');
    if (tilePane) {
      tilePane.style.filter = 'sepia(30%) saturate(70%) brightness(108%) hue-rotate(-5deg) contrast(88%)';
    }

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setMapReady(true);

    // Add Hunan province boundary with outside mask
    try {
      // Create a large rectangle covering the world
      const worldBounds: [number, number][] = [
        [-90, -180], [-90, 180], [90, 180], [90, -180], [-90, -180]
      ];

      // Extract Hunan boundary coordinates (reverse winding for hole)
      const hunanCoords = (hunanBoundary as any).features[0].geometry.coordinates;
      const hunanRings: [number, number][][] = [];
      hunanCoords.forEach((polygon: number[][][]) => {
        polygon.forEach((ring: number[][]) => {
          hunanRings.push(ring.map((coord: number[]) => [coord[1], coord[0]] as [number, number]));
        });
      });

      // Create mask polygon (world minus Hunan = semi-transparent overlay outside Hunan)
      const maskCoords: L.LatLngExpression[][] = [
        worldBounds.map(c => [c[0], c[1]] as [number, number]),
        ...hunanRings
      ];

      L.polygon(maskCoords, {
        fillColor: '#f5f0e8',
        fillOpacity: 0.64,
        stroke: false,
        interactive: false,
      }).addTo(map);

      // Add Hunan border outline
      L.geoJSON(hunanBoundary as any, {
        style: {
          color: '#8B6914',
          weight: 2,
          opacity: 0.5,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '6,3',
        },
        interactive: false,
      }).addTo(map);
    } catch (e) {
      console.warn('Failed to add Hunan boundary:', e);
    }

    // Force a resize after mount to ensure proper rendering
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !mapReady) return;

    markersRef.current.clearLayers();

    points.forEach((point) => {
      const color = categoryColors[point.category];
      const isSelected = selectedPoint?.id === point.id;
      const size = isSelected ? 22 : 12;
      const borderWidth = isSelected ? 3 : 2.5;
      const ringSize = isSelected ? 42 : size;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; width: ${ringSize}px; height: ${ringSize}px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `<div style="
              position: absolute;
              inset: 4px;
              border-radius: 999px;
              background: ${color};
              opacity: 0.28;
              animation: pulse-ring 1.8s ease-out infinite;
            "></div>` : ''}
            <div style="
              position: relative;
              width: ${size}px;
              height: ${size}px;
              background: radial-gradient(circle at 35% 30%, #fff9 0 11%, ${color} 13% 100%);
              border: ${borderWidth}px solid white;
              border-radius: ${isSelected ? '8px' : '50%'};
              box-shadow: 0 2px 8px rgba(44,36,24,0.28)${isSelected ? ', 0 0 0 5px ' + color + '26, 0 8px 18px rgba(44,36,24,0.24)' : ''};
              cursor: pointer;
              transform: ${isSelected ? 'rotate(-4deg)' : 'none'};
            "></div>
          </div>
        `,
        iconSize: [ringSize, ringSize],
        iconAnchor: [ringSize / 2, ringSize / 2],
      });

      const marker = L.marker([point.latitude, point.longitude], { icon });

      // Show permanent tooltip for selected or heritage points with category-colored labels
      const tooltipClass = `marker-label-${point.category}`;
      if (isSelected || point.heritageLevel) {
        marker.bindTooltip(point.name, {
          permanent: true,
          direction: 'top',
          offset: [0, isSelected ? -20 : -12],
          className: tooltipClass,
        });
      }

      marker.on('click', () => {
        onPointSelectRef.current(point);
      });

      marker.on('mouseover', function() {
        if (!isSelected && !point.heritageLevel) {
          marker.bindTooltip(point.name, {
            direction: 'top',
            offset: [0, -10],
            className: tooltipClass,
          }).openTooltip();
        }
      });

      marker.on('mouseout', function() {
        if (!isSelected && !point.heritageLevel) {
          marker.unbindTooltip();
        }
      });

      markersRef.current!.addLayer(marker);
    });
  }, [points, selectedPoint, mapReady]);

  // Fly on every explicit focus request, including repeated clicks and remounts.
  useEffect(() => {
    if (!mapRef.current || !mapReady || !focusRequest) return;
    const point = points.find(item => item.id === focusRequest.pointId);
    if (!point) return;

    const map = mapRef.current;
    const zoom = 10.8;
    map.invalidateSize();
    map.stop();

    // Shift the center slightly east so the marker remains visible beside the detail card.
    const markerPoint = map.project([point.latitude, point.longitude], zoom);
    const visualCenter = map.unproject(markerPoint.add([72, 0]), zoom);
    map.flyTo(visualCenter, zoom, { duration: 0.9, easeLinearity: 0.2 });
  }, [focusRequest, mapReady, points]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => {
    mapRef.current?.flyTo(HUNAN_CENTER, HUNAN_ZOOM, { duration: 0.6 });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {/* Parchment vignette overlay */}
      <div className="map-parchment-overlay" />

      {/* Custom map controls - positioned to not overlap with layer panel */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 flex items-center justify-center bg-white/95 border border-gold/20 rounded-md shadow-sm hover:bg-gold/10 transition-colors active:scale-95"
        >
          <Plus size={16} className="text-gold-dark" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 flex items-center justify-center bg-white/95 border border-gold/20 rounded-md shadow-sm hover:bg-gold/10 transition-colors active:scale-95"
        >
          <Minus size={16} className="text-gold-dark" />
        </button>
        <div className="h-1" />
        <button
          onClick={handleReset}
          className="w-9 h-9 flex items-center justify-center bg-white/95 border border-gold/20 rounded-md shadow-sm hover:bg-gold/10 transition-colors active:scale-95"
        >
          <Locate size={16} className="text-gold-dark" />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center bg-white/95 border border-gold/20 rounded-md shadow-sm hover:bg-gold/10 transition-colors active:scale-95"
        >
          <Layers size={16} className="text-gold-dark" />
        </button>
      </div>

      {/* Scale bar */}
      <div className="absolute bottom-4 left-4 z-[400] flex items-end gap-0.5 text-xs text-earth/80 bg-white/75 px-2 py-1 rounded border border-gold/10 shadow-sm">
        <span>0</span>
        <div className="flex items-center">
          <div className="w-12 h-0.5 bg-earth/60 mx-1" />
          <span>50</span>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-0.5 bg-earth/60 mx-1" />
          <span>100km</span>
        </div>
      </div>

      {/* Mini map / overview inset */}
      <div className="absolute bottom-4 right-5 z-[400] w-28 h-24 bg-white/88 border border-gold/20 rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-1">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Simplified Hunan province outline */}
            <path
              d="M35,15 L50,12 L62,10 L78,14 L88,18 L95,28 L98,38 L100,52 L96,65 L90,75 L82,85 L72,92 L62,98 L50,100 L40,96 L32,88 L25,78 L20,65 L18,52 L20,40 L25,28 L30,20 Z"
              fill="#f5f0e8"
              stroke="#8B6914"
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* City dots */}
            <circle cx="72" cy="35" r="2" fill="#C41E3A" opacity="0.6" />
            <text x="72" y="30" textAnchor="middle" fontSize="5" fill="#333">长沙市</text>
            <circle cx="55" cy="55" r="1.5" fill="#8B6914" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
