import { create } from 'zustand';
import type { ComponentType, Theme } from '../types/theme';
import type { OverlayComponent } from '../types/overlay';

import { type CanvasSlice, createCanvasSlice } from './slices/canvasSlice';
import { type ThemeSlice, createThemeSlice } from './slices/themeSlice';
import { type ComponentSlice, createComponentSlice } from './slices/componentSlice';

export type { ComponentType, Theme, OverlayComponent };

export type OverlayState = CanvasSlice & ThemeSlice & ComponentSlice;

export const useOverlayStore = create<OverlayState>()((...a) => ({
  ...createCanvasSlice(...a),
  ...createThemeSlice(...a),
  ...createComponentSlice(...a),
}));
