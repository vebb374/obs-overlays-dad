import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { get, set, del } from 'idb-keyval';
import type { ComponentType, Theme, MarqueeProps, JournalProps, MediaProps } from '../types/theme';
import { getTheme } from '../themes/index';

// Custom storage adapter for IndexedDB
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type { ComponentType, Theme };

export interface BaseOverlayComponent {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  duration?: number; // Animation loop duration in ms
  loop: boolean ;
}

export interface MarqueeComponent extends BaseOverlayComponent {
  type: 'marquee';
  props: MarqueeProps;
  onscreenDuration?: number; // ms
  offscreenDuration?: number; // ms
}

export interface JournalComponent extends BaseOverlayComponent {
  type: 'journal';
  props: JournalProps;
  onscreenDuration?: number; // ms
  offscreenDuration?: number; // ms
}

export interface MediaComponent extends BaseOverlayComponent {
  type: 'media';
  props: MediaProps;
}

export type OverlayComponent = MarqueeComponent | JournalComponent | MediaComponent;

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
    duration: 20000,
    loop: true,
    onscreenDuration: 20000,
    offscreenDuration: 5000,
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
    duration: 5000,
    loop: true,
    onscreenDuration: 10000,
    offscreenDuration: 5000,
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
        
        let component: OverlayComponent;
        
        const defaultSize = type === 'marquee'
            ? { width: 1920, height: 60 }
            : type === 'media' ? { width: 400, height: 300 }
            : { width: 300, height: 400 };
        
        const defaultDuration = type === 'marquee' ? 20000 : 5000;

        // Position center-ish with offset
        const startX = (canvasWidth / 2 - defaultSize.width / 2) + offset;
        const startY = (canvasHeight / 2 - defaultSize.height / 2) + offset;
        
        // Determine max zIndex
        const maxZ = components.length > 0 ? Math.max(...components.map(c => c.zIndex)) : 0;
        
        const baseComponent = {
          id,
          name: name ?? `${type.charAt(0).toUpperCase() + type.slice(1)} ${existingCount + 1}`,
          x: startX,
          y: startY,
          zIndex: maxZ + 1,
          duration: defaultDuration,
          ...defaultSize,
          loop: true, // Default loop to true
        };
        
        if (type === 'marquee') {
          component = {
            ...baseComponent,
            type: 'marquee',
            onscreenDuration: 20000, // Default 20s onscreen
            offscreenDuration: 5000, // Default 5s offscreen
            props: {
              text: 'New Marquee Text',
              speed: 50,
              separator: ' • ',
              fontFamily: 'inherit'
            }
          };
        } else if (type === 'journal') {
          component = {
            ...baseComponent,
            type: 'journal',
            onscreenDuration: 10000, // Default 10s onscreen
            offscreenDuration: 5000, // Default 5s offscreen
            props: {
              heading: 'Weekly Journal',
              subHeading: 'Week ' + (existingCount + 1),
              data: [
                { day: 'Mon', profit: 0 },
                { day: 'Tue', profit: 0 },
                { day: 'Wed', profit: 0 },
                { day: 'Thu', profit: 0 },
                { day: 'Fri', profit: 0 },
              ],
              showTotal: true,
              fontFamily: 'inherit'
            }
          };
        } else {
          component = {
            ...baseComponent,
            type: 'media',
            props: {
              src: '',
              objectFit: 'contain' as const
            }
          };
        }

        set((state) => ({
          components: [
            ...state.components,
            component,
          ],
          selectedComponentId: id,
        }));
        
        return id;
      },

      updateComponent: (id, updates) => {
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, ...updates } as OverlayComponent : c
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
             const others = components.filter(c => c.id !== id);
             return {
               components: [
                 ...others.map((c, i) => ({ ...c, zIndex: i + 1 })),
                 { ...component, zIndex: others.length + 1 }
               ]
             };
           } else if (direction === 'bottom') {
             const others = components.filter(c => c.id !== id);
             return {
               components: [
                 { ...component, zIndex: 1 },
                 ...others.map((c, i) => ({ ...c, zIndex: i + 2 }))
               ]
             };
           } else if (direction === 'up') {
             if (index === components.length - 1) return { components: state.components };
             const next = components[index + 1];
             components[index + 1] = component;
             components[index] = next;
             return {
               components: components.map((c, i) => ({ ...c, zIndex: i + 1 }))
             };
           } else if (direction === 'down') {
             if (index === 0) return { components: state.components };
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
        return getTheme(activeThemeId);
      }
    }),
    {
      name: 'trident-overlay-storage',
      partialize: (state) => ({ 
         components: state.components,
         activeThemeId: state.activeThemeId,
         canvasWidth: state.canvasWidth,
         canvasHeight: state.canvasHeight
      }), 
      storage: createJSONStorage(() => storage),
    }
  )
);
