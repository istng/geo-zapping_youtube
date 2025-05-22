import { useEffect, useState } from 'react';
import { getVideos } from './getVideos';

export function useVideoSearch() {
  const [videos, setVideos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchParams, setSearchParams] = useState({
    maxResults: 20,
    locationRadius: 3000,
    order: 'date',
  });

  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setLocation({ lat: -34.6089399, lon: -58.3896266 });
        }
      );
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      getVideos({
        location,
        search_query: 'test',
        maxResults: searchParams.maxResults,
        locationRadius: searchParams.locationRadius,
        order: searchParams.order,
      } as any).then((res) => {
        setVideos(res.videos);
        // Optionally handle loading/error here
      });
    }
  }, [location, searchParams]);

  return {
    videos,
    location,
    setLocation,
    searchParams,
    setSearchParams,
  };
}
