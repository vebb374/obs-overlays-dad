import { useState, useLayoutEffect, useCallback } from 'react';

interface UseCanvasZoomProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasWidth: number;
  canvasHeight: number;
}

export const useCanvasZoom = ({ containerRef, canvasWidth, canvasHeight }: UseCanvasZoomProps) => {
  const [scale, setScale] = useState(1);
  const [autoFit, setAutoFit] = useState(true);

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const padding = 60;
    
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;
    
    const scaleX = availableWidth / canvasWidth;
    const scaleY = availableHeight / canvasHeight;
    
    const newScale = Math.min(scaleX, scaleY);
    
    setScale(Math.max(newScale, 0.1)); // Ensure roughly positive
    setAutoFit(true);
  }, [canvasWidth, canvasHeight, containerRef]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (autoFit) fitToScreen();
    };

    if (autoFit) {
      fitToScreen();
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasWidth, canvasHeight, autoFit, fitToScreen]);

  const zoomIn = () => {
    setAutoFit(false);
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setAutoFit(false);
    setScale(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setAutoFit(false);
      const delta = -e.deltaY;
      setScale(prev => {
        const newScale = prev * (1 + delta * 0.001);
        return Math.min(Math.max(newScale, 0.1), 5);
      });
    }
  };

  return {
    scale,
    autoFit,
    setAutoFit,
    zoomIn,
    zoomOut,
    fitToScreen,
    handleWheel
  };
};

