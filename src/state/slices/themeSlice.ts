import type { StateCreator } from 'zustand';
import { getTheme } from '../../themes/index';
import type { Theme } from '../../types/theme';
import type { OverlayState } from '../useOverlayStore';

export interface ThemeSlice {
  activeThemeId: string;
  themeOverrides: Partial<Theme['colors']>;
  setTheme: (themeId: string) => void;
  setThemeOverride: (colorKey: keyof Theme['colors'], value: string) => void;
  resetThemeOverrides: () => void;
  getActiveTheme: () => Theme;
}

export const createThemeSlice: StateCreator<OverlayState, [], [], ThemeSlice> = (set, get) => ({
  activeThemeId: 'dark-modern',
  themeOverrides: {},
  setTheme: (themeId) => set({ activeThemeId: themeId, themeOverrides: {} }),
  setThemeOverride: (colorKey, value) => 
    set((state) => ({
      themeOverrides: { ...state.themeOverrides, [colorKey]: value }
    })),
  resetThemeOverrides: () => set({ themeOverrides: {} }),
  getActiveTheme: () => {
    const { activeThemeId, themeOverrides } = get();
    const baseTheme = getTheme(activeThemeId);
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...themeOverrides
      }
    };
  }
});
