import type { Theme } from '../../types/theme';

export const cleanLight: Theme = {
  id: 'clean-light',
  name: 'Clean Light',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#111827',
    accent: '#2563eb', // Blue
    secondary: '#4b5563',
    border: '#e5e7eb',
    surface: '#ffffff',
    positive: '#059669',
    negative: '#dc2626',
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
          y: 20, 
          transition: { duration: 0.3 } 
        }
      },
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } }
      }
    }
  }
};

