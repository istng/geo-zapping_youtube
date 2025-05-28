import { useCallback, useEffect, useState } from 'react';

export function useVideoNavigation(videosLength: number, scrollToIndex: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleUp = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, scrollToIndex]);

  const handleDown = useCallback(() => {
    if (currentIndex < videosLength - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  }, [currentIndex, scrollToIndex, videosLength]);

  useEffect(() => {
    if (videosLength > 0) {
      scrollToIndex(currentIndex);
    }
  }, [currentIndex, videosLength]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        handleDown();
      } else if (event.key === 'ArrowUp') {
        handleUp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDown, handleUp]);

  return {
    currentIndex,
    setCurrentIndex,
    handleUp,
    handleDown
  };
}
