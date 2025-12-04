import React, { useRef, useCallback, useState, Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOverlayStore } from '../../state/useOverlayStore';
import { CanvasItem } from './CanvasItem';
import { useSearchParams } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize, Settings } from 'lucide-react';
import { useCanvasZoom } from '../../hooks/useCanvasZoom';
import { useCanvasSelectors, useComponentSelectors, useThemeSelectors } from '../../state/selectors';

export const Canvas: React.FC = () => {
  const { width: canvasWidth, height: canvasHeight } = useCanvasSelectors();
  const { activeThemeId, getActiveTheme } = useThemeSelectors();
  const { 
    components, 
    updateComponent, 
    selectComponent, 
    selectedComponentId 
  } = useComponentSelectors();
  
  const theme = getActiveTheme();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCanvasFocused, setIsCanvasFocused] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { 
    scale, 
    autoFit, 
    setAutoFit, 
    zoomIn, 
    zoomOut, 
    fitToScreen, 
    handleWheel 
  } = useCanvasZoom({
    containerRef,
    canvasWidth,
    canvasHeight
  });

  // Auto-select component from URL param
  React.useEffect(() => {
    const selectId = searchParams.get('select');
    if (selectId) {
      selectComponent(selectId);
    }
  }, [searchParams, selectComponent]);

  const handleFocusCanvas = useCallback(() => setIsCanvasFocused(true), []);

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 relative overflow-hidden">
        {/* Canvas Properties Button */}
        <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => selectComponent(null)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                selectedComponentId === null
                  ? 'bg-violet-900/30 border-violet-500 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                  : 'bg-neutral-800/90 border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-700/90'
              } backdrop-blur`}
              title="Canvas Properties (Theme, Size, etc.)"
            >
              <Settings size={16} />
              <span className="text-sm font-medium">Canvas</span>
            </button>
        </div>

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
            {theme.wrapperComponent ? (
              <Suspense fallback={null}>
                <theme.wrapperComponent>
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
                </theme.wrapperComponent>
              </Suspense>
            ) : (
              components.map((comp) => (
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
              ))
            )}
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-800/90 backdrop-blur px-3 py-1.5 rounded-full border border-neutral-700 shadow-lg z-50">
            <button onClick={zoomOut} className="p-1 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white" title="Zoom Out">
                <ZoomOut size={14} />
            </button>
            <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="p-1 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white" title="Zoom In">
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
