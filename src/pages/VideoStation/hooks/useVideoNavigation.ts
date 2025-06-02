import { useCallback, useEffect, useState } from 'react';

export function useVideoNavigation(videosLength: number, scrollToIndex: any, loading: boolean = false) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);

  const handleUp = useCallback(() => {
    if (loading || currentIndex <= 0) return;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setShouldPlay(true);
  }, [currentIndex, scrollToIndex, loading]);

  const handleDown = useCallback(() => {
    if (loading || currentIndex >= videosLength - 1) return;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setShouldPlay(true);
  }, [currentIndex, scrollToIndex, videosLength, loading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (loading) return; // Disable keyboard navigation when loading
      
      if (event.key === 'ArrowDown') {
        handleDown();
      } else if (event.key === 'ArrowUp') {
        handleUp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDown, handleUp, loading]);

  return {
    currentIndex,
    setCurrentIndex,
    handleUp,
    handleDown,
    shouldPlay,
    setShouldPlay,
  };
}
