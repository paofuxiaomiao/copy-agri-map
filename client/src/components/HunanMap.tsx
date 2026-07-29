import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CulturePoint } from '@/data/points';
import { hunanBoundary } from '@/data/hunan-boundary';
import { Plus, Minus, Locate, SlidersHorizontal } from 'lucide-react';

interface HunanMapProps {
  points: CulturePoint[];
  selectedPoint: CulturePoint | null;
  focusRequest: { pointId: string; nonce: number } | null;
  onPointSelect: (point: CulturePoint) => void;
  visibleLayers: { ancient: boolean; modern: boolean; red: boolean };
  layerPanelOpen: boolean;
  onLayerPanelOpen: () => void;
}

// Tuned so the whole province sits visually centred in the map viewport
// (accounting for the header bar and the side panels overlaying the map).
const HUNAN_CENTER: [number, number] = [28.0, 111.2];
const HUNAN_ZOOM = 7.5;
const FOCUS_ZOOM = 10.75;

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

/** Clamp a lat/lng into the max-bounds box (with a small inset) so flyTo is never fought by viscosity. */
function clampToBounds(lat: number, lng: number): [number, number] {
  const inset = 0.05;
  const clampedLat = Math.min(Math.max(lat, HUNAN_BOUNDS[0][0] + inset), HUNAN_BOUNDS[1][0] - inset);
  const clampedLng = Math.min(Math.max(lng, HUNAN_BOUNDS[0][1] + inset), HUNAN_BOUNDS[1][1] - inset);
  return [clampedLat, clampedLng];
}

function getFocusTarget(map: L.Map, point: CulturePoint, zoom: number): [number, number] {
  const [lat, lng] = clampToBounds(point.latitude, point.longitude);
  const markerPoint = map.project([lat, lng], zoom);
  const mapSize = map.getSize();
  const compactLandscape = mapSize.x < 1024 && mapSize.x > mapSize.y * 1.35;
  const focusOffset = compactLandscape
    ? L.point(130, 0)
    : mapSize.x < 1024
      ? L.point(0, Math.min(220, mapSize.y * 0.3))
      : L.point(72, 0);
  const rawCenter = map.unproject(markerPoint.add(focusOffset), zoom);
  return clampToBounds(rawCenter.lat, rawCenter.lng);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character] ?? character);
}

function buildMarkerHtml(point: CulturePoint) {
  const color = categoryColors[point.category];
  const featuredClass = point.heritageLevel ? ' culture-marker--featured' : '';
  return `
    <div
      class="culture-marker culture-marker--${point.category}${featuredClass}"
      style="--marker-color: ${color};"
    >
      <div class="culture-marker__halo"></div>
      <div class="culture-marker__core"></div>
      <span class="culture-marker__label" aria-hidden="true">${escapeHtml(point.name)}</span>
    </div>
  `;
}

function buildIcon(point: CulturePoint) {
  const hitSize = 22;
  return L.divIcon({
    className: 'custom-marker',
    html: buildMarkerHtml(point),
    // Leaflet owns the outer element's transform. Selection and hover effects
    // only touch the inner visual layers, so map movement stays stable.
    iconSize: [hitSize, hitSize],
    iconAnchor: [hitSize / 2, hitSize / 2],
  });
}

/** Mini-map: project the real Hunan boundary GeoJSON into an SVG path. */
const MINI_W = 120;
const MINI_H = 110;
const MINI_PAD = 8;

function useMiniMapGeometry() {
  return useMemo(() => {
    try {
      const coords = (hunanBoundary as any).features[0].geometry.coordinates as number[][][][];
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      coords.forEach(polygon => polygon.forEach(ring => ring.forEach(([lng, lat]) => {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      })));
      const spanLng = maxLng - minLng;
      const spanLat = maxLat - minLat;
      const scale = Math.min((MINI_W - MINI_PAD * 2) / spanLng, (MINI_H - MINI_PAD * 2) / spanLat);
      const offsetX = (MINI_W - spanLng * scale) / 2;
      const offsetY = (MINI_H - spanLat * scale) / 2;
      const toXY = (lng: number, lat: number): [number, number] => [
        offsetX + (lng - minLng) * scale,
        offsetY + (maxLat - lat) * scale,
      ];
      let path = '';
      coords.forEach(polygon => polygon.forEach(ring => {
        // Sample every other point to keep the path light-weight
        ring.forEach(([lng, lat], i) => {
          if (i % 2 !== 0 && i !== ring.length - 1) return;
          const [x, y] = toXY(lng, lat);
          path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
        });
        path += 'Z';
      }));
      return { path, toXY };
    } catch {
      return { path: '', toXY: (_lng: number, _lat: number) => [0, 0] as [number, number] };
    }
  }, []);
}

