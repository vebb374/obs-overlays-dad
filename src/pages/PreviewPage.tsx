import React from 'react';
import { useOverlayStore } from '../state/useOverlayStore';
import { OverlayComponentRenderer } from '../components/overlay/OverlayComponentRenderer';

export const PreviewPage: React.FC = () => {
  const { components, getActiveTheme } = useOverlayStore();
  const theme = getActiveTheme();

  return (
    <div 
      className="w-full h-full overflow-hidden relative bg-transparent"
      style={{ fontFamily: theme.fontFamily }}
    >
      {components.map(comp => (
        <div 
          key={comp.id} 
          style={{ 
            position: 'absolute', 
            left: comp.x, 
            top: comp.y,
            width: comp.width,
            height: comp.height,
            zIndex: 10 // Base z-index
          }}
        >
          <OverlayComponentRenderer component={comp} theme={theme} />
        </div>
      ))}
    </div>
  );
};
