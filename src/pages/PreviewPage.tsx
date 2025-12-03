import React, { useLayoutEffect, useState } from 'react';
import { useOverlayStore } from '../state/useOverlayStore';
import { OverlayComponentRenderer } from '../components/overlay/OverlayComponentRenderer';

export const PreviewPage: React.FC = () => {
  const { components, getActiveTheme, canvasWidth, canvasHeight } = useOverlayStore();
  const theme = getActiveTheme();
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      
      // Fit to screen while maintaining aspect ratio
      const newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasWidth, canvasHeight]);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative bg-transparent"
      style={{ fontFamily: theme.fontFamily }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: canvasWidth,
          height: canvasHeight,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          overflow: 'hidden'
        }}
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
              zIndex: comp.zIndex
            }}
          >
            <OverlayComponentRenderer component={comp} theme={theme} />
          </div>
        ))}
      </div>
    </div>
  );
};
