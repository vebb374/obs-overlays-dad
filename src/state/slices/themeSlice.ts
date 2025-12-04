import type { StateCreator } from 'zustand';
import { getTheme } from '../../themes/index';
import type { Theme } from '../../types/theme';
import type { OverlayState } from '../useOverlayStore';

export interface ThemeSlice {
  activeThemeId: string;
  setTheme: (themeId: string) => void;
  getActiveTheme: () => Theme;
}

export const createThemeSlice: StateCreator<OverlayState, [], [], ThemeSlice> = (set, get) => ({
  activeThemeId: 'dark-modern',
  setTheme: (themeId) => set({ activeThemeId: themeId }),
  getActiveTheme: () => {
    const { activeThemeId } = get();
    return getTheme(activeThemeId);
  }
});

