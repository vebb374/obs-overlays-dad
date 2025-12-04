import React, { useLayoutEffect, useState, Suspense, useEffect } from 'react';
import { useOverlayStore } from '../state/useOverlayStore';
import { OverlayComponentRenderer } from '../components/overlay/OverlayComponentRenderer';
import { loadSceneFromUrl } from '../utils/storage';

export const PreviewPage: React.FC = () => {
  const { components, getActiveTheme, canvasWidth, canvasHeight } = useOverlayStore();
  const theme = getActiveTheme();
  const [scale, setScale] = useState(1);
  const [sceneSource, setSceneSource] = useState<string | null>(null);
  const [isSceneLoading, setIsSceneLoading] = useState(false);
  const [sceneError, setSceneError] = useState<string | null>(null);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sceneUrl = params.get('config');
    if (!sceneUrl) return;

    setSceneSource(sceneUrl);
    let aborted = false;

    const refreshMs = Number(params.get('refresh'));
    const shouldRefresh = Number.isFinite(refreshMs) && refreshMs > 0;
    let intervalId: number | undefined;

    const fetchScene = async () => {
      setIsSceneLoading(true);
      try {
        await loadSceneFromUrl(sceneUrl);
        if (!aborted) {
          setSceneError(null);
        }
      } catch (err) {
        if (!aborted) {
          const message = err instanceof Error ? err.message : 'Unable to load scene file';
          setSceneError(message);
        }
      } finally {
        if (!aborted) {
          setIsSceneLoading(false);
        }
      }
    };

    void fetchScene();
    if (shouldRefresh) {
      intervalId = window.setInterval(() => {
        void fetchScene();
      }, refreshMs);
    }

    return () => {
      aborted = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative bg-transparent"
      style={{ fontFamily: theme.fontFamily }}
    >
      {sceneSource && (isSceneLoading || sceneError) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs text-white bg-black/60 border border-white/10 z-50">
          {isSceneLoading ? 'Loading scene file...' : `Scene error: ${sceneError}`}
        </div>
      )}
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
        {theme.wrapperComponent ? (
          <Suspense fallback={null}>
            <theme.wrapperComponent>
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
            </theme.wrapperComponent>
          </Suspense>
        ) : (
          components.map(comp => (
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
          ))
        )}
      </div>
    </div>
  );
};
