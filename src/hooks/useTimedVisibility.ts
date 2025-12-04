import { useState, useEffect } from 'react';

interface UseTimedVisibilityProps {
  duration: number; // How long to stay on screen (ms)
  offscreenDuration?: number; // How long to stay off screen (ms)
  loop: boolean;
  autoStart?: boolean;
}

export const useTimedVisibility = ({
  duration,
  offscreenDuration,
  loop,
  autoStart = true,
}: UseTimedVisibilityProps) => {
  const [isVisible, setIsVisible] = useState(autoStart);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      // Stay visible for `duration` ms
      if (duration > 0) {
        timer = setTimeout(() => {
          setIsVisible(false);
        }, duration);
      }
    } else {
      // Hidden state
      if (loop) {
        const wait = offscreenDuration ?? 5000;
        timer = setTimeout(() => {
          setIsVisible(true);
        }, wait);
      }
    }

    return () => clearTimeout(timer);
  }, [isVisible, loop, duration, offscreenDuration]);

  return isVisible;
};


