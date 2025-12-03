import type { Theme } from '../../types/theme';

export const broadcastSports: Theme = {
  id: 'broadcast-sports',
  name: 'Broadcast Sports',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#ffffff',
    accent: '#ea580c', // Orange
    secondary: '#0f172a',
    border: '#ffffff', // High contrast white border
    surface: '#1e293b',
    positive: '#84cc16',
    negative: '#ef4444',
  },
  fontFamily: 'Oswald, sans-serif',
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
        hidden: { opacity: 0, x: 200 },
        visible: { opacity: 1, x: 0, transition: { type: 'tween', ease: 'backOut' } },
        exit: { opacity: 0, x: 200, transition: { duration: 0.15, ease: 'backIn' } }
      }
    }
  }
};

