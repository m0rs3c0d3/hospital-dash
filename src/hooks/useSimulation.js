import { useState, useEffect, useCallback, useRef } from 'react';

export const useSimulation = (maxHour = 47, initialHour = 36) => {
  const [currentHour, setCurrentHour] = useState(initialHour);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x
  const intervalRef = useRef(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle playback
  useEffect(() => {
    if (isPlaying) {
      const interval = 1000 / playbackSpeed; // Base interval is 1 second per hour
      intervalRef.current = setInterval(() => {
        setCurrentHour(prev => {
          if (prev >= maxHour) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, maxHour]);

  const play = useCallback(() => {
    if (currentHour >= maxHour) {
      setCurrentHour(0);
    }
    setIsPlaying(true);
  }, [currentHour, maxHour]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentHour(initialHour);
  }, [initialHour]);

  const goToStart = useCallback(() => {
    setIsPlaying(false);
    setCurrentHour(0);
  }, []);

  const goToEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentHour(maxHour);
  }, [maxHour]);

  const stepForward = useCallback(() => {
    setCurrentHour(prev => Math.min(prev + 1, maxHour));
  }, [maxHour]);

  const stepBackward = useCallback(() => {
    setCurrentHour(prev => Math.max(prev - 1, 0));
  }, []);

  const seekTo = useCallback((hour) => {
    setCurrentHour(Math.max(0, Math.min(hour, maxHour)));
  }, [maxHour]);

  const cycleSpeed = useCallback(() => {
    setPlaybackSpeed(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 4;
      return 1;
    });
  }, []);

  return {
    currentHour,
    isPlaying,
    playbackSpeed,
    play,
    pause,
    togglePlayback,
    reset,
    goToStart,
    goToEnd,
    stepForward,
    stepBackward,
    seekTo,
    cycleSpeed,
    maxHour,
    progress: (currentHour / maxHour) * 100
  };
};
