import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../../state/useOverlayStore';

interface MarqueeTickerProps {
  text: string;
  speed?: number; // arbitrary speed unit (pixels per second)
  separator?: string;
  fontFamily?: string;
  theme: Theme;
  width: number;
  height: number;
  duration?: number; // Legacy duration in ms
  onscreenDuration?: number; // ms
  offscreenDuration?: number; // ms
  loop?: boolean;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ 
  text, 
  speed = 50, 
  separator = ' • ', 
  fontFamily,
  theme,
  height,
  duration: legacyDuration,
  onscreenDuration,
  offscreenDuration,
  loop = true
}) => {
  const content = `${text}${separator}`;
  
  const [contentWidth, setContentWidth] = useState(0);
  const itemRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (itemRef.current) {
      const style = window.getComputedStyle(itemRef.current);
      const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      setContentWidth(itemRef.current.offsetWidth + margin);
    }
  }, [text, separator, fontFamily, theme.fontFamily]);

  // Determine scroll duration (speed)
  // onscreenDuration should NOT dictate the speed, only how long it stays visible.
  // Speed is determined by 'speed' prop or legacyDuration.
  const scrollDurationSeconds = useMemo(() => {
    if (legacyDuration) return legacyDuration / 1000;

    if (contentWidth > 0) {
      // We scroll 50% of the container.
      // The container has 20 copies. 50% is 10 copies.
      // Distance = 10 * singleItemWidth
      const distance = contentWidth * 10;
      // speed is treated as pixels per second
      return distance / Math.max(speed, 1);
    }

    return 1000 / Math.max(speed, 1);
  }, [legacyDuration, speed, contentWidth]);

  // Lifecycle State
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      // Determine how long to stay visible
      // Use onscreenDuration if available, else scrollDurationSeconds * 1000 (one cycle)
      const stayDuration = onscreenDuration ?? (scrollDurationSeconds * 1000);
      
      if (loop) {
         timer = setTimeout(() => {
            setIsVisible(false);
         }, stayDuration);
      } else {
         // If not looping, do we stay forever or disappear?
         // "only when that is checked loop the animations."
         // Usually means play once and stop (or disappear).
         // Let's assume play once and disappear for "Entrance -> Run -> Exit".
         timer = setTimeout(() => {
            setIsVisible(false);
         }, stayDuration);
      }
    } else {
      // Hidden state
      if (loop) {
        const waitDuration = offscreenDuration ?? 5000; // Default 5s wait
        timer = setTimeout(() => {
          setIsVisible(true);
        }, waitDuration);
      }
      // If not loop, we stay hidden (removed).
    }

    return () => clearTimeout(timer);
  }, [isVisible, loop, onscreenDuration, offscreenDuration, scrollDurationSeconds, theme.id]);


  return (
    <div style={{ width: '100%', height, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div 
            key="marquee-container"
            initial={{ opacity: 0, y: height }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: height }} // "remove the whole marquee widget" - slide down/fade out
            transition={{ duration: 0.5 }}
      className="overflow-hidden flex items-center relative w-full h-full"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderTop: `2px solid ${theme.colors.accent}`,
        color: theme.colors.text,
        fontFamily: fontFamily === 'inherit' ? theme.fontFamily : fontFamily,
        height
      }}
    >
      <div className="flex whitespace-nowrap w-full">
              {/* Using a key on motion.div forces a re-mount when duration changes */}
        <motion.div
                key={`${scrollDurationSeconds}-${theme.id}`} 
          className="flex whitespace-nowrap"
          style={{ willChange: 'transform' }}
          animate={{ x: "-50%" }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
                  duration: scrollDurationSeconds
          }}
        >
          {/* Render enough copies to cover wide screens and allow smooth looping */}
          {Array.from({ length: 20 }).map((_, i) => (
            <span 
              key={i} 
              ref={i === 0 ? itemRef : null}
              className="mx-4 font-medium tracking-wide flex items-center"
            >
              {content}
            </span>
          ))}
        </motion.div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
