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
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      getVideos({
        location,
        search_query: 'test',
        maxResults: searchParams.maxResults,
        locationRadius: searchParams.locationRadius,
        order: searchParams.order,
      } as any)
        .then((res) => {
          setVideos(res.videos);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location, searchParams]);

  return {
    videos,
    location,
    setLocation,
    searchParams,
    setSearchParams,
    loading,
  };
}
