import { useEffect, useState } from 'react';
import { useVideoApi } from '../../../services/VideoApi/useVideoApi';

export interface VideoStatistics {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
  };
}

export function useVideoDetails(ids: string[]) {
  const [data, setData] = useState<VideoStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getVideoDetails } = useVideoApi();

  useEffect(() => {
    if (!ids.length) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    getVideoDetails(ids)
      .then((items) => {
        setData(items);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ids]);

  return { data, loading, error };
}
