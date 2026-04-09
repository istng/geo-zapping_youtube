import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [fetchingMore, setFetchingMore] = useState(false);
  const fetchingMoreRef = useRef(false);

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

  const fetchMore = useCallback(async (count = 5) => {
    if (!location || loading || fetchingMoreRef.current) return;
    fetchingMoreRef.current = true;
    setFetchingMore(true);
    try {
      const res = await getVideos({
        location,
        maxResults: count,
        locationRadius: searchParams.locationRadius,
        order: searchParams.order,
      });
      setVideos((prev) => {
        const existing = new Set(prev);
        const newIds = res.videos.filter((id: string) => !existing.has(id));
        return newIds.length > 0 ? [...prev, ...newIds] : prev;
      });
    } catch {
      // silently fail — user still has existing videos
    } finally {
      fetchingMoreRef.current = false;
      setFetchingMore(false);
    }
  }, [location, searchParams, loading, getVideos]);

  return {
    videos,
    location,
    setLocation,
    searchParams,
    setSearchParams,
    loading,
    fetchMore,
    fetchingMore,
  };
}
