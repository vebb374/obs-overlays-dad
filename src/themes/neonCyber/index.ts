import type { Theme } from '../../types/theme';

export const neonCyber: Theme = {
  id: 'neon-cyber',
  name: 'Neon Cyber',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#e0f2fe',
    accent: '#0ea5e9', // Cyan
    secondary: '#94a3b8',
    border: '#1e293b',
    surface: '#0f172a',
    positive: '#22d3ee',
    negative: '#f43f5e',
  },
  fontFamily: '"Courier New", monospace',
  animations: {
    journal: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 }
        },
        exit: { 
          opacity: 0, 
          scale: 0.8, 
          filter: 'blur(10px)', 
          transition: { 
            staggerChildren: 0.03, 
            staggerDirection: -1,
            when: "afterChildren",
            duration: 0.3
          } 
        }
      },
      item: {
        hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        visible: { 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 200 } 
        },
        exit: { 
          opacity: 0, 
          scale: 0.8, 
          filter: 'blur(10px)', 
          transition: { duration: 0.15 } 
        }
      }
    }
  }
};

