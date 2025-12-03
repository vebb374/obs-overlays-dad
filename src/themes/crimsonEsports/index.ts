import type { Theme } from '../../types/theme';

export const crimsonEsports: Theme = {
  id: 'crimson-esports',
  name: 'Crimson Esports',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#ffffff',
    accent: '#dc2626', // Red
    secondary: '#1f2937',
    border: '#7f1d1d',
    surface: '#000000',
    positive: '#22c55e',
    negative: '#ef4444',
  },
  fontFamily: 'Impact, Haettenschweiler, sans-serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        exit: { 
          opacity: 0, 
          transition: { 
            staggerChildren: 0.03,
            staggerDirection: -1,
            when: "afterChildren"
          } 
        }
      },
      item: {
        hidden: { opacity: 0, scale: 1.5 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { type: 'spring', stiffness: 500, damping: 30 }
        },
        exit: { opacity: 0, scale: 1.5, transition: { duration: 0.15 } }
      }
    }
  }
};