export default function HunanMap({
  points,
  selectedPoint,
  focusRequest,
  onPointSelect,
  visibleLayers,
  layerPanelOpen,
  onLayerPanelOpen,
}: HunanMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const markerIndexRef = useRef<Map<string, L.Marker>>(new Map());
  const lastFocusNonceRef = useRef<number>(0);
  const focusFrameRef = useRef<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [viewVersion, setViewVersion] = useState(0);

  // Stable callback ref
  const onPointSelectRef = useRef(onPointSelect);
  onPointSelectRef.current = onPointSelect;
  const selectedPointRef = useRef(selectedPoint);
  selectedPointRef.current = selectedPoint;

  const mini = useMiniMapGeometry();

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
      // Fractional zoom keeps flyTo targets exact instead of snapping to integers,
      // which previously made the fly-to animation land on the wrong offset.
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      maxBounds: L.latLngBounds(HUNAN_BOUNDS),
      maxBoundsViscosity: 0.8,
      // Smoother wheel zoom
      wheelDebounceTime: 30,
      wheelPxPerZoomLevel: 90,
      // Tile opacity transitions can flash while flyTo changes zoom levels.
      fadeAnimation: false,
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

    // Add Hunan province boundary with outside mask
    try {
      const worldBounds: [number, number][] = [
        [-90, -180], [-90, 180], [90, 180], [90, -180], [-90, -180]
      ];
      const hunanCoords = (hunanBoundary as any).features[0].geometry.coordinates;
      const hunanRings: [number, number][][] = [];
      hunanCoords.forEach((polygon: number[][][]) => {
        polygon.forEach((ring: number[][]) => {
          hunanRings.push(ring.map((coord: number[]) => [coord[1], coord[0]] as [number, number]));
        });
      });
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

    // The mini-map only needs the final viewport. Re-rendering React on every
    // Leaflet animation frame made the overlay compete with flyTo.
    const bumpView = () => setViewVersion(v => v + 1);
    map.on('moveend zoomend', bumpView);

    // Ensure the container is measured before any fly/positioning happens.
    const readyFrame = requestAnimationFrame(() => {
      map.invalidateSize();
      setMapReady(true);
    });

    let resizeFrame: number | null = null;
    let lastObservedWidth = mapContainerRef.current.clientWidth;
    let lastObservedHeight = mapContainerRef.current.clientHeight;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      if (nextWidth === lastObservedWidth && nextHeight === lastObservedHeight) return;
      lastObservedWidth = nextWidth;
      lastObservedHeight = nextHeight;
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        map.invalidateSize({ pan: false });
        const currentPoint = selectedPointRef.current;
        if (!currentPoint) return;
        const zoom = map.getZoom();
        map.setView(getFocusTarget(map, currentPoint, zoom), zoom, { animate: false });
      });
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      cancelAnimationFrame(readyFrame);
      resizeObserver.disconnect();
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
      }
      map.off('moveend zoomend', bumpView);
      map.remove();
      mapRef.current = null;
      markerIndexRef.current.clear();
    };
  }, []);

  // Build markers only when the point list changes (not on selection),
  // so selecting a point no longer rebuilds every marker mid-animation.
  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group || !mapReady) return;

    group.clearLayers();
    markerIndexRef.current.clear();

    points.forEach((point) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: buildIcon(point),
        title: point.name,
        alt: point.name,
        keyboard: true,
        riseOnHover: true,
        riseOffset: 500,
      });

      marker.on('click', (event) => {
        L.DomEvent.stopPropagation(event);
        onPointSelectRef.current(point);
      });

      group.addLayer(marker);
      const element = marker.getElement();
      if (element) element.dataset.pointId = point.id;
      markerIndexRef.current.set(point.id, marker);
    });
  }, [points, mapReady]);

  // Derive selection from one id without replacing marker DOM or rebinding
  // tooltips. Featured labels live inside the stable icon and remain visible.
  useEffect(() => {
    if (!mapReady) return;
    const index = markerIndexRef.current;
    const selectedId = selectedPoint?.id ?? null;

    points.forEach((point) => {
      const marker = index.get(point.id);
      if (!marker) return;

      const isSelected = point.id === selectedId;
      marker.setZIndexOffset(isSelected ? 1000 : 0);
      const element = marker.getElement();
      if (!element) return;
      element.dataset.pointId = point.id;
      element.classList.toggle('is-selected', isSelected);
      element.setAttribute('aria-current', isSelected ? 'location' : 'false');
    });
  }, [selectedPoint, points, mapReady]);

  // Fly on every explicit focus request, including repeated and rapid clicks.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !focusRequest) return;
    if (focusRequest.nonce === lastFocusNonceRef.current) return;
    lastFocusNonceRef.current = focusRequest.nonce;

    const point = points.find(item => item.id === focusRequest.pointId);
    if (!point) return;

    map.stop();
    if (focusFrameRef.current !== null) {
      cancelAnimationFrame(focusFrameRef.current);
    }

    // Wait one frame so rapid clicks collapse to the latest focus request.
    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      if (!mapRef.current || lastFocusNonceRef.current !== focusRequest.nonce) return;
      // Desktop detail sits on the right; compact detail is a bottom sheet.
      // Offset the map in the corresponding direction to keep the marker clear.
      const target = getFocusTarget(map, point, FOCUS_ZOOM);
      map.flyTo(target, FOCUS_ZOOM, { duration: 0.9, easeLinearity: 0.2 });
    });

    return () => {
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
      }
    };
  }, [focusRequest, mapReady, points]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => {
    mapRef.current?.flyTo(HUNAN_CENTER, HUNAN_ZOOM, { duration: 0.6 });
  };

  // Mini-map derived geometry: viewport rectangle + selected point dot
  const miniViewport = (() => {
    const map = mapRef.current;
    if (!map || !mapReady) return null;
    void viewVersion; // subscribe to view changes
    try {
      const b = map.getBounds();
      const [x1, y1] = mini.toXY(b.getWest(), b.getNorth());
      const [x2, y2] = mini.toXY(b.getEast(), b.getSouth());
      return { x: x1, y: y1, w: Math.max(4, x2 - x1), h: Math.max(4, y2 - y1) };
    } catch {
      return null;
    }
  })();

  const miniSelected = selectedPoint
    ? mini.toXY(selectedPoint.longitude, selectedPoint.latitude)
    : null;

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {/* Parchment vignette overlay */}
      <div className="map-parchment-overlay" />

      {/* A single tool rail owns this anchor, so controls cannot collide with the filter panel. */}
      {!layerPanelOpen && (
        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 z-[400] flex flex-row lg:flex-col map-control-group animate-in fade-in zoom-in-95 duration-200">
          <button onClick={handleZoomIn} className="map-control-btn" title="放大" aria-label="放大">
            <Plus size={16} />
          </button>
          <div className="map-control-divider" />
          <button onClick={handleZoomOut} className="map-control-btn" title="缩小" aria-label="缩小">
            <Minus size={16} />
          </button>
          <div className="map-control-divider" />
          <button onClick={handleReset} className="map-control-btn" title="回到全省视图" aria-label="回到全省视图">
            <Locate size={16} />
          </button>
          <div className="map-control-divider" />
          <button onClick={onLayerPanelOpen} className="map-control-btn" title="图层筛选" aria-label="打开图层筛选">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      )}

      {/* The scale shares the same left dock and follows its visibility. */}
      {!layerPanelOpen && (
        <div className="hidden sm:flex absolute bottom-4 left-4 z-[400] items-end gap-0.5 text-xs text-earth/80 bg-white/75 backdrop-blur-[2px] px-2 py-1 rounded border border-gold/10 shadow-sm">
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
      )}

      {/* Mini map / overview inset with real Hunan outline */}
      <div className="hidden md:block absolute bottom-4 right-5 z-[400] mini-map-panel">
        <svg viewBox={`0 0 ${MINI_W} ${MINI_H}`} className="w-full h-full block">
          <defs>
            <linearGradient id="miniHunanFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f1e3" />
              <stop offset="100%" stopColor="#ecdfc2" />
            </linearGradient>
          </defs>
          {mini.path && (
            <path
              d={mini.path}
              fill="url(#miniHunanFill)"
              stroke="#8B6914"
              strokeWidth="1.2"
              strokeLinejoin="round"
              opacity="0.92"
            />
          )}
          {/* Current viewport rectangle */}
          {miniViewport && (
            <rect
              x={miniViewport.x}
              y={miniViewport.y}
              width={miniViewport.w}
              height={miniViewport.h}
              fill="rgba(139,105,20,0.10)"
              stroke="#8B6914"
              strokeWidth="1"
              strokeDasharray="3,2"
              rx="1.5"
            />
          )}
          {/* Selected point dot */}
          {miniSelected && (
            <g>
              <circle cx={miniSelected[0]} cy={miniSelected[1]} r="4.5" fill="#C41E3A" opacity="0.22">
                <animate attributeName="r" values="3;6;3" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={miniSelected[0]} cy={miniSelected[1]} r="2.4" fill="#C41E3A" stroke="#fff" strokeWidth="1" />
            </g>
          )}
        </svg>
        <div className="mini-map-label">湖南省</div>
      </div>
    </div>
  );
}
