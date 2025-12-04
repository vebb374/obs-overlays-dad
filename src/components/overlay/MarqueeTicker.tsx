import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../../state/useOverlayStore';
import { useTimedVisibility } from '../../hooks/useTimedVisibility';
import { useMarqueeVelocity } from '../../hooks/useMarqueeVelocity';

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

  const scrollDurationSeconds = useMarqueeVelocity(contentWidth, speed, legacyDuration);

  const isVisible = useTimedVisibility({
    duration: onscreenDuration ?? (scrollDurationSeconds * 1000),
    offscreenDuration,
    loop
  });

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
