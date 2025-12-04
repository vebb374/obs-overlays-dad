import React from 'react';
import type { Theme } from '../../types/theme';

const GoldCoinsBackground = React.lazy(() => import('./GoldCoinsBackground').then(module => ({ default: module.GoldCoinsBackground })));

export const goldCoins: Theme = {
  id: 'gold-coins',
  name: 'Gold Coins Luxury',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#F3E5AB', // Champagne
    accent: '#D4AF37', // Classic Gold
    secondary: '#996515', // Golden Brown
    border: '#996515', // Dark Bronze
    surface: '#0a0a0a', // Near Black
    positive: '#10b981', // Emerald 500
    negative: '#ef4444', // Red 500
  },
  fontFamily: '"Cinzel", serif',
  wrapperComponent: GoldCoinsBackground,
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { 
            staggerChildren: 0.1,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }
        },
        exit: { 
          opacity: 0, 
          scale: 0.95, 
          transition: { duration: 0.3 } 
        }
      },
      item: {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
      }
    }
  }
};
