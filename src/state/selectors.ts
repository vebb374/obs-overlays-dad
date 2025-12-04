import { useShallow } from 'zustand/react/shallow';
import { useOverlayStore } from './useOverlayStore';

export const useCanvasSelectors = () => {
  return useOverlayStore(
    useShallow((state) => ({
      width: state.canvasWidth,
      height: state.canvasHeight,
      setCanvasSize: state.setCanvasSize,
    }))
  );
};

export const useThemeSelectors = () => {
  return useOverlayStore(
    useShallow((state) => ({
      activeThemeId: state.activeThemeId,
      setTheme: state.setTheme,
      getActiveTheme: state.getActiveTheme,
    }))
  );
};

export const useComponentSelectors = () => {
  return useOverlayStore(
    useShallow((state) => ({
      components: state.components,
      selectedComponentId: state.selectedComponentId,
      addComponent: state.addComponent,
      updateComponent: state.updateComponent,
      removeComponent: state.removeComponent,
      selectComponent: state.selectComponent,
      reorderComponent: state.reorderComponent,
    }))
  );
};

export const useSelectedComponent = () => {
  return useOverlayStore((state) => {
    if (!state.selectedComponentId) return null;
    return state.components.find((c) => c.id === state.selectedComponentId) ?? null;
  });
};


