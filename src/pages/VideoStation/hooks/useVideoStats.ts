import { useEffect, useRef, useState } from 'react';

export function useVideoStats(videos: string[]) {
  const [statsModalOpened, setStatsModalOpened] = useState(false);
  const [statsIds, setStatsIds] = useState<string[]>([]);
  const prevVideosRef = useRef<string[]>([]);

  useEffect(() => {
    if (statsModalOpened) {
      const videosChanged =
        videos.length !== prevVideosRef.current.length ||
        videos.some((id, i) => id !== prevVideosRef.current[i]);
      if (videosChanged) {
        setStatsIds(videos);
        prevVideosRef.current = videos;
      }
    }
  }, [statsModalOpened, videos]);

  return {
    statsModalOpened,
    setStatsModalOpened,
    statsIds,
  };
}
