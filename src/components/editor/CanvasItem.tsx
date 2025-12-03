import { memo } from 'react';
import { Rnd } from 'react-rnd';
import { OverlayComponentRenderer } from '../overlay/OverlayComponentRenderer';
import { type OverlayComponent, type Theme } from '../../state/useOverlayStore';

interface CanvasItemProps {
  component: OverlayComponent;
  scale: number;
  isSelected: boolean;
  theme: Theme;
  onUpdate: (id: string, updates: Partial<OverlayComponent>) => void;
  onSelect: (id: string) => void;
  onFocusCanvas: () => void;
}

export const CanvasItem = memo(({
  component,
  scale,
  isSelected,
  theme,
  onUpdate,
  onSelect,
  onFocusCanvas
}: CanvasItemProps) => {
  return (
    <Rnd
      scale={scale}
      size={{ width: component.width, height: component.height }}
      position={{ x: component.x, y: component.y }}
      style={{ zIndex: component.zIndex }}
      onDragStop={(_e: any, d: any) => {
        onUpdate(component.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e: any, _direction: any, ref: HTMLElement, _delta: any, position: { x: number; y: number }) => {
        onUpdate(component.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      onDragStart={() => {
        onSelect(component.id);
        onFocusCanvas();
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent canvas click
        onSelect(component.id);
        onFocusCanvas();
      }}
      bounds="parent"
      className={isSelected ? "ring-2 ring-violet-500" : "hover:ring-1 hover:ring-violet-500/50"}
      enableResizing={isSelected}
    >
      <div className="w-full h-full relative group">
        <OverlayComponentRenderer component={component} theme={theme} />
        
        {!isSelected && (
          <div className="absolute -top-6 left-0 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {component.name}
          </div>
        )}
        
        <div className="absolute inset-0 z-10 bg-transparent" /> 
      </div>
    </Rnd>
  );
}, (prev, next) => {
  // Custom comparison for performance
  // Only re-render if:
  // 1. Component props changed (x, y, width, height, zIndex, props)
  // 2. Scale changed
  // 3. Selection state changed
  // 4. Theme changed
  return (
    prev.component === next.component && 
    prev.scale === next.scale &&
    prev.isSelected === next.isSelected &&
    prev.theme === next.theme
  );
});

