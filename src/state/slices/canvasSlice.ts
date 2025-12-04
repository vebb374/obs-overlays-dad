import type { StateCreator } from 'zustand';
import type { OverlayState } from '../useOverlayStore';

export interface CanvasSlice {
  canvasWidth: number;
  canvasHeight: number;
  setCanvasSize: (width: number, height: number) => void;
}

export const createCanvasSlice: StateCreator<OverlayState, [], [], CanvasSlice> = (set) => ({
  canvasWidth: 1920,
  canvasHeight: 1080,
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
});

