import { useState, useEffect } from 'react';

interface UseTimedVisibilityProps {
  duration: number; // duration to stay on screen (ms)
  offscreenDuration?: number; // duration to stay hidden (ms)
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
  const loopDisabled = loop && offscreenDuration === 0;

  useEffect(() => {
    if (!loopDisabled) return;
    let frame: number | undefined;
    if (!isVisible) {
      frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isVisible, loopDisabled]);

  useEffect(() => {
    if (loopDisabled) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isVisible) {
      const shouldAutoHide = duration > 0;
      if (shouldAutoHide) {
        timer = setTimeout(() => {
          setIsVisible(false);
        }, duration);
      }
    } else if (loop) {
      const wait = typeof offscreenDuration === 'number' ? offscreenDuration : 5000;
      timer = setTimeout(() => {
        setIsVisible(true);
      }, wait);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [duration, isVisible, loop, loopDisabled, offscreenDuration]);

  return loopDisabled ? true : isVisible;
};


