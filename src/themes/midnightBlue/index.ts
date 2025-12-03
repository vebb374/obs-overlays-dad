import type { Theme } from '../../types/theme';

export const midnightBlue: Theme = {
  id: 'midnight-blue',
  name: 'Midnight Blue',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#e2e8f0',
    accent: '#fbbf24', // Amber/Gold
    secondary: '#1e293b',
    border: '#334155',
    surface: '#0f172a',
    positive: '#34d399',
    negative: '#f87171',
  },
  fontFamily: '"Roboto Slab", serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
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
        hidden: { opacity: 0, rotateX: -90 },
        visible: { opacity: 1, rotateX: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, rotateX: -90, transition: { duration: 0.2 } }
      }
    }
  }
};

