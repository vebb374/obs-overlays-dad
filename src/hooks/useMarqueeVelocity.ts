import { useMemo } from 'react';

export const useMarqueeVelocity = (
  contentWidth: number,
  speed: number, // pixels per second
  legacyDuration?: number // ms
) => {
  return useMemo(() => {
    if (legacyDuration) return legacyDuration / 1000;

    if (contentWidth > 0) {
      // We scroll 50% of the container.
      // The container has 20 copies. 50% is 10 copies.
      // Distance = 10 * singleItemWidth
      const distance = contentWidth * 10;
      return distance / Math.max(speed, 1);
    }

    return 1000 / Math.max(speed, 1);
  }, [legacyDuration, speed, contentWidth]);
};

