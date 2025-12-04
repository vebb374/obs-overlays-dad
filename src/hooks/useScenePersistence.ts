import { useEffect, useRef } from 'react';
import { useOverlayStore, type OverlayState } from '../state/useOverlayStore';
import { applySceneConfig, createSceneSnapshot, type SceneConfig } from '../utils/storage';

const POLLING_INTERVAL = 2000; // 2 seconds
const DEBOUNCE_DELAY = 1000; // 1 second

export const useScenePersistence = () => {
  const lastSeenTimestamp = useRef<number>(0);
  const isRemoteUpdate = useRef<boolean>(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedInitial = useRef<boolean>(false);

  // Load initial state and set up polling
  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await fetch('/api/scene');
        if (!response.ok) return;
        
        const data = await response.json() as SceneConfig;
        const remoteTime = data.updatedAt ?? 0;

        // Load if it's the first time OR if remote is newer
        if (!hasLoadedInitial.current || remoteTime > lastSeenTimestamp.current) {
          // If it's first load and file is "empty" (version 1 only), we might skip
          // to preserve default initial state? 
          // User said "scene is being reset to empty".
          // If scene.json is {"version":1}, components is undefined -> [].
          // If we load it, we overwrite defaults with [].
          // But if the user wants persistence, the file IS the truth.
          // If the file is empty, the scene should be empty.
          // Unless we treat "no components" as "use defaults"?
          
          // Let's assume if components is missing, we DON'T overwrite existing state?
          // But applySceneConfig handles missing components by setting [].
          
          // Let's stick to "file is truth". 
          // But checking if it is effectively empty might be good.
          // SceneConfig from storage.ts: normalizeConfig handles missing fields.
          
          console.log('Received remote update:', remoteTime, 'Initial:', !hasLoadedInitial.current);
          isRemoteUpdate.current = true;
          applySceneConfig(data);
          lastSeenTimestamp.current = remoteTime;
          hasLoadedInitial.current = true;
          
          setTimeout(() => {
            isRemoteUpdate.current = false;
          }, 0);
        }
      } catch (e) {
        console.error('Failed to poll scene:', e);
      }
    };

    // Initial load
    fetchScene();

    const interval = setInterval(fetchScene, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to store changes and save
  useEffect(() => {
    const unsub = useOverlayStore.subscribe((state) => {
      if (isRemoteUpdate.current) {
        return;
      }

      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      saveTimeout.current = setTimeout(async () => {
        try {
            // Prepare snapshot
            // We must capture the state *now* (or passed state)
            // But state in subscribe callback is the latest.
            
            // We generate a new timestamp for our save
            const now = Date.now();
            const config = createSceneSnapshot(state);
            config.updatedAt = now;

            // Optimistically update our last seen so we don't re-apply our own save on next poll
            lastSeenTimestamp.current = now;

            await fetch('/api/scene', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            
            console.log('Saved scene:', now);
        } catch (e) {
            console.error('Failed to save scene:', e);
        }
      }, DEBOUNCE_DELAY);
    });

    return () => {
      unsub();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);
};

