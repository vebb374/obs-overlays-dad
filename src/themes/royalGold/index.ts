import type { Theme } from '../../types/theme';

export const royalGold: Theme = {
  id: 'royal-gold',
  name: 'Royal Gold',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#faf5ff',
    accent: '#fbbf24', // Gold
    secondary: '#581c87', // Deep Purple
    border: '#7e22ce',
    surface: '#3b0764',
    positive: '#4ade80',
    negative: '#f87171',
  },
  fontFamily: '"Playfair Display", serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        exit: { 
          opacity: 0, 
          transition: { 
            staggerChildren: 0.1,
            staggerDirection: -1,
            when: "afterChildren"
          } 
        }
      },
      item: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'circOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'circIn' } }
      }
    }
  }
};

