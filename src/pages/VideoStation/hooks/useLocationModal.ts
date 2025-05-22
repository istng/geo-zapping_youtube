import { useState, useCallback } from 'react';

export function useLocationModal(setLocation: (coords: { lat: number; lon: number }) => void) {
  const [modalOpened, setModalOpened] = useState(false);

  const handleSelectCoordinates = useCallback((coords: { lat: number; lon: number }) => {
    setLocation(coords);
    setModalOpened(false);
  }, [setLocation]);

  return {
    modalOpened,
    setModalOpened,
    handleSelectCoordinates,
  };
}
