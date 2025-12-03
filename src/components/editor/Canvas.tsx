import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOverlayStore } from '../../state/useOverlayStore';
import { CanvasItem } from './CanvasItem';
import { useSearchParams } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export const Canvas: React.FC = () => {
  const { 
    components, 
    updateComponent, 
    selectComponent, 
    selectedComponentId, 
    getActiveTheme,
    canvasWidth,
    canvasHeight 
  } = useOverlayStore(useShallow(state => ({
    components: state.components,
    updateComponent: state.updateComponent,
    selectComponent: state.selectComponent,
    selectedComponentId: state.selectedComponentId,
    getActiveTheme: state.getActiveTheme,
    activeThemeId: state.activeThemeId, // Subscribe to theme changes
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight
  })));
  
  const theme = getActiveTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCanvasFocused, setIsCanvasFocused] = useState(false);
  const [searchParams] = useSearchParams();
  const [scale, setScale] = useState(1);
  const [autoFit, setAutoFit] = useState(true); 

  // Auto-select component from URL param
  useEffect(() => {
    const selectId = searchParams.get('select');
    if (selectId) {
      selectComponent(selectId);
    }
  }, [searchParams, selectComponent]);

  const fitToScreen = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const padding = 60; // Increased padding
    
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;
    
    const scaleX = availableWidth / canvasWidth;
    const scaleY = availableHeight / canvasHeight;
    
    // Use the smaller scale to ensure it fits entirely within view
    // This is key for aspect ratio preservation - we scale uniformly
    const newScale = Math.min(scaleX, scaleY);
    
    setScale(newScale);
    setAutoFit(true);
  };

  // Handle auto-scaling
  useLayoutEffect(() => {
    const handleResize = () => {
        if (autoFit) fitToScreen();
    };

    if (autoFit) {
        fitToScreen();
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, canvasHeight, autoFit]);

  const handleZoomIn = () => {
    setAutoFit(false);
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setAutoFit(false);
    setScale(prev => Math.max(prev / 1.2, 0.1));
  };

  // Wheel zoom
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

  const handleFocusCanvas = useCallback(() => setIsCanvasFocused(true), []);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 relative overflow-hidden">
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden flex items-center justify-center"
          onClick={() => setIsCanvasFocused(false)}
          onWheel={handleWheel}
        >
          <div 
            ref={canvasRef}
            className={`relative shadow-2xl bg-[url('https://transparenttextures.com/patterns/dark-matter.png')] bg-neutral-900 transition-shadow duration-200 ${
              isCanvasFocused ? 'ring-2 ring-violet-500/50 shadow-[0_0_50px_rgba(139,92,246,0.1)]' : 'border border-neutral-800'
            }`} 
            style={{ 
              // Explicitly set width/height to match the overlay dimensions
              // The scaling transform handles visual sizing without changing these internal dimensions
              width: canvasWidth, 
              height: canvasHeight,
              minWidth: canvasWidth,
              minHeight: canvasHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              backgroundImage: 'linear-gradient(45deg, #1e1e1e 25%, transparent 25%), linear-gradient(-45deg, #1e1e1e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e1e1e 75%), linear-gradient(-45deg, transparent 75%, #1e1e1e 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              overflow: 'hidden' // Clip content that goes outside bounds (fixes Marquee overflow)
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === canvasRef.current) {
                selectComponent(null);
                setIsCanvasFocused(true);
              }
            }}
          >
            {components.map((comp) => (
              <CanvasItem
                key={comp.id}
                component={comp}
                scale={scale}
                isSelected={selectedComponentId === comp.id}
                theme={theme}
                onUpdate={updateComponent}
                onSelect={selectComponent}
                onFocusCanvas={handleFocusCanvas}
              />
            ))}
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-800/90 backdrop-blur px-3 py-1.5 rounded-full border border-neutral-700 shadow-lg z-50">
            <button onClick={handleZoomOut} className="p-1 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white" title="Zoom Out">
                <ZoomOut size={14} />
            </button>
            <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white" title="Zoom In">
                <ZoomIn size={14} />
            </button>
            <div className="w-px h-4 bg-neutral-700 mx-1" />
            <button onClick={() => { setAutoFit(true); fitToScreen(); }} className="p-1 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white" title="Fit to Screen">
                <Maximize size={14} />
            </button>
        </div>
    </div>
  );
};
