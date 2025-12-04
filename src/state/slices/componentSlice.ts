import type { StateCreator } from 'zustand';
import type { OverlayComponent } from '../../types/overlay';
import type { ComponentType } from '../../types/theme';
import { createOverlayComponent, INITIAL_COMPONENTS } from '../factories/overlayComponentFactory';
import type { OverlayState } from '../useOverlayStore';

export interface ComponentSlice {
  components: OverlayComponent[];
  selectedComponentId: string | null;
  
  addComponent: (type: ComponentType, name?: string) => string;
  updateComponent: (id: string, updates: Partial<OverlayComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  reorderComponent: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
}

export const createComponentSlice: StateCreator<OverlayState, [], [], ComponentSlice> = (set, get) => ({
  components: INITIAL_COMPONENTS,
  selectedComponentId: null,

  addComponent: (type, name) => {
    const { canvasWidth, canvasHeight, components } = get();
    const component = createOverlayComponent(type, components, canvasWidth, canvasHeight, name);

    set((state) => ({
      components: [...state.components, component],
      selectedComponentId: component.id,
    }));
    
    return component.id;
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
});

