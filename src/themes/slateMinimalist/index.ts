import type { Theme } from '../../types/theme';

export const slateMinimalist: Theme = {
  id: 'slate-minimalist',
  name: 'Slate Minimalist',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#f8fafc',
    accent: '#94a3b8', // Slate
    secondary: '#334155',
    border: '#475569',
    surface: '#1e293b',
    positive: '#a3e635',
    negative: '#fca5a5',
  },
  fontFamily: 'Helvetica, Arial, sans-serif',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        exit: { 
          opacity: 0, 
          transition: { 
            staggerChildren: 0.04,
            staggerDirection: -1,
            when: "afterChildren"
          } 
        }
      },
      item: {
        hidden: { opacity: 0, scaleY: 0 },
        visible: { opacity: 1, scaleY: 1 },
        exit: { opacity: 0, scaleY: 0, transition: { duration: 0.15 } }
      }
    }
  }
};

