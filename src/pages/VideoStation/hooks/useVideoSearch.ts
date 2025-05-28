import { useEffect, useState } from 'react';
import { useVideoApi } from '../../../services/VideoApi/useVideoApi';

export function useVideoSearch() {
  const [videos, setVideos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchParams, setSearchParams] = useState({
    maxResults: 20,
    locationRadius: 3000,
    order: 'date',
  });
  const [loading, setLoading] = useState(true);

  // Use the memoized API service from the hook
  const { getVideos } = useVideoApi();

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
        maxResults: searchParams.maxResults,
        locationRadius: searchParams.locationRadius,
        order: searchParams.order,
      })
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
