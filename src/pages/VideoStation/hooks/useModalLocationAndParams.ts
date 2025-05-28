import { useEffect, useState } from 'react';

export function useModalLocationAndParams(location: { lat: number; lon: number } | null, searchParams: { locationRadius: number; order: string; maxResults: number }, modalOpened: boolean) {
  const [modalLocation, setModalLocation] = useState<{ lat: number; lon: number } | null>(location);
  const [modalParams, setModalParams] = useState({
    radius: searchParams.locationRadius,
    orderBy: searchParams.order,
    maxResults: searchParams.maxResults,
  });

  useEffect(() => {
    if (modalOpened) {
      setModalLocation(location);
      setModalParams({
        radius: searchParams.locationRadius,
        orderBy: searchParams.order,
        maxResults: searchParams.maxResults,
      });
    }
  }, [modalOpened, location, searchParams]);

  return {
    modalLocation,
    setModalLocation,
    modalParams,
    setModalParams,
  };
}
