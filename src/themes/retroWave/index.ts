import type  { Theme } from '../../types/theme';

export const retroWave: Theme = {
  id: 'retro-wave',
  name: 'Retro Wave',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#fae8ff',
    accent: '#f0abfc', // Fuchsia
    secondary: '#0c4a6e',
    border: '#c026d3',
    surface: '#2e1065',
    positive: '#22d3ee',
    negative: '#f43f5e',
  },
  fontFamily: '"Comic Sans MS", cursive, sans-serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { 
          opacity: 0, 
          transition: { 
            staggerChildren: 0.05,
            staggerDirection: -1,
            when: "afterChildren"
          } 
        }
      },
      item: {
        hidden: { opacity: 0, x: -100, skewX: -20 },
        visible: { opacity: 1, x: 0, skewX: 0, transition: { type: 'spring' } },
        exit: { opacity: 0, x: -100, skewX: -20, transition: { duration: 0.2 } }
      }
    }
  }
};

