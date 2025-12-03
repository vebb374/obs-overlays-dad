import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { get, set, del } from 'idb-keyval';

// Custom storage adapter for IndexedDB
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type ComponentType = 'marquee' | 'journal' | 'media';

export interface OverlayComponent {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  props: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    secondary: string;
    border: string;
    surface: string;
    positive: string;
    negative: string;
  };
  fontFamily: string;
}

export const DEFAULT_THEMES: Theme[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
    fontFamily: '"Comic Sans MS", cursive, sans-serif', // Or a retro font if available
  },
  {
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
  },
];

interface OverlayState {
  components: OverlayComponent[];
  activeThemeId: string;
  selectedComponentId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  
  // Actions
  addComponent: (type: ComponentType, name?: string) => string;
  updateComponent: (id: string, updates: Partial<OverlayComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  reorderComponent: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  setTheme: (themeId: string) => void;
  setCanvasSize: (width: number, height: number) => void;
  getActiveTheme: () => Theme;
}

// Initial default components
const INITIAL_COMPONENTS: OverlayComponent[] = [
  {
    id: 'default-marquee',
    type: 'marquee',
    name: 'Disclaimer',
    x: 0,
    y: 1020, // Bottom of 1080p screen
    width: 1920,
    height: 60,
    zIndex: 1,
    props: { 
      text: 'DISCLAIMER: Not financial advice. For educational purposes only.', 
      speed: 50, 
      separator: ' • ',
      fontFamily: 'inherit'
    }
  },
  {
    id: 'default-journal',
    type: 'journal',
    name: 'Weekly Journal',
    x: 50,
    y: 50,
    width: 300,
    height: 400,
    zIndex: 2,
    props: { 
      heading: 'Weekly Journal',
      subHeading: 'Current Week',
      data: [
        { day: 'Mon', profit: 110 },
        { day: 'Tue', profit: 913 },
        { day: 'Wed', profit: 0 },
        { day: 'Thu', profit: 0 },
        { day: 'Fri', profit: 0 },
      ],
      showTotal: true,
      fontFamily: 'inherit'
    }
  }
];

export const useOverlayStore = create<OverlayState>()(
  persist(
    (set, get) => ({
      components: INITIAL_COMPONENTS,
      activeThemeId: 'dark-modern',
      selectedComponentId: null,
      canvasWidth: 1920,
      canvasHeight: 1080,

      addComponent: (type, name) => {
        const id = uuidv4();
        const { canvasWidth, canvasHeight, components } = get();
        
        // Calculate safe offset based on existing components of same type
        const existingCount = components.filter(c => c.type === type).length;
        const offset = existingCount * 20;
        
        const defaultProps: any = { fontFamily: 'inherit' }; // eslint-disable-line @typescript-eslint/no-explicit-any
        
        if (type === 'marquee') {
          Object.assign(defaultProps, {
            text: 'New Marquee Text', 
            speed: 50, 
            separator: ' • '
          });
        } else if (type === 'journal') {
           Object.assign(defaultProps, {
              heading: 'Weekly Journal',
              subHeading: 'Week ' + (existingCount + 1),
              data: [
                { day: 'Mon', profit: 0 },
                { day: 'Tue', profit: 0 },
                { day: 'Wed', profit: 0 },
                { day: 'Thu', profit: 0 },
                { day: 'Fri', profit: 0 },
              ],
              showTotal: true 
            });
        } else if (type === 'media') {
           Object.assign(defaultProps, {
             src: '',
             mediaType: 'image', // image, video, iframe
             objectFit: 'contain'
           });
        }
            
        const defaultSize = type === 'marquee'
            ? { width: 1920, height: 60 }
            : type === 'media' ? { width: 400, height: 300 }
            : { width: 300, height: 400 };
        
        // Position center-ish with offset
        const startX = (canvasWidth / 2 - defaultSize.width / 2) + offset;
        const startY = (canvasHeight / 2 - defaultSize.height / 2) + offset;
        
        // Determine max zIndex
        const maxZ = components.length > 0 ? Math.max(...components.map(c => c.zIndex)) : 0;

        set((state) => ({
          components: [
            ...state.components,
            {
              id,
              type,
              name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${existingCount + 1}`,
              x: startX,
              y: startY,
              zIndex: maxZ + 1,
              ...defaultSize,
              props: defaultProps,
            },
          ],
          selectedComponentId: id,
        }));
        
        return id;
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      removeComponent: (id) => {
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
          selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
        }));
      },

      selectComponent: (id) => set({ selectedComponentId: id }),
      
      reorderComponent: (id, direction) => {
        set((state) => {
           const components = [...state.components].sort((a, b) => a.zIndex - b.zIndex);
           const index = components.findIndex(c => c.id === id);
           if (index === -1) return { components: state.components };
           
           const component = components[index];
           
           if (direction === 'top') {
             // Move to end of array (highest zIndex)
             // Recalculate all zIndices
             const others = components.filter(c => c.id !== id);
             return {
               components: [
                 ...others.map((c, i) => ({ ...c, zIndex: i + 1 })),
                 { ...component, zIndex: others.length + 1 }
               ]
             };
           } else if (direction === 'bottom') {
             // Move to start
             const others = components.filter(c => c.id !== id);
             return {
               components: [
                 { ...component, zIndex: 1 },
                 ...others.map((c, i) => ({ ...c, zIndex: i + 2 }))
               ]
             };
           } else if (direction === 'up') {
             if (index === components.length - 1) return { components: state.components };
             // Swap with next
             const next = components[index + 1];
             components[index + 1] = component;
             components[index] = next;
             // Reassign z-indices
             return {
               components: components.map((c, i) => ({ ...c, zIndex: i + 1 }))
             };
           } else if (direction === 'down') {
             if (index === 0) return { components: state.components };
             // Swap with prev
             const prev = components[index - 1];
             components[index - 1] = component;
             components[index] = prev;
              return {
               components: components.map((c, i) => ({ ...c, zIndex: i + 1 }))
             };
           }
           
           return { components: state.components };
        });
      },

      setTheme: (themeId) => set({ activeThemeId: themeId }),
      
      setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),

      getActiveTheme: () => {
        const { activeThemeId } = get();
        return DEFAULT_THEMES.find(t => t.id === activeThemeId) || DEFAULT_THEMES[0];
      }
    }),
    {
      name: 'trident-overlay-storage',
      partialize: (state) => ({ 
         components: state.components,
         activeThemeId: state.activeThemeId,
         canvasWidth: state.canvasWidth,
         canvasHeight: state.canvasHeight
      }), // Only persist data, not actions
      storage: createJSONStorage(() => storage),
    }
  )
);
