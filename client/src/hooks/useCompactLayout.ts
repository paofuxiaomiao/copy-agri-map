import { useEffect, useState } from 'react';

export const COMPACT_LAYOUT_QUERY = '(max-width: 1023px)';

export function isCompactViewport() {
  return typeof window !== 'undefined' && window.matchMedia(COMPACT_LAYOUT_QUERY).matches;
}

export function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(isCompactViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_LAYOUT_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsCompact(event.matches);

    setIsCompact(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isCompact;
}
