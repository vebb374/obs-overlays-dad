import type { Theme } from '../../types/theme';

export const forestGlass: Theme = {
  id: 'forest-glass',
  name: 'Forest Glass',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#ecfdf5',
    accent: '#34d399', // Emerald
    secondary: '#064e3b',
    border: '#059669',
    surface: '#022c22',
    positive: '#6ee7b7',
    negative: '#fca5a5',
  },
  fontFamily: 'Optima, Candara, sans-serif',
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
        hidden: { opacity: 0, x: 50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { type: 'spring', damping: 12 }
        },
        exit: { opacity: 0, x: 50, transition: { duration: 0.15 } }
      }
    }
  }
};

