import type { Theme } from '../../types/theme';

export const darkModern: Theme = {
  id: 'dark-modern',
  name: 'Dark Modern',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#ffffff',
    accent: '#8b5cf6', // Violet
    secondary: '#6b7280',
    border: '#374151',
    surface: '#1f2937',
    positive: '#10b981',
    negative: '#ef4444',
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        },
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
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
      }
    }
  }
};

