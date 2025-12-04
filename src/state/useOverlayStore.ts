import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { ComponentType, Theme } from '../types/theme';
import type { OverlayComponent } from '../types/overlay';

import { type CanvasSlice, createCanvasSlice } from './slices/canvasSlice';
import { type ThemeSlice, createThemeSlice } from './slices/themeSlice';
import { type ComponentSlice, createComponentSlice } from './slices/componentSlice';

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

export type { ComponentType, Theme, OverlayComponent };

export type OverlayState = CanvasSlice & ThemeSlice & ComponentSlice;

export const useOverlayStore = create<OverlayState>()(
  persist(
    (...a) => ({
      ...createCanvasSlice(...a),
      ...createThemeSlice(...a),
      ...createComponentSlice(...a),
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
