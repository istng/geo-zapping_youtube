import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!ids.length) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(import.meta.env.VITE_MATTW_YT_DETAILS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch video details');
        const json = await res.json();
        setData(json.items || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ids]);

  return { data, loading, error };
}
