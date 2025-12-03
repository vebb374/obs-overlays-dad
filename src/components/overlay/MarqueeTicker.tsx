import React from 'react';
import { motion } from 'framer-motion';
import type { Theme } from '../../state/useOverlayStore';

interface MarqueeTickerProps {
  text: string;
  speed?: number; // arbitrary speed unit
  separator?: string;
  fontFamily?: string;
  theme: Theme;
  width: number;
  height: number;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ 
  text, 
  speed = 50, 
  separator = ' • ', 
  fontFamily,
  theme,
  height 
}) => {
  const content = `${text}${separator}`;
  
  // Calculate duration based on speed. 
  // Higher speed = lower duration.
  // Base duration for speed 50 is 20s.
  const duration = 1000 / Math.max(speed, 1);

  return (
    <div 
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
         {/* Using a key on motion.div forces a re-mount when duration changes, 
             which is needed because framer-motion doesn't dynamically update duration well during an infinite loop */}
        <motion.div
          key={duration} 
          className="flex whitespace-nowrap"
          style={{ willChange: 'transform' }}
          animate={{ x: "-50%" }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: duration
          }}
        >
          {/* Render enough copies to cover wide screens and allow smooth looping */}
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="mx-4 font-medium tracking-wide flex items-center">
              {content}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
