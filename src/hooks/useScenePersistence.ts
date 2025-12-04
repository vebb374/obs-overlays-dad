import { useEffect, useRef } from 'react';
import * as Storage from '../utils/storage';

const POLLING_INTERVAL = 2000; // 2 seconds

export const useScenePersistence = () => {
  const lastSeenTimestamp = useRef<number>(0);
  const hasLoadedInitial = useRef<boolean>(false);

  // Load initial state and set up polling
  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await fetch('/api/scene');
        if (!response.ok) return;
        
        const json: unknown = await response.json();
        
        // Linter struggles with resolving the Storage module exports here, seemingly treating them as error/any
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
        const data = Storage.normalizeConfig(json);
        const remoteTime = data.updatedAt ?? 0;

        // Load if it's the first time OR if remote is newer
        if (!hasLoadedInitial.current || remoteTime > lastSeenTimestamp.current) {
          Storage.applySceneConfig(data);
          lastSeenTimestamp.current = remoteTime;
          hasLoadedInitial.current = true;
        }
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      } catch (e) {
        console.error('Failed to poll scene:', e);
      }
    };

    // Initial load
    void fetchScene();

    const interval = setInterval(() => {
      void fetchScene();
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);
};
